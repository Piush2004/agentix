---
title: Agentix
emoji: 🧭
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
short_description: Agentic data intelligence pipeline - upload, clean, train, explain
startup_duration_timeout: 30m
---

# Agentix

An agentic data-intelligence platform: upload a dataset and a real nine-stage
pipeline (Upload → Parser → Profiling → Cleaning → EDA → Feature Engineering
→ Training → Evaluation → Report) processes it end to end, with a grounded
AI assistant you can ask about the real results.

**Demo notes for this Space:**
- Storage is ephemeral here - data resets whenever the Space rebuilds, since
  no persistent storage volume is attached.
- The AI Assistant requires a local Ollama model, which isn't available in
  this container; it will honestly report "unavailable" rather than
  fabricate a response. The rest of the pipeline (upload, cleaning, EDA,
  training, evaluation) is fully real and unaffected.

Demo login: `admin@agentix.com` / `admin`
