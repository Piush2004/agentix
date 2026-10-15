import os
import traceback
import pandas as pd
import numpy as np
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from core.agents.base import BaseAgent
from core.services.data_service import data_service
from core.engines.base import ProcessingEngine
from sklearn.linear_model import SGDClassifier, SGDRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler, LabelEncoder

class PipelineInput(BaseModel):
    dataset_name: str
    file_path: Optional[str] = None
    user_id: Optional[str] = "guest_user"

class PipelineOutput(BaseModel):
    status: str
    message: str
    result: Dict[str, Any]

# 1. Upload Agent
class UploadAgent(BaseAgent[PipelineInput, PipelineOutput]):
    def validate(self, data: Any) -> PipelineInput:
        return PipelineInput(**data) if isinstance(data, dict) else data
        
    def execute(self, validated_data: PipelineInput, engine: ProcessingEngine) -> PipelineOutput:
        if validated_data.file_path and not os.path.exists(validated_data.file_path):
            raise FileNotFoundError(f"File not found: {validated_data.file_path}")
        return PipelineOutput(status="success", message="Uploaded successfully", result={"file_path": validated_data.file_path})
        
    def cleanup(self) -> None:
        pass
        
    def rollback(self) -> None:
        pass

# 2. Parser Agent
class ParserAgent(BaseAgent[PipelineInput, PipelineOutput]):
    def validate(self, data: Any) -> PipelineInput:
        return PipelineInput(**data) if isinstance(data, dict) else data
        
    def execute(self, validated_data: PipelineInput, engine: ProcessingEngine) -> PipelineOutput:
        file_path = validated_data.file_path
        parquet_path = f"{file_path}.parquet"
        
        # We rely on engine to abstract chunked vs full read
        data_obj = engine.load_dataset(file_path)
        engine.save_dataset(data_obj, parquet_path)
        
        # Retrieve computed dataset for row/col metadata
        df = engine.compute(engine.load_dataset(parquet_path))
        rows, cols = df.shape

        # Decide the target column once, here, while column order still
        # matches the raw upload. FeatureEngineeringAgent later appends new
        # one-hot columns at the end, which shifts what "the last column" is -
        # if TrainingAgent re-derives the target as columns[-1] after that,
        # it silently trains on the wrong column AND leaks the real target
        # in as an input feature (confirmed: produced a "target" entry inside
        # feature_importances). Persisting the name now keeps it stable.
        target_column = df.columns[-1]

        data_service.store_dataset(validated_data.dataset_name, {"parquet_path": parquet_path, "target_column": target_column}, change_summary="Parsed dataset to parquet")
        return PipelineOutput(status="success", message="Parsed and stored as Parquet", result={"rows": rows, "cols": cols, "parquet_path": parquet_path, "target_column": target_column})

    def cleanup(self) -> None:
        pass
        
    def rollback(self) -> None:
        pass

# 4. Cleaning Agent
class CleaningAgent(BaseAgent[PipelineInput, PipelineOutput]):
    def validate(self, data: Any) -> PipelineInput:
        return PipelineInput(**data) if isinstance(data, dict) else data
        
    def execute(self, validated_data: PipelineInput, engine: ProcessingEngine) -> PipelineOutput:
        dataset_info = data_service.get_dataset(validated_data.dataset_name)
        parquet_path = dataset_info["parquet_path"]
        
        df = engine.compute(engine.load_dataset(parquet_path))

        num_cols = df.select_dtypes(include=[np.number]).columns
        cat_cols = df.select_dtypes(exclude=[np.number]).columns

        # Justify the imputation strategy per column instead of a blind constant fill,
        # which corrupts numeric columns with impossible values (e.g. age/income = 0).
        imputation: Dict[str, Any] = {}
        for col in num_cols:
            missing_count = int(df[col].isna().sum())
            if missing_count == 0:
                continue
            if missing_count == len(df):
                # Column has zero observed values - mean()/median() are themselves NaN
                # here (no data to average), so fillna(NaN) is a silent no-op that would
                # otherwise be reported as a successful fill. Report the true state
                # instead of a false "filled: N" success claim.
                imputation[col] = {
                    "method": "none",
                    "filled": 0,
                    "reason": "column has no observed values at all; no mean/median could be computed, so it was left as-is",
                }
                continue
            skew = df[col].skew()
            skew = 0.0 if pd.isna(skew) else float(skew)
            if abs(skew) > 0.5:
                fill_value = df[col].median()
                method, reason = "median", f"skew={skew:.2f} exceeds 0.5, median is robust to the skew"
            else:
                fill_value = df[col].mean()
                method, reason = "mean", f"skew={skew:.2f} is near-symmetric, mean is representative"
            df[col] = df[col].fillna(fill_value)
            imputation[col] = {"method": method, "filled": missing_count, "reason": reason}

        for col in cat_cols:
            missing_count = int(df[col].isna().sum())
            if missing_count == 0:
                continue
            mode_series = df[col].mode(dropna=True)
            fill_value = mode_series.iloc[0] if not mode_series.empty else "Unknown"
            df[col] = df[col].fillna(fill_value)
            imputation[col] = {"method": "mode", "filled": missing_count, "reason": f"categorical column, most frequent value is '{fill_value}'"}

        new_parquet_path = f"{parquet_path}.cleaned.parquet"
        engine.save_dataset(df, new_parquet_path)

        # Merge rather than replace - overwriting would silently drop
        # target_column (set by ParserAgent), breaking target selection
        # further down the pipeline.
        data_service.store_dataset(validated_data.dataset_name, {**dataset_info, "parquet_path": new_parquet_path}, change_summary="Cleaned dataset")
        return PipelineOutput(status="success", message="Cleaning complete", result={"cleaned": True, "imputation": imputation})

    def cleanup(self) -> None:
        pass
        
    def rollback(self) -> None:
        pass

# 5. EDA Agent
class EDAAgent(BaseAgent[PipelineInput, PipelineOutput]):
    def validate(self, data: Any) -> PipelineInput:
        return PipelineInput(**data) if isinstance(data, dict) else data
        
    def execute(self, validated_data: PipelineInput, engine: ProcessingEngine) -> PipelineOutput:
        dataset_info = data_service.get_dataset(validated_data.dataset_name)
        parquet_path = dataset_info["parquet_path"]
        df = engine.compute(engine.load_dataset(parquet_path))
        
        num_cols = df.select_dtypes(include=[np.number]).columns

        corr_matrix = {}
        if len(num_cols) > 1:
            df_sample = df[list(num_cols)].sample(frac=0.1) if len(df) > 1000 else df[list(num_cols)]
            corr = df_sample.corr().fillna(0).to_dict()
            corr_matrix = corr

        statistics = {}
        for col in num_cols:
            series = df[col].dropna()
            if series.empty:
                continue
            skew = series.skew()
            statistics[col] = {
                "mean": float(series.mean()),
                "std": float(series.std()) if len(series) > 1 else 0.0,
                "min": float(series.min()),
                "max": float(series.max()),
                "missing": int(df[col].isna().sum()),
                "skew": 0.0 if pd.isna(skew) else float(skew),
            }

        return PipelineOutput(status="success", message="EDA complete", result={"correlations": corr_matrix, "statistics": statistics})

    def cleanup(self) -> None:
        pass
        
    def rollback(self) -> None:
        pass

# 6. Feature Engineering Agent
class FeatureEngineeringAgent(BaseAgent[PipelineInput, PipelineOutput]):
    def validate(self, data: Any) -> PipelineInput:
        return PipelineInput(**data) if isinstance(data, dict) else data
        
    def execute(self, validated_data: PipelineInput, engine: ProcessingEngine) -> PipelineOutput:
        dataset_info = data_service.get_dataset(validated_data.dataset_name)
        parquet_path = dataset_info["parquet_path"]
        target_column = dataset_info.get("target_column")
        df = engine.compute(engine.load_dataset(parquet_path))

        # The target column must never be encoded/dropped here - it has to
        # reach TrainingAgent unchanged and by its original name. Encoding it
        # would also mean training on a mangled/derived version of the very
        # thing being predicted.
        cat_cols = df.select_dtypes(exclude=[np.number]).columns
        if target_column is not None:
            cat_cols = cat_cols.drop(target_column, errors="ignore")

        # One-hot encoding a column with many distinct values (e.g. a raw ID
        # or a per-row-unique timestamp string) creates one new column per
        # distinct value. On real-world messy data this explodes into tens
        # of thousands of columns, which then OOMs StandardScaler/training
        # downstream (confirmed: a 50K-row dataset with a near-unique ID
        # column drove this stage's memory past 2.8GB before being killed).
        # Cap one-hot encoding to genuinely low-cardinality columns; anything
        # above the cap is frequency-encoded instead (one safe numeric
        # column), and constant columns (zero information) are dropped.
        MAX_ONEHOT_CARDINALITY = 50

        onehot_cols, freq_encoded_cols, dropped_constant_cols = [], [], []
        for col in cat_cols:
            n_unique = df[col].nunique(dropna=True)
            if n_unique <= 1:
                df = df.drop(columns=[col])
                dropped_constant_cols.append(col)
            elif n_unique <= MAX_ONEHOT_CARDINALITY:
                df[col] = df[col].astype('category')
                onehot_cols.append(col)
            else:
                freq = df[col].value_counts(normalize=True)
                df[col] = df[col].map(freq).astype(float)
                freq_encoded_cols.append(col)

        if onehot_cols:
            df = pd.get_dummies(df, columns=onehot_cols)

        new_parquet_path = f"{parquet_path}.fe.parquet"
        engine.save_dataset(df, new_parquet_path)

        # Merge rather than replace - see the same note in CleaningAgent.
        data_service.store_dataset(validated_data.dataset_name, {**dataset_info, "parquet_path": new_parquet_path}, change_summary="Feature engineering")
        return PipelineOutput(status="success", message="FE complete", result={
            "features": list(df.columns),
            "onehot_encoded_columns": onehot_cols,
            "frequency_encoded_columns": freq_encoded_cols,
            "dropped_constant_columns": dropped_constant_cols,
        })

    def cleanup(self) -> None:
        pass
        
    def rollback(self) -> None:
        pass

# 7. Training Agent
class TrainingAgent(BaseAgent[PipelineInput, PipelineOutput]):
    def validate(self, data: Any) -> PipelineInput:
        return PipelineInput(**data) if isinstance(data, dict) else data
        
    def execute(self, validated_data: PipelineInput, engine: ProcessingEngine) -> PipelineOutput:
        dataset_info = data_service.get_dataset(validated_data.dataset_name)
        parquet_path = dataset_info["parquet_path"]
        
        df = engine.compute(engine.load_dataset(parquet_path))
        columns = list(df.columns)

        if not columns:
            raise ValueError("Dataset has no columns to train on.")

        # Use the target column name captured by ParserAgent before any
        # column-reordering feature-engineering happened, instead of
        # re-deriving columns[-1] here. After one-hot encoding, the last
        # column is an arbitrary encoded dummy, not the real target -
        # re-deriving it here previously trained on the wrong column AND
        # leaked the real target in as an input feature.
        target = dataset_info.get("target_column")
        if target is None or target not in columns:
            raise ValueError(f"Target column '{target}' not found in dataset (available: {columns}).")
        features = [c for c in columns if c != target]

        X = df[features].fillna(0).select_dtypes(include=[np.number])
        y = df[target]

        if X.shape[1] == 0:
            raise ValueError("No numeric features available to train on.")

        # Detect problem type instead of always forcing a binary classifier: a numeric
        # target with many distinct values (e.g. a continuous score) is a regression
        # problem, not a 0/1 classification problem. Uses an absolute threshold rather
        # than a unique-value ratio, since a ratio misfires on small datasets (e.g. a
        # binary 0/1 column has a 40% unique-ratio with only 5 rows).
        n_unique = y.nunique(dropna=True)
        is_regression = pd.api.types.is_numeric_dtype(y) and n_unique > 20

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # SGD's gradient updates are scale-sensitive: unscaled features spanning very
        # different ranges (e.g. age ~0-75 vs income ~0-130000) make it diverge instead
        # of converge, producing unusable predictions despite "successful" training.
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        if is_regression:
            problem_type = "regression"
            # SGDRegressor is just as scale-sensitive about the TARGET as it is about
            # the features above: fitting directly against an unscaled target (e.g.
            # house prices in the hundreds of thousands) makes a single partial_fit
            # pass produce huge gradients and converge nowhere near the optimum -
            # verified empirically: on a dataset generated from a known linear
            # relationship plus small noise (where R^2 should be ~0.99), the
            # unscaled-target model scored R^2 ~ 0.37. Scaling y the same way X is
            # scaled, then inverse-transforming predictions back to real units before
            # they're used for evaluation/reporting, fixes this without changing the
            # units MAE/RMSE are reported in.
            y_scaler = StandardScaler()
            y_train_scaled = y_scaler.fit_transform(y_train.to_numpy().reshape(-1, 1)).ravel()
            model = SGDRegressor(random_state=42)
            model.partial_fit(X_train_scaled, y_train_scaled)
            y_pred_scaled = model.predict(X_test_scaled)
            y_pred = y_scaler.inverse_transform(y_pred_scaled.reshape(-1, 1)).ravel()
        else:
            problem_type = "classification"
            # SGDClassifier.partial_fit requires labels sklearn recognizes as a
            # discrete type (int/bool/str) via type_of_target. A numeric target
            # that is legitimately a classification target by cardinality (e.g.
            # only 3 distinct values) but happens to hold non-integer floats -
            # observed for real on a live dataset with values like -1.25/0/1.25 -
            # is rejected outright with "ValueError: Unknown label type", crashing
            # training even though the cardinality-based classification decision
            # above was correct. Encode to plain integer class labels for fitting
            # regardless of the target's original dtype, then decode predictions
            # back so y_pred stays in the same value-space as y_test (which is
            # left unencoded) for EvaluationAgent's accuracy/F1 comparison.
            label_encoder = LabelEncoder()
            y_train_encoded = label_encoder.fit_transform(y_train)
            classes = np.unique(y_train_encoded)
            if len(classes) < 2:
                raise ValueError(f"Target column '{target}' has fewer than 2 distinct classes; cannot train a classifier.")
            model = SGDClassifier(loss='log_loss', random_state=42)
            model.partial_fit(X_train_scaled, y_train_encoded, classes=classes)
            y_pred_encoded = model.predict(X_test_scaled)
            y_pred = label_encoder.inverse_transform(y_pred_encoded)

        # Real per-feature importance from the trained linear model's coefficients
        # (mean absolute weight across classes for multi-class), instead of a
        # fabricated {"feature1": 0.6} placeholder. Persisted in the stage's own
        # result so it survives a backend restart, unlike data_service below.
        coef = np.atleast_2d(model.coef_)
        importance = np.abs(coef).mean(axis=0)
        feature_importances = {
            feat: float(imp) for feat, imp in sorted(
                zip(X.columns, importance), key=lambda kv: kv[1], reverse=True
            )
        }

        # Stash the held-out predictions for EvaluationAgent — PipelineInput only carries
        # dataset_name/file_path/user_id between stages, so real values must go through
        # data_service rather than the pipeline's own input/output chaining.
        data_service.store_dataset(validated_data.dataset_name, {
            **dataset_info,
            "problem_type": problem_type,
            "y_test": y_test,
            "y_pred": y_pred,
        }, change_summary="Trained model")

        return PipelineOutput(
            status="success",
            message=f"Training complete using partial_fit ({problem_type})",
            result={
                "model_id": f"sgd_{problem_type}_v1",
                "model_type": type(model).__name__,
                "target": target,
                "problem_type": problem_type,
                "feature_importances": feature_importances,
            },
        )

    def cleanup(self) -> None:
        pass
        
    def rollback(self) -> None:
        pass

# 8. Evaluation Agent
class EvaluationAgent(BaseAgent[PipelineInput, PipelineOutput]):
    def validate(self, data: Any) -> PipelineInput:
        return PipelineInput(**data) if isinstance(data, dict) else data
        
    def execute(self, validated_data: PipelineInput, engine: ProcessingEngine) -> PipelineOutput:
        dataset_info = data_service.get_dataset(validated_data.dataset_name) or {}
        y_test = dataset_info.get("y_test")
        y_pred = dataset_info.get("y_pred")
        problem_type = dataset_info.get("problem_type")

        if y_test is None or y_pred is None:
            raise ValueError("No held-out predictions found; TrainingAgent must run before EvaluationAgent.")

        def _clean(value: float) -> Optional[float]:
            # NaN is not valid JSON; r2_score is undefined (NaN) when the test split
            # has fewer than 2 samples, since it needs variance in y_true to compute.
            value = float(value)
            return None if np.isnan(value) else value

        if problem_type == "regression":
            mae = mean_absolute_error(y_test, y_pred)
            rmse = mean_squared_error(y_test, y_pred) ** 0.5
            r2 = r2_score(y_test, y_pred) if len(y_test) > 1 else float("nan")
            result = {"problem_type": problem_type, "mae": _clean(mae), "rmse": _clean(rmse), "r2": _clean(r2)}
        else:
            # sklearn's accuracy_score/f1_score call type_of_target on the raw
            # values first and reject anything it infers as "continuous" - which
            # includes a legitimate small-cardinality classification target that
            # happens to hold non-integer floats (e.g. -1.25/0/1.25, the same
            # label shape TrainingAgent had to LabelEncode around above).
            # Comparing as strings sidesteps that misclassification without
            # changing which rows count as correct: y_test/y_pred are compared
            # by value equality either way, and both come from the same
            # original label values (y_pred was decoded back via the training
            # LabelEncoder's own classes_), so string formatting is identical
            # for equal values.
            y_test_labels = pd.Series(y_test).astype(str)
            y_pred_labels = pd.Series(y_pred).astype(str)
            acc = accuracy_score(y_test_labels, y_pred_labels)
            f1 = f1_score(y_test_labels, y_pred_labels, average="weighted", zero_division=0)
            result = {"problem_type": problem_type, "accuracy": float(acc), "f1_score": float(f1)}

        return PipelineOutput(status="success", message="Evaluation complete", result=result)

    def cleanup(self) -> None:
        pass
        
    def rollback(self) -> None:
        pass

# 9. Report Agent
class ReportAgent(BaseAgent[PipelineInput, PipelineOutput]):
    def validate(self, data: Any) -> PipelineInput:
        return PipelineInput(**data) if isinstance(data, dict) else data

    def execute(self, validated_data: PipelineInput, engine: ProcessingEngine) -> PipelineOutput:
        # No PDF renderer is wired up (no library for it, and building one is a
        # separate feature). Rather than pointing at a file that was never
        # generated, report real summary data pulled from the actual pipeline
        # state, and say plainly that a downloadable file isn't available yet.
        dataset_info = data_service.get_dataset(validated_data.dataset_name) or {}
        parquet_path = dataset_info.get("parquet_path")

        summary: Dict[str, Any] = {
            "dataset_name": validated_data.dataset_name,
            "target_column": dataset_info.get("target_column"),
            "problem_type": dataset_info.get("problem_type"),
            "pdf_available": False,
            "pdf_url": None,
            "message": "PDF export is not implemented yet. The summary below reflects this run's real pipeline results.",
        }

        if parquet_path:
            try:
                df = engine.compute(engine.load_dataset(parquet_path))
                summary["rows"] = int(df.shape[0])
                summary["cols"] = int(df.shape[1])
            except Exception:
                pass

        return PipelineOutput(status="success", message="Report summary generated", result=summary)

    def cleanup(self) -> None:
        pass
        
    def rollback(self) -> None:
        pass
