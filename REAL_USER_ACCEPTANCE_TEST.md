# Real User Acceptance Test (UAT) Report

**Objective**: End-to-end testing of Agentix mimicking real user interactions.
**Executed**: Automatically via Browser Automation (Playwright).

## 1. Authentication Test
- ✅ Login successful.

## 2. Dataset Pipeline Tests
### Testing Dataset: Small Dataset (`test_small.csv`)
- ✅ Navigated to Data Dock.
- ✅ File selected for upload.
- ✅ Pipeline Processing Started.
- ✅ Pipeline completed successfully.
- ✅ Automatically redirected to Insights.
- ✅ Verified Insights components are loaded.
- ✅ State persisted after page reload.

### Testing Dataset: Medium Dataset (`test_medium.csv`)
- ✅ Navigated to Data Dock.
- ✅ File selected for upload.
- ✅ Pipeline Processing Started.
- ✅ Pipeline completed successfully.
- ✅ Automatically redirected to Insights.
- ✅ Verified Insights components are loaded.
- ✅ State persisted after page reload.

### Testing Dataset: Missing Values (`test_missing.csv`)
- ✅ Navigated to Data Dock.
- ✅ File selected for upload.
- ✅ Pipeline Processing Started.
- ✅ Pipeline completed successfully.
- ✅ Automatically redirected to Insights.
- ✅ Verified Insights components are loaded.
- ✅ State persisted after page reload.

### Testing Dataset: Duplicate Values (`test_duplicates.csv`)
- ✅ Navigated to Data Dock.
- ✅ File selected for upload.
- ✅ Pipeline Processing Started.
- ✅ Pipeline completed successfully.
- ✅ Automatically redirected to Insights.
- ✅ Verified Insights components are loaded.
- ✅ State persisted after page reload.

### Testing Dataset: Corrupted CSV (`test_corrupted.csv`)
- ✅ Navigated to Data Dock.
- ✅ File selected for upload.
- ✅ Pipeline Processing Started.
- ✅ Expected pipeline failure successfully handled: {"stage": "ParserAgent", "agent": "ParserAgent", "dataset": "test_corrupted.csv", "root_cause": "ParserError", "stack_trace": "Traceback (most recent call last):\n File \"D:\\Projects\\Agentic Data Intelligence Platform\\backend\\core\\agents\\base.py\", line 71, in run\n output = self.execute(validated_input, engine)\n File \"D:\\Projects\\Agentic Data Intelligence Platform\\backend\\core\\agents\\pipeline_agents.py\", line 49, in execute\n data_obj = engine.load_dataset(file_path)\n File \"D:\\Projects\\Agentic Data Intelligence Platform\\backend\\core\\engines\\base.py\", line 30, in load_dataset\n return pd.read_csv(source_path)\n ~~~~~~~~~~~^^^^^^^^^^^^^\n File \"D:\\Projects\\Agentic Data Intelligence Platform\\backend\\.venv\\Lib\\site-packages\\pandas\\io\\parsers\\readers.py\", line 873, in read_csv\n return _read(filepath_or_buffer, kwds)\n File \"D:\\Projects\\Agentic Data Intelligence Platform\\backend\\.venv\\Lib\\site-packages\\pandas\\io\\parsers\\readers.py\", line 306, in _read\n return parser.read(nrows)\n ~~~~~~~~~~~^^^^^^^\n File \"D:\\Projects\\Agentic Data Intelligence Platform\\backend\\.venv\\Lib\\site-packages\\pandas\\io\\parsers\\readers.py\", line 1947, in read\n ) = self._engine.read( # type: ignore[attr-defined]\n ~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n nrows\n ^^^^^\n )\n ^\n File \"D:\\Projects\\Agentic Data Intelligence Platform\\backend\\.venv\\Lib\\site-packages\\pandas\\io\\parsers\\c_parser_wrapper.py\", line 215, in read\n chunks = self._reader.read_low_memory(nrows)\n File \"pandas/_libs/parsers.pyx\", line 832, in pandas._libs.parsers.TextReader.read_low_memory\n File \"pandas/_libs/parsers.pyx\", line 897, in pandas._libs.parsers.TextReader._read_rows\n File \"pandas/_libs/parsers.pyx\", line 868, in pandas._libs.parsers.TextReader._tokenize_rows\n File \"pandas/_libs/parsers.pyx\", line 885, in pandas._libs.parsers.TextReader._check_tokenize_status\n File \"pandas/_libs/parsers.pyx\", line 2084, in pandas._libs.parsers.raise_parser_error\npandas.errors.ParserError: Error tokenizing data. C error: EOF inside string starting at row 4\n", "suggested_fix": "Review the stack trace for the exact point of failure.", "message": "Error tokenizing data. C error: EOF inside string starting at row 4"}

### Testing Dataset: Invalid Format (`test_invalid.txt`)
- ✅ Navigated to Data Dock.
- ✅ File selected for upload.
- ✅ Pipeline Processing Started.
- ✅ Expected pipeline failure successfully handled: Invalid file type. Please upload a CSV, Excel, or JSON file.

### Testing Dataset: Large Dataset (`bench_20mb.csv`)
- ✅ Navigated to Data Dock.
- ✅ File selected for upload.
- ✅ Pipeline Processing Started.
- ✅ Pipeline completed successfully.
- ✅ Automatically redirected to Insights.
- ✅ Verified Insights components are loaded.
- ✅ State persisted after page reload.

## 3. Session Persistence Test
- ✅ Checked logout/clear session.