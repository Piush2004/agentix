# 10GB Stress Test Report

## Overview
Stress testing of the newly upgraded chunked upload and streaming ML pipeline to ensure it handles datasets up to 10GB.

## Tested Edge Cases
- **Missing Values**: Handled correctly during Cleaning stage.
- **Duplicate Rows**: Duplicates inserted to test robustness.
- **Mixed Data Types**: Various types including NaNs, floats, ints, and strings.
- **High-cardinality categorical data**: Introduced 1M unique values in categorical columns to test OOM resistance.

## Results Summary
| Dataset Size | Status | Message |
|---|---|---|
