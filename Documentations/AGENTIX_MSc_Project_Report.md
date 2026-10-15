<!--
==============================================================================
FORMATTING SPECIFICATION — CHRIST (Deemed to be University), Dept. of Computer
Science, PROJECT REPORT GUIDELINES 2026-2027. Markdown cannot render fonts,
margins or border rules directly; this block is the authoritative spec to
apply when this file is typeset into the final .docx/.pdf. Every heading
below is annotated inline with which rule applies to it.

Font family (whole document):      Times New Roman
Chapter titles ("CHAPTER 1" etc.): 16pt, Bold, ALL CAPS, Centered
Side headings (1.1, 2.1, ...):     12pt, Bold, ALL CAPS
Sub-headings (1.1.1, ...):         12pt, Bold
Body text:                         12pt, Normal
Line spacing:                      1.5
Paper size:                        A4, one-sided printing
Binding:                           Hard binding, white cover (final PG major project)
Margins:                           Left 1.5in · Right 1in · Top 1in · Bottom 1in
Header:                            Project name (left) · page number (right) ·
                                    10pt · border line beneath
Footer:                            "Department of Computer Science, Christ
                                    University" · 10pt · border line above
Header/Footer suppressed on:       Title page, Certificate page, Table of Contents
Page numbering:                    Lower-case roman (iii, iv, v ...) from the
                                    Acknowledgements page through the prelims;
                                    Arabic numerals (1, 2, 3 ...) restart at
                                    Chapter 1 (via a section break)
Figure captions:                   Below the figure, Times New Roman 10pt,
                                    numbered per chapter (e.g. Fig. 3.2)
Table captions:                    Above the table, Times New Roman 10pt,
                                    numbered per chapter (e.g. Table 3.2)
Page-break rules:                  Never end a page on a heading alone,
                                    or on a single orphan line of a new
                                    paragraph — push either to the next page.
M.Sc. designation on Title/
Certificate pages:                 Guideline p.9 item 8 states this must read
                                    "M.Sc. (Computer Science)". The existing
                                    source content instead uses "Master of
                                    Science (Data Science)" throughout, which
                                    is presumably the degree actually being
                                    read for. FLAGGED, not silently resolved —
                                    confirm the correct programme name with
                                    the guide/registrar before final printing
                                    and set it consistently on both pages.
==============================================================================
-->

# AGENTIX: AN AI-POWERED AGENTIC DATA INTELLIGENCE PLATFORM FOR AUTOMATED DATA ANALYSIS, MACHINE LEARNING, AND BUSINESS INSIGHT GENERATION

*(Title page text — Times New Roman 20pt Bold, centered; all other text on this page 16pt)*

**by**

**Piush Kole** (Register No. 2548421)
**Thrilok M** (Register No. 2548430)

**Under the guidance of**

**Dr. Gobinath R**
*[Designation — to be confirmed]*
Department of Computer Science
CHRIST (Deemed to be University)
Bangalore Yeshwanthpur Campus

A Project report submitted in partial fulfilment of the requirements
for the award of degree of Master of Science (Data Science) of
CHRIST (Deemed to be University)

**AUGUST – 2026**

*(No header/footer on this page, per guideline.)*

---

## CERTIFICATE

*(No header/footer on this page, per guideline.)*

It is certified that this project report entitled **AGENTIX: AN AI-POWERED AGENTIC DATA INTELLIGENCE PLATFORM FOR AUTOMATED DATA ANALYSIS, MACHINE LEARNING, AND BUSINESS INSIGHT GENERATION** has been submitted to CHRIST (Deemed to be University), Bangalore, as project work, as partial fulfilment of the requirement for the award of the degree of **MASTER OF SCIENCE (Data Science)**. This work has been completed by **Piush Kole (Reg. No. 2548421)** and **Thrilok M (Reg. No. 2548430)** under my supervision and they have put in the required attendance.

&nbsp;

| Head of the Department | Project Guide |
|---|---|

&nbsp;

**Valued-by:**

1. Name: __________________  Register Number: __________
2. Name: __________________  Register Number: __________

Examination Centre: CHRIST (Deemed to be University)
Date of Exam: __________

---

## DECLARATION

*(No header/footer on this page, per guideline.)*

We hereby certify that the work presented in this project report is our own genuine work and has been carried out by us under the supervision of **Dr. Gobinath R**, Department of Computer Science, CHRIST (Deemed to be University). The work embodied in this project report has not been submitted for a degree or diploma in any other University.

Date: ______________
Place: ______________

**Piush Kole** (2548421)
**Thrilok M** (2548430)

**Dr. Gobinath R**
*Internal Guide*

---

## ACKNOWLEDGEMENT

*(Page numbering: lower-case roman begins here.)*

We would like to express our sincere gratitude to all those who have contributed to the successful completion of our Specialization Project. Their support and guidance have been invaluable, and we are deeply thankful for their assistance throughout this journey.

First and foremost, we would like to extend our heartfelt thanks to Dr. Fr Joseph C C, Vice-Chancellor, Dr. Fr. Benny Thomas, Campus Director, Dr. Joby Thomas, Dean, Dr. Fr. Biju K C, Campus Associate Director, and Dr. Raghunanthan G, Associate Dean, CHRIST (Deemed to be University) Yeshwanthpur Campus, for letting us carry out our specialisation project of M.Sc. Data Science on the campus.

We would like to extend our heartfelt thanks to Dr. Vinay M, Head of the Department of Computer Science, CHRIST (Deemed to be University), Bangalore Yeshwanthpur Campus, for fostering a conducive learning environment that has been instrumental in shaping our academic experience.

We are also immensely grateful to our project guide, **Dr. Gobinath R**, for the expertise, mentorship, and unwavering support extended throughout this project. Their patience and dedication to our growth as data scientists have been instrumental in the successful completion of this work.

We would like to thank all the faculty members of the Department of Computer Science for their help in completing the project work successfully. We would also like to thank our fellow students and colleagues for their camaraderie, which made this academic journey both enjoyable and enriching. Last but not least, we want to express our gratitude to our families and friends for their unwavering support, understanding, and encouragement throughout this challenging but rewarding journey.

In conclusion, this project would not have been possible without the guidance and support of the individuals mentioned above and the collective effort of everyone who played a part in our academic pursuit. Thank you all for your contributions.

**Piush Kole** (2548421)
**Thrilok M** (2548430)

---

## ABSTRACT

*(≤200 words, single-spaced, no sub-headings or bullets — verified 200 words.)*

Organisations and individual users increasingly hold structured datasets they lack the time, expertise, or tooling to analyse end to end. Agentix is an agentic data intelligence platform that coordinates nine specialised agents — Upload, Parser, Profiling, Cleaning, Exploratory Data Analysis, Feature Engineering, Training, Evaluation, and Report — behind a Next.js dashboard and a FastAPI backend, letting a user with limited programming knowledge move from a raw CSV file to a trained model and a plain-language explanation of the results. This report documents the verified, implemented state of the prototype after an extensive audit and remediation cycle. Authentication was hardened against an unauthenticated admin-escalation defect and an anonymous-user mapping defect. Six API routes that silently fabricated demonstration data were corrected to return honest, real, or empty results. Persistence was consolidated onto SQLite across the Prisma frontend and SQLAlchemy backend without data loss, and a fabricated report-PDF endpoint was replaced with a truthful data summary. The nine-stage pipeline was exercised end-to-end on a real dataset, with every stage output verified as genuine rather than mocked. The report distinguishes verified functionality from unused schema and future work, and reports limitations, particularly the loss of in-process pipeline state on backend restart, honestly rather than concealing them.

**Keywords:** agentic data intelligence, automated data pipeline, workflow orchestration, missing-value imputation, machine learning evaluation, explainable AI, grounded conversational assistant, authentication security, honest software behaviour.

---

## TABLE OF CONTENTS

*(No header/footer on this page, per guideline. Generate via Word's References → Table of Contents → automatic field once headings are applied with the built-in Heading 1/2/3 styles, then References → Update Table.)*

- Acknowledgements — iv
- Abstract — v
- List of Tables
- List of Figures
- List of Abbreviations
- 1. Introduction — 1
  - 1.1 Problem Description
  - 1.2 Existing System
  - 1.3 Project Scope
  - 1.4 Objectives
  - 1.5 Motivation and Significance
  - 1.6 Contributions of Agentix
  - 1.7 Organization of the Report
- 2. System Analysis
  - 2.1 Functional Specifications
    - 2.1.1 Stakeholders
    - 2.1.2 User Personas
    - 2.1.3 Functional Requirements
    - 2.1.4 Assumptions and Dependencies
  - 2.2 Block Diagram
  - 2.3 System Requirements
    - 2.3.1 Hardware Requirements
    - 2.3.2 Software Requirements
    - 2.3.3 Non-Functional Requirements
  - 2.4 Related Work and Existing System Comparison
    - 2.4.1 Research Gap
  - 2.5 Use Case Analysis
- 3. System Design
  - 3.1 System Architecture
    - 3.1.1 Request Lifecycle Walkthrough
  - 3.2 Module Design
    - 3.2.1 BaseAgent Lifecycle Contract
  - 3.3 Database Design
    - 3.3.1 Table Structure (Data Dictionary)
    - 3.3.2 Data Flow Diagram
    - 3.3.3 ER Diagram
  - 3.4 System Configuration
  - 3.5 Interface Design
    - 3.5.1 User Interface Screen Design
    - 3.5.2 Application Flow: Workflow State Machine
  - 3.6 Reports Design
  - 3.7 Methodology and Algorithmic Design
    - 3.7.1 – 3.7.10 (see full chapter)
  - 3.8 Proposed Decision Intelligence Architecture
- 4. Implementation
  - 4.1 Coding Standard
  - 4.2 Screen Shots
  - 4.3 API Implementation
  - 4.4 Workflow Persistence
  - 4.5 Pipeline Agent Implementation
  - 4.6 Machine Learning Implementation
  - 4.7 Database Implementation
  - 4.8 Decision Intelligence Implementation
  - 4.9 Error Handling
  - 4.10 Security Implementation
  - 4.11 Frontend State Management Implementation
- 5. Testing
  - 5.1 Testing Strategy
  - 5.2 Unit and Integration Test Cases
  - 5.3 End-to-End Workflow Validation
  - 5.4 API and Security Testing
  - 5.5 Test Reports and Results Summary
- 6. Conclusions
  - 6.1 Design and Implementation Issues
  - 6.2 Advantages and Limitations
    - 6.2.1 Advantages
    - 6.2.2 Limitations
  - 6.3 Future Enhancements
- Appendices A–H
- References

---

## LIST OF TABLES

*(Placed before List of Figures per the department's mandated page order.)*

| Table No. | Table Name | Page No. |
|---|---|---|
| 1.1 | Summary of project contributions and their verification status | ? |
| 2.1 | Project stakeholders and their interest in the system | ? |
| 2.2 | Representative user personas | ? |
| 2.3 | Functional requirements and verified implementation status | ? |
| 2.4 | Minimum and recommended hardware for local development and evaluation | ? |
| 2.5 | Software stack actually exercised by the verified runtime | ? |
| 2.6 | Non-functional requirements and how they are currently addressed | ? |
| 2.7 | Comparison of Agentix against existing categories of tooling | ? |
| 3.1 | Module specification for the nine pipeline agents | ? |
| 3.2 | SQLAlchemy data dictionary (backend/core/models/models.py) | ? |
| 3.3 | Prisma data dictionary (frontend/prisma/schema.prisma, provider = sqlite) | ? |
| 3.4 | Verified runtime configuration | ? |
| 3.5 | Verified frontend pages | ? |
| 4.1 | FastAPI endpoint inventory (/api/v1 prefix) | ? |
| 4.2 | Authentication and authorisation defects corrected during this project | ? |
| 5.1 | New regression tests authored during this project | ? |
| 5.2 | Golden-path verification results | ? |
| 5.3 | Automated backend test suite results (excluding pre-existing orphaned-import files) | ? |
| 6.1 | Proposed future enhancements | ? |
| B.1 | PipelineStage.status values and their meaning | ? |
| C.1 | Worked examples of the imputation decision rule | ? |
| D.1 | Metric definitions and appropriate use (as computed by EvaluationAgent) | ? |
| E.1 | Detailed acceptance criteria for the six new regression tests | ? |
| G.1 | Risk register (identified during this project) | ? |
| H.1 | Production readiness checklist against the verified current state | ? |

*Page numbers are set once final pagination is fixed in the typeset document (use Word's automatic caption/cross-reference numbering, not manual entry).*

---

## LIST OF FIGURES

| Fig. No. | Figure Name | Page No. |
|---|---|---|
| 2.1 | High-Level Block Diagram of Agentix | ? |
| 2.2 | Use Case Diagram | ? |
| 3.1 | Overall System Architecture of Agentix | ? |
| 3.2 | End-to-End Pipeline Workflow (9 Sequential Agent Stages) | ? |
| 3.3 | Level-1 Data Flow Diagram | ? |
| 3.4 | Entity-Relationship Diagram (Logical, Prisma-side) | ? |
| 3.5 | Frontend Workflow State Machine | ? |
| 3.6 | Missing-Value Imputation Decision Flow (CleaningAgent, as implemented) | ? |
| 3.7 | Machine Learning Training and Evaluation Pipeline (TrainingAgent + EvaluationAgent) | ? |
| 3.8 | Proposed Decision Intelligence Architecture (Not Implemented) | ? |
| 4.1 | Login screen (NextAuth credentials provider) | ? |
| 4.2 | Workspace dashboard after authentication | ? |
| 4.3 | Dataset upload page (Datasets / data-dock) | ? |
| 4.4 | AI Assistant chat interface (agent-console) | ? |
| H.1 | Proposed Production Deployment Architecture | ? |

---

## LIST OF ABBREVIATIONS

| Abbreviation | Expansion |
|---|---|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| AutoML | Automated Machine Learning |
| CDP | Chrome DevTools Protocol |
| CRUD | Create, Read, Update, Delete |
| CSV | Comma-Separated Values |
| DB | Database |
| DFD | Data Flow Diagram |
| EDA | Exploratory Data Analysis |
| ER Diagram | Entity-Relationship Diagram |
| F1 | F1-Score (harmonic mean of precision and recall) |
| FR | Functional Requirement |
| HTTP | Hypertext Transfer Protocol |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| LLM | Large Language Model |
| MAE | Mean Absolute Error |
| ML | Machine Learning |
| MSc | Master of Science |
| NFR | Non-Functional Requirement |
| ORM | Object-Relational Mapper |
| PDF | Portable Document Format |
| R² | Coefficient of Determination |
| REST | Representational State Transfer |
| RMSE | Root Mean Squared Error |
| SGD | Stochastic Gradient Descent |
| SQL | Structured Query Language |
| UI | User Interface |
| XAI | Explainable Artificial Intelligence |

---
*(Page numbering switches from lower-case roman to Arabic numerals here, restarting at 1, via a section break — per guideline.)*

# CHAPTER 1
## INTRODUCTION
*(Chapter title: 16pt Bold Caps Centered. Side headings below: 12pt Bold Caps.)*

### 1.1 PROBLEM DESCRIPTION

The volume of structured, tabular data generated by organisations, researchers and individual users has grown far faster than the pool of people who can competently clean, explore, model and interpret it. A typical analytical workflow — inspecting a dataset for quality problems, handling missing values, engineering features, selecting and training an appropriate model, evaluating that model with the correct metrics, and communicating the result to a non-technical stakeholder — requires familiarity with several distinct tools (spreadsheet software, a notebook environment, a modelling library, and a reporting tool) and a working knowledge of statistics and machine learning. For a business user, a student, or an early-stage researcher without a dedicated data science team, this combination of tooling fragmentation and required expertise is a genuine barrier: the data exists, but the insight does not follow automatically from it.

Agentix is a prototype platform that attempts to close part of this gap by orchestrating the analytical workflow as a sequence of specialised, auditable processing stages — referred to in this report as agents — behind a single web interface. A user uploads a dataset; the platform parses it, profiles its structure and quality, cleans it using a documented imputation strategy, explores it statistically, engineers features suitable for modelling, trains a classification or regression model appropriate to the target column, evaluates that model with standard metrics, and finally allows the user to ask natural-language questions about the results through an assistant that is grounded in the pipeline's own output rather than in a generic language model response. The problem this project addresses is therefore not merely "can a machine learning model be trained automatically" — a question already well studied under the heading of AutoML — but "can an entire workflow, from a raw file to a verifiable, explainable result, be made accessible through one coherent, honestly-reported system, with every stage's output persisted and traceable."

### 1.2 EXISTING SYSTEM

Before Agentix, the practical alternatives available to the target user fall into three broad categories, each with a distinct limitation relevant to this project. Notebook-based workflows (Jupyter, RStudio) give complete analytical flexibility but require the user to write code, manage environment dependencies, and manually re-run cells after any change — there is no persisted, resumable notion of "the workflow" independent of the notebook file itself. Business-intelligence dashboards (Power BI, Tableau, Looker) present polished visualisations but generally stop at descriptive analytics; they do not train predictive models or explain, in natural language, why a model reached a particular conclusion. Automated machine learning platforms (H2O AutoML, Google AutoML Tables, AutoGluon) automate model selection and hyper-parameter search competently, but treat data cleaning and business communication as someone else's problem, and typically assume the input data is already reasonably clean and tabular in a compatible format. None of these three categories combine persistent, inspectable workflow state, agent-decomposed processing stages, and a conversational explanation layer grounded in the platform's own computed results, in a single product aimed at a non-specialist user. This gap is elaborated further, with a formal comparison table, in Chapter 2.

A fourth category is worth naming separately because it is easy to conflate with Agentix's own AI Assistant feature: general-purpose conversational AI tools (a chat interface backed by a large language model with no access to the user's actual data pipeline). Such a tool can discuss data science in the abstract, or reason plausibly about a small pasted excerpt, but it cannot verify its own claims against a persisted, real computation the way a grounded assistant can. This distinction — between an assistant that answers from general knowledge and one that answers from a specific, checkable, already-computed result — motivated the explicit grounding design described in Section 3.7.9 and verified in Chapter 5, and is the reason this report is careful to describe Agentix's chat feature as "grounded" rather than simply "AI-powered".

### 1.3 PROJECT SCOPE

This report describes the scope of the Agentix prototype honestly, distinguishing what has been implemented and verified from what has only been designed or proposed. This distinction is maintained consistently throughout the report using explicit labelling wherever a claim could otherwise be ambiguous.

#### 1.3.1 Implemented Scope (Verified)

- Credentials-based authentication with a real, persisted user record, JWT-based backend sessions, and route-level protection on both the Next.js middleware and the FastAPI dependency layers.
- Chunked dataset upload, real Parquet-backed storage, and a nine-stage sequential pipeline (Upload, Parser, Profiling, Cleaning, EDA, Feature Engineering, Training, Evaluation, Report) executed as FastAPI background tasks and persisted as WorkflowRun / PipelineStage rows in SQLite.
- Real data profiling (row/column counts, missing-value percentages, duplicate rows, per-column schema), a documented mean/median/mode imputation strategy, correlation-based exploratory analysis, one-hot / frequency feature encoding, and SGD-based classification or regression training with scikit-learn, evaluated using standard metrics.
- An AI assistant (chat) endpoint that grounds its answers in the dataset's own pipeline results and explicitly declines to answer, rather than fabricating a response, when no local language model or no relevant pipeline data is available.
- A dashboard, dataset manager, analysis/insights view, intelligence-reports view, workflow history view, and administrative system-health view, implemented as Next.js pages communicating with the FastAPI backend over REST.

#### 1.3.2 Explicitly Out of Scope for This Iteration

- Redesigning or rebuilding the previously-existing "Cognitive Brain" / memory / reasoning-engine architecture, whose source files were removed from the codebase prior to this project phase.
- Migrating the production database away from SQLite; PostgreSQL remains a documented, container-defined option (Section 8.4) rather than the verified runtime configuration.
- Building a real dataset-fingerprinting or cross-run strategy-recommendation engine ("Decision Intelligence"), which is discussed in Section 3.8 strictly as proposed future architecture.
- Visual redesign of the user interface, or the addition of net-new end-user features beyond honesty and correctness fixes to the existing surface area.

### 1.4 OBJECTIVES

The primary objective of this project is to take an existing, partially working, and in places dishonestly-behaving prototype and turn it into a secure, correctly connected, and truthfully reporting demonstrable application, without attempting a ground-up architectural rewrite. This primary objective decomposes into the following specific objectives:

- To verify and, where necessary, correct the round trip between the user interface, the FastAPI backend, the local Ollama language model, and back to the user interface for the AI Assistant feature, ensuring the model's answer is grounded in the currently selected dataset's real pipeline output rather than in a scripted or hallucinated response.
- To remove authentication and authorisation defects that allowed unauthenticated administrator escalation, silently mapped anonymous requests onto an arbitrary existing user, and allowed a development-only authentication bypass to remain reachable outside development environments.
- To identify and remove every code path that fabricated demonstration data (users, reports, workspaces, activity log entries, notifications, sessions) into the production database, replacing each with an honest empty state where no real data exists.
- To determine, rather than assume, which database technology is actually exercised at runtime by each half of the application, and to establish one coherent, data-preserving persistence strategy.
- To exercise the complete pipeline — upload through report generation — end-to-end on a real dataset, verifying each stage's output through direct inspection rather than through the presence of an HTTP 200 status code alone.
- To document, precisely and without exaggeration, which parts of the system are implemented, which exist only as unused schema or installed-but-unexercised dependencies, and which remain proposed future work.

### 1.5 MOTIVATION AND SIGNIFICANCE

Two observations motivate this specific project. The first is pedagogical: building a multi-stage, agent-decomposed data pipeline surfaces a wide range of genuine software-engineering problems that a single Jupyter notebook never exposes — request chunking for large file uploads, background task orchestration, database-backed resumability, authentication and authorisation across two separate runtimes, and the tension between demonstration polish and factual accuracy in a user interface. Working through these problems, and documenting how they were found and fixed, is itself a substantial contribution to the authors' understanding of applied data engineering.

The second observation is practical and, the authors believe, transferable beyond this specific project: software that silently fabricates data — a hardcoded "Welcome back, Sarah" message, a seeded fake teammate, a PDF download link that points at a file that was never generated — is a class of defect that automated testing based purely on HTTP status codes will not catch, because the request still "succeeds". Distinguishing an application that returns 200 OK from an application that tells the truth required a systematic audit methodology, described in Chapter 7, that this report argues is broadly applicable to any AI-adjacent product under development pressure to appear more complete than it is.

### 1.6 CONTRIBUTIONS OF AGENTIX

**Table 1.1: Summary of project contributions and their verification status**

| # | Contribution | Verification |
|---|---|---|
| 1 | Nine-stage agent-decomposed analytical pipeline with database-backed, resumable workflow state | Verified end-to-end (Ch. 7) |
| 2 | Chat assistant grounded in real, persisted pipeline output rather than a scripted or hallucinated answer | Verified via browser round-trip (Ch. 7) |
| 3 | Hardened authentication: no unauthenticated privilege escalation, no anonymous-to-first-user mapping, fail-closed dev bypass | Verified via curl and browser (Ch. 4, 7) |
| 4 | Elimination of production fake-data seeding across six API routes | Verified via authenticated fetch calls returning honest empty state (Ch. 7) |
| 5 | Single, coherent, data-preserving SQLite persistence strategy across frontend and backend | Verified: 31 datasets / 33k+ runs intact post-migration |
| 6 | Auditable, documented missing-value imputation strategy with a recorded per-column reason | Verified by code inspection (Ch. 5) |
| 7 | Honest ReportAgent behaviour (no fabricated PDF URL) | Verified by regression test (Ch. 7, Appendix E) |

### 1.7 ORGANIZATION OF THE REPORT

Chapter 2 reviews existing systems and situates Agentix's design against related categories of tooling, closing with a research gap statement. Chapter 3 presents the full system analysis and design, including the architecture, module specification, database design, and interface design. Chapter 4 documents the implementation itself, including coding standards, screenshots of the running application, and the API surface. Chapter 5 (Testing) reports the testing strategy, the automated regression tests written during this project, and the verified results of a complete golden-path browser walkthrough. Chapter 6 concludes with a candid discussion of design and implementation issues, advantages and limitations, and future enhancements. Supporting material — API contracts, the workflow state model, sample decision rules, evaluation metric definitions, test cases, a sample user workflow, a risk register, and production-readiness criteria — is provided in Appendices A through H.

---

# CHAPTER 2
## SYSTEM ANALYSIS

### 2.1 FUNCTIONAL SPECIFICATIONS

This section identifies the stakeholders and representative user personas the system is designed for, and specifies the functional requirements the prototype targets. Each requirement is marked with its verified implementation status, determined by direct inspection of the running application and its source code rather than by design intent alone.

#### 2.1.1 Stakeholders

**Table 2.1: Project stakeholders and their interest in the system**

| Stakeholder | Interest / Concern |
|---|---|
| Business user | Wants a trained model and a plain-language explanation of a dataset without writing code. |
| Data analyst / student | Wants to inspect intermediate stages (profiling, EDA, feature engineering) and trust that results are real. |
| System administrator | Wants visibility into system health, authenticated access control, and no silent fabricated data reaching end users. |
| Project supervisor / examiner | Wants a clear, honest account of what has been built and verified versus proposed. |

#### 2.1.2 User Personas

**Table 2.2: Representative user personas**

| Persona | Background | Primary Goal | Pain Point Addressed |
|---|---|---|---|
| Business User ("Priya") | Marketing analyst, spreadsheet-literate, no Python | Understand why a churn dataset behaves the way it does | Cannot write cleaning / modelling code herself |
| Data Analyst ("Rahul") | SQL and BI-tool literate, some statistics background | Verify data quality and inspect model metrics before trusting a result | BI tools stop at descriptive charts; do not train or evaluate models |
| Student / Researcher ("Meera") | Learning applied ML, limited compute | Run a full pipeline on a coursework dataset and see each stage's reasoning | Notebook workflows do not persist or explain intermediate decisions |
| Administrator ("Dev") | Maintains the deployment | Confirm the system is authenticated, healthy, and not leaking fabricated data | Prior build silently seeded fake demo records into production tables |

#### 2.1.3 Functional Requirements

Table 2.3 lists the functional requirements exercised by this project. "Implemented" indicates the requirement is realised by real, verified code; "Partially Implemented" indicates a real endpoint exists but returns an honest "not implemented" response for part of its scope (by design, in preference to a fabricated success); "Not Implemented" indicates the requirement remains proposed.

**Table 2.3: Functional requirements and verified implementation status**

| ID | Requirement | Status |
|---|---|---|
| FR-01 | User authentication (credentials login, session, logout) | Implemented |
| FR-02 | Dataset upload | Implemented |
| FR-03 | Chunked upload for large files | Implemented |
| FR-04 | Dataset parsing to a columnar (Parquet) format | Implemented |
| FR-05 | Dataset profiling (rows, columns, missingness, duplicates, schema) | Implemented |
| FR-06 | Data quality assessment | Implemented (profiling only; outlier count is a fixed placeholder value, see Section 6.3) |
| FR-07 | Missing value analysis and imputation | Implemented (mean / median / mode strategy, Section 3.7.3) |
| FR-08 | Data cleaning | Implemented |
| FR-09 | Exploratory data analysis (correlation, per-column statistics) | Implemented |
| FR-10 | Feature engineering (encoding) | Implemented |
| FR-11 | Model training (classification / regression) | Implemented (SGD-based linear models only, Section 3.7.7) |
| FR-12 | Model evaluation with standard metrics | Implemented |
| FR-13 | Result visualisation (Insights / Intelligence Reports pages) | Implemented |
| FR-14 | Report generation (downloadable document) | Not Implemented (honest "unavailable" response, Section 3.6) |
| FR-15 | Workflow monitoring (status of a running pipeline) | Implemented |
| FR-16 | Persistent workflow history | Implemented |
| FR-17 | AI assistant conversational interaction, grounded in pipeline data | Implemented |
| FR-18 | Cross-run "Decision Intelligence" strategy recommendation | Not Implemented (proposed, Section 3.8) |
| FR-19 | Administrative system-health monitoring | Implemented |

#### 2.1.4 Assumptions and Dependencies

The functional requirements above are scoped against several explicit assumptions, stated here so that the requirements are not read more broadly than the verified implementation supports. First, the platform assumes a single, flat prediction target per dataset — the last column, frozen by ParserAgent at parse time (Section 3.7.1) — and does not support multi-target or time-series forecasting workloads. Second, the platform assumes the uploaded file is already in a tabular, row-and-column structure (CSV, Excel, or JSON convertible to a flat table); it does not parse unstructured text, images, or nested/hierarchical JSON beyond a flat record shape. Third, the authentication model assumes a single organisation-level administrator role rather than a fine-grained permission matrix, which is sufficient for the demonstrable prototype this report describes but is flagged as a scope boundary for any future multi-tenant deployment (Section 6.3, item 10). Finally, the AI Assistant's grounding depends on a locally reachable Ollama instance; if none is configured, the feature degrades to an honest "unavailable" message (Section 3.7.9) rather than a non-functional platform.

### 2.2 BLOCK DIAGRAM

Figure 2.1 gives a top-level block view of the system before the layered architecture is developed in full in Section 3.1. A user interacts with the Next.js frontend, which authenticates the session and forwards analytical requests over REST to the FastAPI backend; the backend dispatches work to the pipeline agents, which in turn call into the scikit-learn machine-learning layer and, for the AI assistant, the local Ollama language-model layer.

**Fig. 2.1: High-Level Block Diagram of Agentix**
*[Insert diagram: Browser → Next.js Frontend → FastAPI Backend → {Pipeline Agents → scikit-learn} and {AI Assistant → Ollama}]*

### 2.3 SYSTEM REQUIREMENTS

#### 2.3.1 Hardware Requirements

**Table 2.4: Minimum and recommended hardware for local development and evaluation**

| Component | Minimum | Recommended |
|---|---|---|
| Processor | Dual-core, 2.0 GHz | Quad-core, 2.5 GHz or better |
| RAM | 8 GB | 16 GB (dask/feature-engineering steps benefit from headroom) |
| Disk | 5 GB free (datasets + SQLite files + node_modules) | 20 GB free SSD |
| Network | Not required for local-only operation | Required only if a remote Ollama endpoint or cloud database is used |

#### 2.3.2 Software Requirements

**Table 2.5: Software stack actually exercised by the verified runtime**

| Layer | Technology | Verified Version |
|---|---|---|
| Frontend framework | Next.js (App Router, Turbopack) | 15.5.19 |
| Frontend UI library | React | 19.1.0 |
| Frontend language | TypeScript | 5.x |
| Frontend auth | NextAuth (Auth.js) | 5.0.0-beta.31 |
| Frontend ORM | Prisma / @prisma/client | 6.2.0 |
| Frontend state | Zustand | 5.0.14 |
| Frontend data-fetch / charts | TanStack Query 5.101.0, Recharts 3.8.1, Plotly.js 3.x | – |
| Backend framework | FastAPI | – |
| Backend ORM | SQLAlchemy | – |
| Backend ML | scikit-learn (SGDClassifier / SGDRegressor, StandardScaler) | – |
| Backend data handling | pandas, NumPy, PyArrow/fastparquet | – |
| Local LLM runtime | Ollama (HTTP API, /api/generate) | – |
| Database (verified) | SQLite (both frontend/prisma/dev.db and backend/agentix.db) | – |
| Database (installed, not exercised) | PostgreSQL client (psycopg2-binary), Redis client / rq | installed, unused in the code paths inspected |

#### 2.3.3 Non-Functional Requirements

**Table 2.6: Non-functional requirements and how they are currently addressed**

| Category | Requirement | Current Treatment |
|---|---|---|
| Performance | Large-file upload must not block the request thread | Chunked upload + FastAPI BackgroundTasks; no dedicated task queue (Section 6.3) |
| Reliability | A pipeline stage failure must not leave a run in an ambiguous state | PipelineException wraps every stage; WorkflowRun/PipelineStage rows are marked failed with a recorded root cause |
| Availability | Protected pages must not be reachable without a session | Node.js-runtime middleware.ts guards the entire (app) route group |
| Security | No unauthenticated privilege escalation; no anonymous-to-arbitrary-user mapping | Fixed during this project (Section 4.10); verified via curl and browser |
| Maintainability | Each pipeline stage should be independently testable | Every agent subclasses BaseAgent with validate/execute/cleanup/rollback |
| Usability | Workflow state must be visible without polling forever on failure | Explicit IDLE → UPLOADING → PROCESSING → COMPLETED/FAILED state machine (Section 3.5.2) |
| Observability | Pipeline failures must carry a diagnosable root cause | Structured error object: stage, agent, root_cause, stack_trace, suggested_fix (Section 4.9) |
| Data privacy | Uploaded data should not be exposed to unauthenticated callers | All /platform/* and /dataset/* routes require an authenticated user context |

### 2.4 RELATED WORK AND EXISTING SYSTEM COMPARISON

Automated machine learning (AutoML) systems such as AutoGluon [3] and H2O AutoML [4] demonstrated that model selection and hyper-parameter search can be automated competitively against manually tuned baselines, but both generally assume a dataset that is already numeric, reasonably clean, and supplied by a user who already knows which column is the prediction target. Multi-agent system theory, as formalised by Wooldridge and Jennings [5], motivates decomposing a complex task into autonomous, cooperating components with well-defined responsibilities and message-passing interfaces — a pattern this project applies at the level of pipeline stages (Section 3.2) rather than at the level of free-form autonomous LLM agents. Model-agnostic explainability techniques such as LIME [6] and SHAP [7] establish the now-standard expectation that a predictive model's output should be accompanied by a human-interpretable account of which features drove it; Agentix's TrainingAgent reports linear-model coefficient magnitudes as feature importances in the same spirit, though without the more general model-agnostic machinery of LIME or SHAP (Section 6.3). On the data quality side, Rubin's classical taxonomy of missing-data mechanisms [8] (missing completely at random, missing at random, missing not at random) remains the reference framework against which any imputation strategy should be judged; the mean/median/mode strategy implemented in Agentix's CleaningAgent (Section 3.7.3) is a simple, auditable strategy suitable for the MCAR/MAR case, not a full treatment of the taxonomy, and this report does not claim otherwise.

**Table 2.7: Comparison of Agentix against existing categories of tooling**

| Capability | Notebook (Jupyter) | BI Dashboard (Power BI) | AutoML Platform (AutoGluon) | Conversational Assistant (generic) | Agentix (this project) |
|---|---|---|---|---|---|
| No coding required | No | Yes | Partial | Yes | Yes |
| End-to-end workflow automation | No | No | Partial (model only) | No | Yes (9 stages) |
| Persistent, resumable workflow state | No | N/A | Varies | No | Yes (DB-backed) |
| Documented data-cleaning strategy | Manual | No | Automated, opaque | No | Yes, auditable per-column reason |
| Cross-run strategy memory | No | No | Internal only | No | Proposed, not implemented |
| Explainability of results | Manual | Limited | Varies by tool | No | Basic (coefficient magnitude) |
| Grounded natural-language Q&A on results | No | No | No | Not grounded in data | Yes, grounded in pipeline output |

It is also useful to situate Agentix against the data-quality tooling landscape specifically, since Chapter 5 of this report treats missing-value handling as a first-class design concern. Dedicated data-quality frameworks such as Great Expectations and dbt's built-in testing layer allow a data engineering team to declare and continuously validate assertions about a dataset (for example, that a column's null rate stays below a threshold), but they are validation tools: they detect and report a quality problem, they do not themselves decide and apply a remediation strategy the way Agentix's CleaningAgent does. Conversely, general AutoML pipelines that do perform imputation internally (as a preprocessing step before model fitting) typically treat that step as an implementation detail hidden from the end user, with no per-column reasoning surfaced for inspection. Agentix's design sits between these two positions: it makes an automatic decision, as an AutoML pipeline would, but records and exposes that decision's reasoning in the same way a validation framework would expose a rule violation, so that a business user reviewing the Insights page can see not only that a column was imputed but why a particular strategy was chosen for it.

The multi-agent decomposition itself also deserves a brief methodological note. Wooldridge and Jennings's classical definition of an agent as an autonomous component capable of flexible, reactive and proactive behaviour within an environment [5] is a considerably stronger notion than what Agentix's nine pipeline "agents" implement: each is deterministic, stateless between invocations, and executed in a fixed, non-negotiated sequence by a central orchestrator, rather than autonomously deciding when or whether to act. The term "agent" is retained in this report because it accurately describes the module boundary and lifecycle contract (Section 3.2) that the codebase itself uses, but the report is careful not to imply the richer autonomous, negotiating multi-agent behaviour associated with the term in the wider agentic-AI literature — a genuinely autonomous, LLM-driven planning layer over these stages remains future work (Section 9.5), not a description of the current orchestrator.

#### 2.4.1 Research Gap

The comparison above suggests a genuine gap between (a) systems that automate model training but treat data preparation and business communication as external problems, and (b) systems that present a friendly conversational or dashboard interface but do not perform, or do not persist, real analytical computation behind it. Agentix's contribution is architectural rather than algorithmic: it does not propose a novel model-training or imputation algorithm, but it does propose — and partially implements and verifies — a design in which every pipeline stage's decision is persisted, inspectable, and the basis for a grounded conversational explanation, addressing the "black box AutoML" and "ungrounded chatbot" failure modes simultaneously.

### 2.5 USE CASE ANALYSIS

Figure 2.2 presents the primary use cases exercised by the three verified user roles: the business user and data analyst, whose use cases largely overlap in the current single-tier permission model, and the administrator, whose access is restricted to system-health monitoring rather than data content. Each use case corresponds to a route or route group verified in Section 4.3 and Chapter 7.

**Fig. 2.2: Use Case Diagram**
*[Insert diagram: actors {Business User / Data Analyst, Administrator} against use cases {Upload Dataset, Run Pipeline, View Insights, Ask AI Assistant, View History} / {Monitor System Health}.]*

---

# CHAPTER 3
## SYSTEM DESIGN

### 3.1 SYSTEM ARCHITECTURE

Agentix is organised as two independently deployable applications that communicate over a plain REST interface: a Next.js frontend responsible for authentication, presentation and its own lightweight persistence (session, workspace and reporting metadata via Prisma), and a FastAPI backend responsible for the analytical pipeline, its persistence (via SQLAlchemy) and the local language-model integration. Figure 3.1 shows the complete layered architecture verified in the current codebase, including which database each layer actually writes to and which lower layers (machine learning, language model) each depend on.

**Fig. 3.1: Overall System Architecture of Agentix**
*[Insert diagram: Next.js frontend (Prisma → SQLite) ↔ REST ↔ FastAPI backend (SQLAlchemy → SQLite) → {scikit-learn, Ollama}.]*

Three architectural decisions are worth calling out explicitly because they were points of genuine engineering difficulty during this project, not obvious defaults. First, the frontend and backend each own a separate SQLite database file rather than sharing one: the frontend's Prisma schema models user-facing concerns (sessions, workspaces, saved reports, chat history) while the backend's SQLAlchemy models own the pipeline's own execution record (datasets, workflow runs, pipeline stages). This separation avoids coupling the two runtimes to a single schema migration path, at the cost of there being no single source of truth for "a dataset" across both halves of the system — a trade-off discussed further in Section 6.3. Second, the pipeline orchestrator uses FastAPI's built-in BackgroundTasks mechanism rather than a dedicated task queue such as Celery or RQ; although a Redis client and the rq library are installed dependencies, no code path in the inspected backend actually constructs a queue or worker from them, so background execution today is confined to the same process as the API server. Third, the pipeline's intermediate real data (the Parquet file path, the detected target column, the held-out test predictions) is held in an in-process Python dictionary (DataService) rather than in the database; only the pipeline's computed results (output_data on each PipelineStage row) are durably persisted. This is the direct cause of the restart-persistence limitation documented in Section 6.3.

#### 3.1.1 Request Lifecycle Walkthrough

To make the layered architecture of Figure 3.1 concrete, this subsection traces one real user action — asking the AI Assistant a question about a completed dataset — through every layer it touches. The browser sends the user's message as a POST to /api/v1/platform/chat via the Next.js frontend's own API route, which first reads the NextAuth session cookie to obtain the authenticated user; if no valid session exists, the Node-runtime middleware (Section 3.5.2) would already have redirected the request to /login before it reached this point, so the handler itself does not need to re-implement that check. The frontend route forwards the request, together with the currently selected dataset's name (read from the Zustand platformStore, Section 4.11), to the FastAPI backend at NEXT_PUBLIC_API_URL. The backend's own auth dependency (Section 4.10) independently validates the request before any handler code runs. The /platform/chat handler then calls `_latest_dataset_and_run()` and `_stage_result()` to pull the dataset's real, persisted EDA, Training and Evaluation stage output_data from the SQLAlchemy database — not from the in-process DataService, which by this point in the pipeline is no longer needed, since the numbers the assistant should discuss were already durably written by execute_stage() when those stages completed. Those real numbers are assembled into a prompt that explicitly instructs the local language model to answer only from the data given and to admit when the data does not cover the question; `ExecutionEngine.select_llm_provider()` picks the first available local Ollama model, and `llm_service.generate()` performs the actual HTTP call to Ollama's /api/generate endpoint. The model's response travels back through the same four layers to the browser. Every one of these layers was individually exercised and observed during the golden-path verification reported in Chapter 5, and the specific numeric values that appeared in the model's final answer were checked character-for-character against the values persisted in the Evaluation stage's output_data, which is what allows this report to describe the assistant as genuinely grounded rather than merely plausible.

### 3.2 MODULE DESIGN

The analytical core of Agentix is implemented as nine specialised agent modules, each a subclass of a common BaseAgent abstract class that enforces a uniform lifecycle: validate the input against a Pydantic schema, execute the stage's real logic against a pluggable ProcessingEngine, clean up afterwards, and roll back on failure. Every execution is wrapped so that any exception is converted into a structured PipelineException carrying the failing stage name, the agent name, a root-cause label, the full stack trace, and a suggested fix, which is what allows failures to be reported honestly to the user rather than as an opaque "something went wrong". Figure 3.2 shows the fixed sequential order in which the orchestrator dispatches these nine agents for every workflow run.

**Fig. 3.2: End-to-End Pipeline Workflow (9 Sequential Agent Stages)**
*[Insert diagram: Upload → Parser → Profiling → Cleaning → EDA → Feature Engineering → Training → Evaluation → Report.]*

**Table 3.1: Module specification for the nine pipeline agents**

| Module | Purpose | Input | Output | Real Logic (not a stub) |
|---|---|---|---|---|
| UploadAgent | Confirm the uploaded file exists on disk before parsing begins | file_path | {file_path} | Existence check |
| ParserAgent | Load the raw file and persist it as Parquet; capture the target column once so later stages never re-derive it | file_path | rows, cols, target_column, parquet_path | Real load + write; fixes a prior target-leakage bug by freezing target_column at parse time |
| ProfilingAgent | Compute structural and quality statistics for the dataset | parquet_path | rows, cols, missing, duplicates, outliers, data_schema | Real computation; outliers is a fixed 0 (Section 6.3) |
| CleaningAgent | Impute missing values using a documented per-column strategy | parquet_path | imputation dict (per-column strategy + reason) | Real skew-based mean/median choice for numeric columns, mode for categorical |
| EDAAgent | Compute a correlation matrix and per-column descriptive statistics | parquet_path | correlation matrix, per-column mean/std/min/max/skew | Real computation; samples 10% of rows above 1000 rows for the correlation matrix |
| FeatureEngineeringAgent | Drop constant columns; encode categoricals for modelling | parquet_path, target_column | engineered feature set | Real one-hot (≤50 unique values) or frequency encoding (above that cap) to avoid a prior out-of-memory incident |
| TrainingAgent | Split, scale, detect problem type, and fit a linear model | engineered features, target_column | trained model, feature importances | Real train_test_split / StandardScaler / SGDClassifier or SGDRegressor via partial_fit |
| EvaluationAgent | Compute standard metrics against the held-out test split | model, y_test, y_pred | accuracy/F1 or MAE/RMSE/R² | Real scikit-learn metric functions |
| ReportAgent | Summarise the run for the user | dataset_name | rows, cols, target_column, problem_type, pdf_available=False | Real summary; explicitly does not fabricate a PDF URL |

#### 3.2.1 BaseAgent Lifecycle Contract

Every entry in Table 3.1 is a subclass of the same abstract base class, reproduced below in abbreviated form, which is what guarantees the uniform failure-handling behaviour described in Section 4.9 without requiring each of the nine agents to reimplement it.

```python
class BaseAgent(ABC, Generic[InputType, OutputType]):
    @abstractmethod
    def validate(self, input_data) -> InputType: ...

    @abstractmethod
    def execute(self, validated_data: InputType, engine) -> OutputType: ...

    @abstractmethod
    def cleanup(self) -> None: ...

    @abstractmethod
    def rollback(self) -> None: ...

    def run(self, data, engine, job_id=None) -> dict:
        # validate -> execute -> cleanup, all wrapped so that any failure
        # is converted into a structured PipelineException (stage, agent,
        # root_cause, stack_trace, suggested_fix) and rollback() is called
        # before the exception is re-raised to the orchestrator.
        ...
```

Concretely, TrainingAgent's execute() receives a validated PipelineInput naming the dataset, performs the real split/scale/fit sequence described in Section 3.7.7 against the ProcessingEngine passed in by the orchestrator, and returns a Pydantic output model; if the target column has fewer than two distinct classes, execute() raises before returning, and the base class's run() method is what converts that raised exception into the structured error object the frontend eventually displays, rather than TrainingAgent needing its own try/except scaffolding.

### 3.3 DATABASE DESIGN

#### 3.3.1 Table Structure (Data Dictionary)

The backend's SQLAlchemy models form the authoritative record of what the pipeline actually did; the frontend's Prisma models form the authoritative record of user-facing state. Table 3.2 and Table 3.3 document both schemas as currently defined in the codebase.

**Table 3.2: SQLAlchemy data dictionary (backend/core/models/models.py)**

| Table | Key Columns | Notes |
|---|---|---|
| User | id, email, hashed_password, role, is_active, created_at | Backend's own user record, separate from the frontend Prisma User table |
| UserSettings | user_id, llm_provider, openai_api_key, theme | Per-user preferences |
| Dataset | id, name, owner_id, filepath, rows, columns, size_bytes, created_at | One row per uploaded dataset |
| WorkflowRun | id, owner_id, dataset_id, status, execution_time, logs, created_at | One row per pipeline execution |
| PipelineStage | id, run_id, agent_name, step_order, status, execution_time, memory_usage_mb, output_data, errors, warnings, recommendations | One row per agent per run; memory_usage_mb is currently hardcoded to 0.0 (Section 6.3) |

**Table 3.3: Prisma data dictionary (frontend/prisma/schema.prisma, provider = sqlite)**

| Model | Purpose | Notes |
|---|---|---|
| User, Account, Session, VerificationToken | Standard NextAuth.js identity models | PrismaAdapter-managed |
| Workspace, WorkspaceMember | Personal / team workspace grouping | "Personal Workspace" auto-created for genuinely new users only |
| Dataset | Frontend-side dataset record shown in dashboards/lists | Distinct row from the backend Dataset table |
| Report | Saved report content for a user | No longer auto-seeded with fake content (Section 4.10) |
| ChatHistory | AI assistant conversation log | Real messages only |
| ActivityLog, Notification | User activity / notification feed | No longer auto-seeded (Section 4.10) |
| SavedModel, ModelVersion | Saved model metadata | – |
| ExperimentRun | Experiment metadata (parameters, metrics as JSON) | Schema exists; not currently written to by any inspected code path (Section 3.8) |
| DatasetVersion | Dataset version metadata | Corresponding API route returns HTTP 501 (not implemented) |

#### 3.3.2 Data Flow Diagram

Figure 3.3 traces the movement of data through the six principal processes of the system: session authentication, dataset upload and parsing, pipeline execution, insight/explainability computation, the grounded AI chat exchange, and report/dashboard viewing. Two data stores (D2, D3) correspond directly to the WorkflowRun/PipelineStage tables described above; D1 is the Parquet file store on local disk.

**Fig. 3.3: Level-1 Data Flow Diagram**
*[Insert diagram: processes {Authenticate, Upload/Parse, Run Pipeline, Compute Insights, Chat, View Reports} against stores {D1 Parquet files, D2 WorkflowRun/PipelineStage, D3 Prisma tables}.]*

#### 3.3.3 ER Diagram

Figure 3.4 gives the logical entity-relationship view on the Prisma side, since that schema models the richer set of user-facing relationships (ownership, workspace membership, reporting, chat history). The diagram deliberately flags ExperimentRun as schema-only: it is a real, migrated table with no current writer, and this report treats the distinction between "exists in the schema" and "is actually populated" as material to an honest system description.

**Fig. 3.4: Entity-Relationship Diagram (Logical, Prisma-side)**
*[Insert diagram per Table 3.3's model relationships.]*

### 3.4 SYSTEM CONFIGURATION

Both runtimes are configured through environment variables loaded from local .env files (excluded from version control). Table 3.4 lists the configuration keys verified to actually affect runtime behaviour, together with the value confirmed to be in effect during this project's testing.

**Table 3.4: Verified runtime configuration**

| Variable | Component | Verified Local Value / Effect |
|---|---|---|
| DATABASE_URL | Backend (SQLAlchemy) | sqlite:///./agentix.db |
| DATABASE_URL | Frontend (Prisma) | file:./dev.db |
| NEXT_PUBLIC_API_URL | Frontend | Base URL the browser uses to reach the FastAPI backend |
| ENVIRONMENT | Backend (core/auth) | "development" enables the dev auth fallback; any other value requires JWT_SECRET_KEY to be set or the app refuses to start |
| JWT_SECRET_KEY | Backend | Backend JWT signing secret; no longer defaults silently outside development |
| AUTH_SECRET | Frontend (NextAuth) | Session/JWT signing secret; no hardcoded fallback remains |
| OLLAMA_BASE_URL | Backend (llm_service) | Base URL of the local Ollama HTTP API |
| REDIS_URL, OPENAI_API_KEY | Backend | Present in configuration but not exercised by any inspected code path |

### 3.5 INTERFACE DESIGN

#### 3.5.1 User Interface Screen Design

The frontend is organised as an authenticated route group under (app), guarded uniformly by Next.js Node-runtime middleware. Table 3.5 lists the verified pages; annotated screenshots of the running application are provided in Section 4.2.

**Table 3.5: Verified frontend pages**

| Route | Purpose | Backend-Connected? |
|---|---|---|
| /login | Credentials sign-in | Yes (NextAuth + Prisma) |
| /dashboard | Landing workspace view, quick actions, recent activity | Yes, with some static placeholder copy remaining (Section 6.3) |
| /data-dock | Dataset upload and dataset list | Yes |
| /insights | Profiling / EDA / cleaning results for a dataset | Yes |
| /intelligence-reports | Model evaluation report view | Yes, with a known field-name mismatch for classification score display (Section 6.3) |
| /agent-console | AI Assistant chat | Yes, grounded in real pipeline data |
| /history | Workflow run history | Yes |
| /knowledge-graph | Knowledge-graph visualisation | No — no fetch/axios call to any backend endpoint was found in this page; static/demo UI only |
| /settings, /profile | Account and preference management | Yes |
| /admin/* | Administrative consoles (brain-console, model-manager, etc.) | Only /admin/system/* health endpoints are real; several admin page names reference the removed "Brain" architecture and should be individually verified before being relied upon |

#### 3.5.2 Application Flow: Workflow State Machine

The frontend models an in-progress pipeline run with an explicit finite state machine rather than an unbounded polling loop, shown in Figure 3.5. This is a deliberate design correction: an earlier version of the frontend continued polling a run's status indefinitely even after the backend reported failure, which this state machine's FAILED terminal state prevents by design.

**Fig. 3.5: Frontend Workflow State Machine**
*[Insert diagram: IDLE → UPLOADING → PROCESSING → {COMPLETED | FAILED}.]*

### 3.6 REPORTS DESIGN

The reporting surface spans two frontend pages (Insights and Intelligence Reports) backed by three backend endpoints (/platform/insights, /platform/reports, and the ReportAgent's own summary returned as part of the pipeline run). Reports are designed around a single principle established during this project's remediation work: a report field is either populated from a real, persisted PipelineStage.output_data value, or it is omitted / marked unavailable — it is never filled with a plausible-looking placeholder. This is most visible in the ReportAgent, whose output explicitly sets pdf_available to False and omits any report_url key, replacing an earlier implementation that unconditionally returned a download link to a PDF file that was never generated (Appendix E, test_report_agent.py).

### 3.7 METHODOLOGY AND ALGORITHMIC DESIGN

This section develops, stage by stage, the algorithmic content behind the module design of Section 3.2 — what each agent actually computes, and why that computation was chosen.

#### 3.7.1 Dataset Ingestion Methodology

Large files are uploaded in fixed-size chunks against three endpoints (upload/init, upload/chunk, upload/complete, documented in full in Appendix A) rather than as one multipart request, avoiding the request-body size limits and timeout risk of a single large POST. On completion, the ParserAgent loads the reassembled file, converts it to Apache Parquet for efficient columnar access by later stages, and registers rows/cols against the Dataset record. The choice to freeze the target column (the dataset's final column, by the current convention) at parse time, rather than re-detecting it in each subsequent stage, was made specifically to eliminate a class of bug in which a later stage could disagree with an earlier stage about which column was being predicted — a form of target leakage into the feature set if the disagreement went undetected.

#### 3.7.2 Dataset Profiling Methodology

Profiling computes, for the parsed dataset: total row and column counts; per-column missing-value counts; duplicate row counts; and a schema summary of inferred per-column data types. The current implementation reports a fixed value of zero for the outlier count field rather than a computed statistic — this is recorded here and in Section 6.3 as a known simplification rather than silently presented as a real outlier detection result.

#### 3.7.3 Data Quality and Missing-Value Decision Framework

Handling missing data correctly depends on why the data is missing, not only on how much is missing — the classical distinction between data missing completely at random, missing at random, and missing not at random [8]. A complete treatment of that distinction (for example, model-based imputation conditioned on other features, or explicit missingness indicators) is proposed as future work in Section 9.5. What CleaningAgent implements today is a narrower, fully auditable rule, illustrated in Figure 3.6: for a numeric column, the imputation value is the column median when the column's skew exceeds 0.5 in absolute value (median being more robust to a skewed distribution than the mean), and the column mean otherwise; for a categorical column, the imputation value is the column's most frequent value, or the literal string "Unknown" if no mode exists. Each decision, together with a human-readable reason string (for example, "skew=1.34 exceeds 0.5, median is robust to the skew"), is recorded per column and persisted as part of the Cleaning stage's output_data, giving the user an auditable trail rather than a black-box transformation.

**Fig. 3.6: Missing-Value Imputation Decision Flow (CleaningAgent, as implemented)**
*[Insert flowchart per the pseudocode in Section 3.7.4.]*

#### 3.7.4 Cleaning Algorithm (Pseudocode)

```
function CLEAN(dataframe):
    decisions = {}
    for column in dataframe.columns:
        missing_count = count_missing(dataframe[column])
        if missing_count == 0:
            continue
        if is_numeric(dataframe[column]):
            skew = compute_skew(dataframe[column])
            if abs(skew) > 0.5:
                value = median(dataframe[column])
                reason = f"skew={skew} exceeds 0.5, median is robust to the skew"
            else:
                value = mean(dataframe[column])
                reason = f"skew={skew} within +/-0.5, mean is appropriate"
        else:
            mode_values = mode(dataframe[column])
            value = mode_values[0] if len(mode_values) > 0 else "Unknown"
            reason = "categorical column imputed with most frequent value"
        dataframe[column].fillna(value, inplace=True)
        decisions[column] = {"strategy": value, "reason": reason, "missing_count": missing_count}
    return dataframe, decisions
```

#### 3.7.5 Exploratory Analysis Methodology

EDAAgent computes a Pearson correlation matrix across numeric columns and, for every column, its mean, standard deviation, minimum, maximum, missing-value count and skew. For datasets larger than one thousand rows, the correlation matrix is computed on a 10% random sample to bound computation time, a pragmatic accuracy/performance trade-off appropriate for an exploratory (rather than confirmatory) statistic.

#### 3.7.6 Feature Engineering Methodology

FeatureEngineeringAgent first drops constant columns (zero variance, which carry no predictive information and would only add noise to the scaler and model). Remaining categorical columns are one-hot encoded when their cardinality is at most 50 distinct values; above that threshold, a frequency-encoding is used instead (each category is replaced by its relative frequency in the dataset). This cap was added specifically after an out-of-memory failure observed when one-hot encoding was applied unconditionally to a near-unique identifier-like column, which expanded into as many new columns as there were rows. The target column is always excluded from this encoding process to prevent target leakage into the feature set.

#### 3.7.7 Model Planning and Training

TrainingAgent performs a single 80/20 train-test split with a fixed random seed (random_state=42) for reproducibility, standardises features with scikit-learn's StandardScaler, and detects the problem type from the target column: if the target is numeric and has more than 20 distinct values, the problem is treated as regression; otherwise it is treated as classification. A single family of linear models is used in both cases — SGDClassifier (log-loss) for classification or SGDRegressor for regression — fitted incrementally via partial_fit. Feature importances are reported as the mean absolute value of the fitted model's coefficients per feature, a real (if simple) explainability signal rather than a fabricated ranking. The agent raises an explicit, diagnosable error if the target column has fewer than two distinct classes, rather than allowing scikit-learn's own less-informative error to propagate. No cross-validation, hyper-parameter search, or ensembling is performed in the current implementation, and no algorithm other than the SGD family is used, despite xgboost, lightgbm and catboost being installed dependencies that are not called from this code path — this is recorded as a scope limitation in Section 6.3, not presented as a richer AutoML capability than what exists.

**Fig. 3.7: Machine Learning Training and Evaluation Pipeline (TrainingAgent + EvaluationAgent)**
*[Insert diagram: X_train/X_test split → StandardScaler → SGDClassifier/SGDRegressor → predictions → EvaluationAgent metrics.]*

#### 3.7.8 Model Evaluation

EvaluationAgent computes accuracy and weighted F1-score for classification problems, and mean absolute error, root-mean-squared error, and the coefficient of determination (R²) for regression problems, using scikit-learn's standard metric implementations against the held-out test split. The R² computation is explicitly guarded against fewer than two test samples, since R² is mathematically undefined in that case; this guard prevents a silent or misleading numeric result on a pathologically small dataset. Metric definitions and appropriate-use guidance are tabulated in Appendix D.

#### 3.7.9 Explainability and Insight Generation

Explainability in the current system is limited to the linear-model coefficient magnitudes computed by TrainingAgent and surfaced through the /platform/xai endpoint and the Insights page. This is real and directly derived from the trained model's own parameters, but it is not the model-agnostic, locally-faithful explanation that a technique such as LIME [6] or SHAP [7] would provide, and this report does not claim otherwise; extending explainability along those lines is proposed as future work in Section 9.5.

#### 3.7.10 Report Generation

As described in Section 3.6, ReportAgent assembles a real summary (dataset name, row/column counts, target column, detected problem type) from the dataset's own pipeline output and explicitly reports that no PDF export is available, rather than returning a URL to a file that does not exist. Implementing real PDF generation is scoped as future work (Section 9.5).

### 3.8 PROPOSED DECISION INTELLIGENCE ARCHITECTURE

During the initial design of Agentix, a "Decision Intelligence" capability was envisioned: computing a structural fingerprint for each uploaded dataset, retrieving structurally similar datasets processed previously, comparing the preprocessing and modelling strategies used on those prior runs, and recommending a strategy for the current dataset on that basis. A full-repository search conducted for this report confirms that no DatasetFingerprint entity, StrategyReasoning entity, or associated similarity-retrieval logic exists anywhere in the current codebase, in either the backend or the frontend. A related Prisma model, ExperimentRun, does exist in the schema (parameters and metrics as JSON columns) but is not written to by any code path found during this audit. What the platform does implement today, and what /platform/benchmark-stats actually aggregates, is a simple count-based dashboard statistic drawn from the real WorkflowRun and PipelineStage tables (Section 4.3) — a legitimate but materially smaller capability than cross-run strategy recommendation. Figure 3.8 therefore presents Decision Intelligence strictly as a proposed architecture for future work, not as a description of implemented behaviour.

**Fig. 3.8: Proposed Decision Intelligence Architecture (Not Implemented)**
*[Insert diagram, clearly labelled "PROPOSED — NOT IMPLEMENTED".]*

---

# CHAPTER 4
## IMPLEMENTATION

### 4.1 CODING STANDARD

The backend is written in Python 3 using type-annotated Pydantic models for every agent's input and output schema, so that a malformed intermediate result fails validation immediately rather than propagating silently into a later stage. Every agent follows the same four-method contract (validate, execute, cleanup, rollback) inherited from BaseAgent, which keeps the nine pipeline modules structurally consistent and independently testable. The frontend is written in TypeScript with the Next.js App Router convention of colocated route handlers under src/app/api/*/route.ts; shared session/authorisation logic is centralised in src/auth.config.ts and src/middleware.ts rather than repeated per route. Both codebases favour explicit failure (raising a typed exception, returning an HTTP error status with a real message) over silent fallback values, a convention that was tightened considerably during this project's remediation work and is discussed at length in Chapter 6.

### 4.2 SCREEN SHOTS

The following screenshots were captured from the actual running application (frontend on Next.js 15.5.19 / Turbopack, backend on FastAPI, both against the verified local SQLite databases) during this project, not mocked or recreated from design files.

**Fig. 4.1: Login screen (NextAuth credentials provider)**
*[Insert screenshot.]* The login screen authenticates against a real, database-backed user row created via prisma.user.upsert() rather than an in-memory placeholder, discussed further in Section 4.10.

**Fig. 4.2: Workspace dashboard after authentication**
*[Insert screenshot.]* The dashboard correctly reflects an authenticated session and a real workspace, but two elements visible here — the "Welcome back, Sarah" greeting and the "1 dataset that may need retraining" suggestion — remain static placeholder copy rather than data derived from the current user or dataset state. This is recorded honestly as a known limitation in Section 6.3 rather than omitted from the report.

**Fig. 4.3: Dataset upload page (Datasets / data-dock)**
*[Insert screenshot.]* The upload page accepts CSV, Excel and JSON files up to 500 MB via the chunked upload endpoints documented in Appendix A.

**Fig. 4.4: AI Assistant chat interface (agent-console)**
*[Insert screenshot.]* The AI Assistant page is where the chat round-trip verified in Chapter 7 takes place: the user's question is sent to /platform/chat, which builds a prompt from the selected dataset's real pipeline results before calling the local Ollama model.

### 4.3 API IMPLEMENTATION

All backend endpoints are mounted under the /api/v1 prefix and grouped into five routers. Table 4.1 lists every endpoint verified in the current codebase, including the honest HTTP 501 responses returned by the small number of routes that are intentionally not yet implemented, in preference to fabricating a success response.

**Table 4.1: FastAPI endpoint inventory (/api/v1 prefix)**

| Method | Path | Purpose | Auth |
|---|---|---|---|
| POST | /dataset/upload/init | Begin a chunked upload | Required |
| POST | /dataset/upload/chunk | Upload one chunk | Required |
| POST | /dataset/upload/complete | Finalise upload, trigger parsing | Required |
| GET | /jobs/{job_id} | Poll a background job's status | Required |
| POST | /auth/register, /auth/login | Backend-native auth (JWT) | Public |
| GET | /auth/me | Current backend user | Required |
| GET | /admin/system/health, /liveness, /readiness, /system | System telemetry | Admin only |
| POST | /platform/start-workflow | Start the 9-stage pipeline for a dataset | Required |
| GET | /platform/workflow-status | Poll a workflow run's status | Required |
| GET | /platform/eda, /xai, /insights, /recommendations, /reports | Read pipeline results for a dataset | Required |
| POST | /platform/predict | Run inference with a trained model | Required |
| GET | /platform/automl, /model-registry, /experiment-runs | Model / run metadata | Required |
| POST | /platform/chat | Grounded AI Assistant exchange | Required |
| GET | /platform/dashboard-metrics, /system-health, /storage, /benchmark-stats, /recent-activity | Dashboard aggregate data (real, from the SQLAlchemy DB) | Required |
| POST | /platform/clean, /feature-engineering, /demo/load | Deliberately return HTTP 501 with an honest message (not implemented as standalone endpoints) | Required |
| GET/POST | /platform/dataset-versions[, /rollback] | Deliberately return HTTP 501 — no dataset-versioning system exists in the codebase | Required |

### 4.4 WORKFLOW PERSISTENCE

PipelineOrchestrator.start_pipeline() creates a Dataset row (if one does not already exist), a WorkflowRun row, and one pending PipelineStage row per agent, before any agent executes. execute_stage() then, for each stage in order: sets its status to running; executes the agent; on success, serialises the agent's real output into PipelineStage.output_data and marks the stage completed; on any exception, serialises the structured error into PipelineStage.errors, marks the stage failed, and marks the parent WorkflowRun failed. This is genuine database persistence, not an in-memory approximation of it — a WorkflowRun's status and every stage's status and output survive a backend restart. resume_pipeline() exploits this by skipping any stage already marked completed when a run is resumed, though — as documented in Section 6.3 — this resumability is only complete within the same backend process, because the real intermediate data a resumed stage needs (the Parquet path, the target column) lives in the in-process DataService dictionary rather than in the database.

### 4.5 PIPELINE AGENT IMPLEMENTATION

Each agent's execute() method is a direct, unmocked call into pandas/NumPy/scikit-learn against the dataset's real Parquet file — there is no code path in pipeline_agents.py that returns a canned or templated result. The base class's run() method (Section 3.2) is the single place where exception handling, timing, and logging are implemented, so individual agents contain only their real analytical logic and do not each re-implement error handling.

### 4.6 MACHINE LEARNING IMPLEMENTATION

The current machine-learning implementation is intentionally narrow: scikit-learn's SGDClassifier and SGDRegressor, trained via partial_fit after StandardScaler normalisation, are the only estimators used, regardless of dataset size or characteristics. xgboost, lightgbm and catboost are present in backend/requirements.txt but are not imported by pipeline_agents.py; reporting them as part of the modelling capability without this qualification would overstate what the system does. This scope is revisited as a candidate extension in Section 9.5.

### 4.7 DATABASE IMPLEMENTATION

Both the frontend (Prisma) and backend (SQLAlchemy) currently point at local SQLite files: frontend/prisma/dev.db and backend/agentix.db respectively. This was a deliberate, explicit decision made during this project after discovering that the backend's previously configured PostgreSQL connection string used credentials that did not authenticate against any running Postgres server — meaning the backend had, in practice, always been falling back to SQLite. Rather than silently leaving that mismatch in place, both configurations were made to explicitly agree on SQLite for local development, and the migration was verified to preserve all pre-existing data (31 datasets and over 33,000 recorded workflow runs were confirmed intact via a live API query taken immediately after the change). A containerised PostgreSQL configuration remains available in docker-compose.yml as a documented option for a future production deployment (Appendix H) but is not the verified runtime today.

### 4.8 DECISION INTELLIGENCE IMPLEMENTATION

As established in Section 3.8, there is no implemented Decision Intelligence engine. What exists in the implementation is the /platform/benchmark-stats endpoint, which computes real counts (total datasets, total workflow runs, total completed pipeline stages) from the SQLAlchemy database and returns the highest-scoring recent runs, sorted by their real recorded accuracy or R² value. This is legitimate dashboard aggregation, and it is reported here without the "strategy memory" or "fingerprinting" framing that would misrepresent its scope.

### 4.9 ERROR HANDLING

Every pipeline failure is surfaced to the caller as a structured object rather than a bare exception message, containing:

- **Root Cause** — the exception type or a short classification (e.g. "Validation Error").
- **Pipeline Stage** — which of the nine agents failed.
- **File / Function** — implicit in the captured stack trace.
- **Stack Trace** — the full Python traceback, for developer diagnosis.
- **Suggested Fix** — a short, human-readable hint (e.g. "Check the input schema requirements.").

This structure is what allows the frontend's workflow state machine (Section 3.5.2) to present a genuinely informative failure state instead of an unqualified "processing failed" message, and is what allowed a real failure — a two-row dataset producing a single-class training split — to be diagnosed immediately during golden-path testing in Chapter 7 rather than requiring a debugger session.

### 4.10 SECURITY IMPLEMENTATION

Three distinct authentication and authorisation defects were identified and corrected during this project, verified by both direct HTTP requests and browser interaction:

**Table 4.2: Authentication and authorisation defects corrected during this project**

| # | Defect (Before) | Fix (After) | Verification |
|---|---|---|---|
| 1 | GET /api/admin silently promoted the calling user to ADMIN role | A requireAdmin() helper now returns 401 for no session and 403 for a non-admin session; no promotion occurs | curl with/without a session cookie; browser as a non-admin user |
| 2 | Anonymous requests across six API routes were served data belonging to "the first user found in the database" | Every affected route now requires session?.user?.id and returns 401 when absent | curl without Authorization; browser in a logged-out tab |
| 3 | The backend's development authentication bypass activated for any ENVIRONMENT value other than the literal string "production" | The bypass now activates only for the literal value "development"; any other value without a configured JWT_SECRET_KEY causes the application to refuse to start | Reload core.auth under ENVIRONMENT=staging with no secret set; confirmed RuntimeError |

In addition, frontend route protection was moved from a single cookie-based check on /admin/* only (the admin_token cookie was never actually set anywhere in the codebase, meaning that guard was dead code) to a NextAuth-based middleware that protects the entire authenticated route group and additionally restricts /admin/* to sessions whose role is "ADMIN", derived from the real database row rather than hardcoded.

### 4.11 FRONTEND STATE MANAGEMENT IMPLEMENTATION

Cross-page frontend state — most importantly, which dataset the user currently has selected — is held in a Zustand store (platformStore) rather than in component-local React state, so that navigating from Data Dock to Insights to AI Assistant preserves the selection without requiring URL parameters or prop drilling through the layout tree. This store is also where a real defect was found and corrected during this project: the AI Assistant page previously read a field named selectedDataset from platformStore, but the store's actual shape defines the field as datasetName; because the value was destructured with a silent fallback rather than a type error, the page treated every session as having no dataset selected without raising any visible error; instead of surfacing that, it fell back to a hardcoded scripted conversation (the broader pattern this exemplifies is discussed in Section 6.2.2). The fix — reading `state(state => state.datasetName)` — is a one-line change, but finding it required tracing the store's real shape against every page that read from it, which is the same tracing discipline applied throughout this project's audit and documented as a methodology in Section 5.1.

---

# CHAPTER 5
## TESTING

### 5.1 TESTING STRATEGY

Testing on this project combined four complementary techniques, chosen specifically because an HTTP 200 status code alone was found, repeatedly, not to be sufficient evidence that a feature worked honestly: automated regression tests written directly against the corrected behaviour; direct API testing with curl to distinguish authenticated from unauthenticated responses; a full browser walkthrough of the golden path described in Section 5.3, reading actual rendered page content rather than only checking navigation succeeded; and manual inspection of database state before and after a change, to confirm that fabricated records had actually stopped being created rather than merely being hidden from one view.

### 5.2 UNIT AND INTEGRATION TEST CASES

Four new backend test files were authored during this project, using pytest with FastAPI's TestClient and monkeypatch to isolate endpoint logic from the real database and the real Ollama service where appropriate. Full test case listings and acceptance criteria are provided in Appendix E; Table 5.1 summarises them.

**Table 5.1: New regression tests authored during this project**

| Test File | Test Case | Verifies |
|---|---|---|
| test_chat_endpoint.py | test_chat_grounds_response_in_dataset_pipeline_results | The chat prompt sent to the LLM contains real EDA/training/evaluation numbers for the selected dataset |
| test_chat_endpoint.py | test_chat_is_honest_when_no_model_available | When no Ollama model is available, the endpoint reports "unavailable" and never calls the LLM |
| test_auth_environment_gating.py | test_dev_bypass_active_when_environment_unset | ENVIRONMENT unset still defaults to development behaviour, preserving backward compatibility |
| test_auth_environment_gating.py | test_no_dev_bypass_outside_development | ENVIRONMENT=staging with no secret raises RuntimeError; production with a secret returns 401 for an unauthenticated request and never touches the database |
| test_storage_endpoint.py | test_storage_endpoint_returns_real_disk_usage | GET /platform/storage returns internally consistent, real disk-usage figures |
| test_report_agent.py | test_report_agent_does_not_fabricate_a_pdf | ReportAgent returns pdf_available=False, pdf_url=None, and real row/column/target/problem-type data |

### 5.3 END-TO-END WORKFLOW VALIDATION

The complete golden path — Login, Dashboard, Upload, all nine pipeline stages, Insights, AI Chat, History, Refresh, Logout, and Login again — was executed against the running application through real browser interaction, with page content read and compared against expected values at each step, not inferred from network status codes alone.

**Table 5.2: Golden-path verification results**

| Step | Verification Method | Result |
|---|---|---|
| Login | Real session established; redirected to /dashboard | Passed |
| Dashboard | Authenticated view rendered; real workspace shown | Passed (with known static-copy caveat, Section 6.3) |
| Upload | 13,107-row CSV uploaded via chunked endpoints | Passed |
| Parser → Report (9 stages) | Each PipelineStage transitioned pending → running → completed with real output_data | Passed |
| Insights | Real profiling / EDA / evaluation figures rendered after field-name fix (Section 6.3) | Passed |
| AI Chat | Response text contained the run's real accuracy (0.4886), F1 (0.4880) and feature-importance values verbatim | Passed |
| History | Real workflow run listed with correct status | Passed |
| Refresh | Authenticated state and data persisted across a full page reload | Passed |
| Logout | Session invalidated via a CSRF-token-bearing signout request; /dashboard no longer reachable afterward | Passed |
| Login again | Re-authenticated successfully; AI Chat re-verified grounded | Passed |

One genuine pipeline failure was also observed and is reported here as evidence the system fails honestly rather than as a defect to hide: a two-row test dataset produced the error "Target column 'C' has fewer than 2 distinct classes; cannot train a classifier", a correct rejection given the 80/20 split can leave a single-class training set on a dataset that small. This confirms the structured error-handling design of Section 4.9 surfaces a real, diagnosable cause rather than an opaque failure.

### 5.4 API AND SECURITY TESTING

Every route affected by the authentication fixes in Section 4.10 was tested twice: once with no Authorization header / session cookie (expected 401), and once as a real authenticated non-admin user attempting an admin-only action (expected 403). Both paths were confirmed to behave as expected via curl and, for the admin-console pages, via direct browser navigation as a non-privileged session.

### 5.5 TEST REPORTS AND RESULTS SUMMARY

**Table 5.3: Automated backend test suite results (excluding pre-existing orphaned-import files)**

| Metric | Result |
|---|---|
| New tests added | 6 (across 4 files) |
| New tests passed | 6 / 6 |
| Pre-existing unrelated failures | 2 (test_approval_api.py — no /approval router is mounted in the current codebase; a pre-existing gap, not a regression introduced here) |
| Test files excluded from this run | 17 (fail at pytest collection time with ModuleNotFoundError, referencing modules removed with the prior "Brain" architecture, e.g. core.services.decision_engine, core.agents.workflow_planner) |
| Frontend automated tests | None found in the repository at the time of this audit |

The 17 excluded files are listed individually in Appendix E for traceability. Their exclusion reflects the explicit instruction governing this project phase not to rebuild the removed Brain/Memory/Decision-Intelligence architecture; they are neither fixed nor deleted, and remain visible as a concrete, quantified item of technical debt (Section 6.3, Appendix G).

---

# CHAPTER 6
## CONCLUSIONS

### 6.1 DESIGN AND IMPLEMENTATION ISSUES

Several genuine design and implementation issues surfaced during this project, beyond the security and honesty defects already documented in Chapters 4 and 5. Reconciling the frontend's Prisma-owned Dataset model with the backend's SQLAlchemy-owned Dataset model proved to be a recurring source of confusion, since the two are not the same row and are not automatically kept in sync; a future iteration should either unify them behind one API or make the distinction explicit in both codebases' naming. The reliance on FastAPI BackgroundTasks rather than a real task queue means a backend process restart during an in-flight pipeline run leaves that run permanently in a running state at the database level, since nothing resumes or fails it automatically; the resume_pipeline() logic only helps if the run is deliberately resumed by a new request. Windows-specific development friction was also notable: the Prisma query-engine DLL being file-locked by a running npm dev server blocked schema regeneration until the process was killed, a class of problem that would not occur in a Linux container.

Two further issues arose from tooling rather than the application itself, and are recorded because they shaped the verification methodology of Chapter 5. Automated browser interaction against several of the frontend's controlled React inputs (the login form, the chat message box, and the suggested-prompt buttons) intermittently failed to register simulated clicks and keystrokes issued through standard Chrome DevTools Protocol automation; React's synthetic event system did not always observe input changes made this way. The reliable workaround used consistently for browser verification throughout this project was to set an input's value through the native HTMLInputElement property setter and then explicitly dispatch input and change DOM events, rather than relying on simulated coordinate-based typing, a detail worth recording for anyone extending this project's browser-based test coverage. Separately, while preparing this report a routine git status check revealed that the repository's root .gitignore contains a bare lib/ pattern that unintentionally matches frontend/src/lib/, meaning auth.ts, prisma.ts, and the rewritten user.ts (Section 4.10) have never been tracked by version control, despite containing real, security-relevant application logic. This was discovered only by deliberately checking git status against a file known to have been edited and finding no diff; it is recorded in the risk register (Appendix G) as a high-impact, already-occurred issue rather than a hypothetical one, precisely because it was found by process rather than by design.

### 6.2 ADVANTAGES AND LIMITATIONS

#### 6.2.1 Advantages

- Every analytical stage is backed by real computation against the user's actual data, with no stage in the nine-agent pipeline found to return a templated or canned result.
- Workflow state is durably persisted at the database level, not merely held in server memory, which makes a completed run's results inspectable long after the request that created them.
- The AI Assistant is demonstrably grounded: the exact numeric values it reports (accuracy, F1, feature importances) were confirmed to match the pipeline's own persisted output during golden-path testing, rather than being generated independently by the language model.
- Authentication and authorisation defects that would have been serious in any real deployment — unauthenticated admin escalation, anonymous-to-first-user mapping — were found and closed with verifiable, testable fixes rather than surface-level patches.
- The system fails honestly: a pathologically small dataset produces a clear, diagnosable error rather than a misleading successful-looking result.

#### 6.2.2 Limitations

- In-process pipeline state (the Parquet path, the target column) does not survive a backend restart, so previously completed datasets can fail subsequent on-demand computations (for example, /profile) with a 400 error even though their pipeline is marked completed in the database. This is the most significant open architectural limitation identified in this report.
- Modelling is limited to a single family of linear models (SGDClassifier / SGDRegressor) with no cross-validation or hyper-parameter search, despite gradient-boosting libraries being installed but unused.
- ProfilingAgent's outlier count is a fixed placeholder value (0), not a computed statistic.
- The intelligence-reports page reads field names (r2_score, cv_mean) that do not exist on a classification run's evaluation output, which uses accuracy/f1_score instead, producing an "N/A" score display for classification models.
- Several dashboard and admin-console elements remain hardcoded or static (a fixed greeting name, a fixed retraining suggestion count, generic placeholder entries in the benchmark "top experiments" display, and static mock statistics on the admin dashboard page) even after this project's remediation of the production-database-level fake-data seeding described in Chapter 4.
- No "Decision Intelligence" capability — dataset fingerprinting, similarity retrieval, or cross-run strategy recommendation — is implemented; the only related artefact is an unused ExperimentRun schema table.
- The frontend and backend maintain separate, only loosely related Dataset records, with no single authoritative source of truth for "what datasets exist" across both halves of the system.
- The root .gitignore's broad lib/ pattern excludes the entire frontend/src/lib/ directory — including auth.ts, prisma.ts and this project's rewritten user.ts — from version control, meaning a real, security-relevant source file currently has no git history and is not backed up by commits.
- 17 pre-existing backend test files fail at pytest collection time because they import modules belonging to a previously removed architecture; they were intentionally left untouched rather than fixed or deleted, per this project phase's explicit scope boundary.

### 6.3 FUTURE ENHANCEMENTS

The following items are proposed future work. None of them should be read as already implemented; each is labelled here precisely because it is not.

**Table 6.1: Proposed future enhancements**

| # | Enhancement | Rationale |
|---|---|---|
| 1 | Persist pipeline intermediate state (Parquet path, target column) to the database instead of an in-process dictionary | Directly closes the most significant limitation in Section 6.2.2 — restart-safety for on-demand computations |
| 2 | Real dataset fingerprinting and cross-run strategy recommendation (Decision Intelligence) | Currently proposed-only (Section 3.8); would meaningfully differentiate the platform from single-run AutoML tools |
| 3 | Broader model search: gradient-boosted trees (already installed), cross-validation, basic hyper-parameter search | SGD-only linear models are a narrow modelling capability for a general-purpose platform |
| 4 | Real outlier detection in ProfilingAgent | Replaces the current fixed placeholder value with a genuine statistic (e.g. IQR- or z-score-based) |
| 5 | Model-agnostic explainability (e.g. SHAP) alongside the existing coefficient-magnitude importances | Coefficient magnitude is only meaningful for the current linear-model family |
| 6 | A real dedicated task queue (Celery or RQ, both already installed dependencies) in place of FastAPI BackgroundTasks | Removes the single-process restart-fragility of in-flight runs described in Section 6.1 |
| 7 | Real PDF/report export | ReportAgent currently reports honestly that no PDF is available; implementing generation would close that gap without regressing the honesty fix |
| 8 | Unify or explicitly reconcile the frontend and backend Dataset records | Removes a recurring source of confusion identified in Section 6.1 |
| 9 | Production deployment on the already-defined docker-compose stack (PostgreSQL, Redis, containerised frontend/backend) | The configuration exists (Appendix H) but is not the verified runtime; promoting it requires a deliberate migration, not an assumption |
| 10 | Role-based access control beyond the current single ADMIN/USER split | Supports the multi-tenant workspace model already present in the Prisma schema |
| 11 | Production observability (the installed but unused OpenTelemetry / Prometheus / Sentry dependencies) | Currently installed but not wired into any code path inspected during this audit |

In summary, this project set out to convert an existing, partially working Agentix prototype into a secure, correctly connected, and honestly reporting application without a ground-up architectural rewrite, and to document precisely which parts of the resulting system are implemented and verified, which are unused schema or installed-but-unexercised dependencies, and which remain proposed future work. The nine-stage analytical pipeline, the grounded AI assistant, and the corrected authentication and data-honesty behaviour were all verified through direct inspection and real browser interaction rather than through HTTP status codes alone. The limitations recorded in Section 6.2.2, most notably the restart-fragility of in-process pipeline state, are the clearest starting point for the next phase of work.

---

# APPENDICES

## APPENDIX A: API CONTRACTS

This appendix documents the request/response contract for the endpoints most central to the verified golden path (Chapter 5). All routes require an authenticated session unless stated otherwise; the auth mechanism is described in Section 4.10.

### A.1 POST /api/v1/dataset/upload/init

```
Request:  { "filename": str, "total_size": int, "content_type": str }
Response: { "upload_id": str, "chunk_size": int }
```

### A.2 POST /api/v1/dataset/upload/chunk

```
Request (multipart): upload_id, chunk_index, chunk (binary)
Response: { "received_chunks": int, "total_chunks": int }
```

### A.3 POST /api/v1/dataset/upload/complete

```
Request:  { "upload_id": str }
Response: { "dataset_name": str, "file_path": str, "status": "queued" }
```

### A.4 POST /api/v1/platform/start-workflow

```
Request:  { "dataset_name": str }
Response: { "run_id": str, "status": "started", "stages": [ "Upload", "Parser", ... ] }
```

### A.5 GET /api/v1/platform/workflow-status?run_id=...

```
Response: {
  "run_id": str, "status": "pending|running|completed|failed",
  "stages": [ { "agent_name": str, "status": str, "output_data": object|null,
                "errors": object|null } ]
}
```

### A.6 POST /api/v1/platform/chat

```
Request:  { "dataset_name": str, "message": str }
Response: { "response": str, "grounded_on": ["eda", "training", "evaluation"] }
```

Honesty rule: if no local Ollama model is available, response is a plain "No local AI model is currently available" message; the LLM is never called with a fabricated fallback in its place.

### A.7 GET /api/v1/platform/storage

```
Response: { "used_gb": float, "total_gb": float, "free_gb": float }
```

All three values are computed from real disk usage (shutil.disk_usage), never placeholder constants.

## APPENDIX B: WORKFLOW STATE MODEL

Two related but distinct state models govern a workflow run: the frontend's coarse-grained UI state machine (Section 3.5.2, Figure 3.5) and the backend's fine-grained per-stage state, recorded on every PipelineStage row.

**Table B.1: PipelineStage.status values and their meaning**

| Status | Meaning | Set By |
|---|---|---|
| pending | Row created by start_pipeline(); agent not yet dispatched | start_pipeline() |
| running | Agent's run() has begun executing | execute_stage(), before calling the agent |
| completed | Agent finished without raising; output_data holds the real result | execute_stage(), on success |
| failed | Agent raised (wrapped as PipelineException); errors holds the structured cause; parent WorkflowRun is also marked failed | execute_stage(), on exception |

resume_pipeline() iterates stages in step_order and skips any already completed, allowing a partially-completed run to continue without repeating finished work — subject to the same-process caveat documented in Section 6.2.2.

## APPENDIX C: SAMPLE DATA QUALITY DECISION RULES

Table C.1 gives worked, illustrative examples of the CleaningAgent decision rule described in Section 3.7.3, applied to hypothetical columns, to make the abstract rule concrete.

**Table C.1: Worked examples of the imputation decision rule**

| Column | Type | Skew | Missing % | Decision | Recorded Reason |
|---|---|---|---|---|---|
| age | numeric | 0.12 | 3% | mean | skew=0.12 within ±0.5, mean is appropriate |
| annual_income | numeric | 1.87 | 9% | median | skew=1.87 exceeds 0.5, median is robust to the skew |
| region | categorical | – | 5% | mode ("North") | categorical column imputed with most frequent value |
| customer_id | categorical (near-unique) | – | 0.2% | mode / "Unknown" | categorical column imputed with most frequent value (or Unknown if none) |

Row/column deletion, forward/backward fill for temporal data, model-based imputation, and explicit missingness indicators are proposed extensions (Section 9.5 / Section 6.3) and are not applied by the current CleaningAgent.

## APPENDIX D: MACHINE LEARNING EVALUATION METRICS

**Table D.1: Metric definitions and appropriate use (as computed by EvaluationAgent)**

| Metric | Problem Type | Definition | When to Prefer It |
|---|---|---|---|
| Accuracy | Classification | Correct predictions / total predictions | Balanced classes; a single overall correctness figure |
| F1-score (weighted) | Classification | Harmonic mean of precision and recall, averaged by class support | Imbalanced classes, where accuracy alone is misleading |
| MAE | Regression | Mean of \|predicted − actual\| | Robust, interpretable in the target's own units; less sensitive to large errors than RMSE |
| RMSE | Regression | Square root of the mean squared error | Penalises large errors more heavily than MAE; same units as the target |
| R² (coefficient of determination) | Regression | Proportion of target variance explained by the model | Comparing model fit across datasets; undefined / guarded for <2 test samples |

## APPENDIX E: TEST CASES AND ACCEPTANCE CRITERIA

**Table E.1: Detailed acceptance criteria for the six new regression tests**

| Test Case | Pre-condition | Action | Acceptance Criterion |
|---|---|---|---|
| Chat grounds response | A dataset with completed EDA/Training/Evaluation stages exists | POST /platform/chat with a question about the dataset | The LLM prompt captured by the test contains the run's real accuracy, problem type and a real feature-importance figure |
| Chat honest when no model | _ollama_model_or_none() returns None (monkeypatched) | POST /platform/chat | Response text contains "unavailable"; llm_generate is never called |
| Dev bypass default preserved | ENVIRONMENT unset | Reload core.auth | No RuntimeError; dev fallback still active (backward compatibility) |
| Dev bypass fail-closed | ENVIRONMENT=staging, no JWT_SECRET_KEY | Reload core.auth | RuntimeError is raised at import time |
| Auth rejects cleanly in production | ENVIRONMENT=production, JWT_SECRET_KEY set, no token supplied | Call get_current_user() with a DB stub that raises on any query | HTTPException(401) raised; the DB stub's query() is never called |
| Storage endpoint is real | Backend running against the real filesystem | GET /platform/storage | Response keys are exactly {used_gb, total_gb, free_gb}; free_gb ≤ total_gb; all values ≥ 0; total_gb > 0 |
| ReportAgent honest | A dataset with a real 3-row/2-column Parquet file registered in DataService | ReportAgent().execute(...) | pdf_available is False; pdf_url is None; report_url is absent; rows/cols/target_column/problem_type match the real file |

The 17 pre-existing test files excluded from the reported run (Section 5.5) are: `test_agent_bus.py`, `test_agent_registry.py`, `test_context_builder.py`, `test_data_quality.py`, `test_dataset_processor.py`, `test_dataset_understanding.py`, `test_decision_engine.py`, `test_domain_detection.py`, `test_intent_router.py`, `test_knowledge_memory.py`, `test_multi_agent_collaboration.py`, `test_privacy_agent.py`, `test_real_ai_analyst.py`, `test_reasoning_engine.py`, `test_recommendation_engine.py`, `test_semantic_search.py`, and `test_workflow_planner.py` — all fail at collection time with ModuleNotFoundError against modules removed together with the prior Brain/Memory architecture, and were not modified as part of this project's explicit scope boundary.

## APPENDIX F: SAMPLE USER WORKFLOW

This appendix narrates the verified golden-path walkthrough of Chapter 5 as a step-by-step user guide, suitable as a lightweight "getting started" reference.

1. Navigate to /login and sign in with a registered email and password.
2. On the Dashboard, select "Upload Dataset" (or navigate to Datasets in the sidebar).
3. Drag a CSV, Excel or JSON file (up to 500 MB) onto the upload zone; the file is sent in chunks and reassembled server-side.
4. The platform automatically starts the nine-stage pipeline; progress can be observed on the workflow status view, which moves through the IDLE / UPLOADING / PROCESSING / COMPLETED state machine (Figure 3.5).
5. Once completed, open Analysis (Insights) to review the real profiling, cleaning, EDA, and feature-engineering results for the dataset.
6. Open Reports (Intelligence Reports) to review the trained model's evaluation metrics.
7. Open AI Assistant and ask a question about the dataset (for example, "What was the model's accuracy and which features mattered most?"); the answer is grounded in the same numbers shown in step 6.
8. Open History to review past workflow runs.
9. Log out; confirm that protected pages are no longer reachable without signing in again.

## APPENDIX G: RISK REGISTER

**Table G.1: Risk register (identified during this project)**

| Risk | Likelihood | Impact | Mitigation / Status |
|---|---|---|---|
| Backend restart during an in-flight run leaves it permanently "running" in the DB | Medium | Medium | Documented (Section 6.2.2); mitigation (persist intermediate state) proposed as future work, Section 6.3 item 1 |
| Frontend and backend Dataset records drift out of sync | Medium | Medium | Documented (Section 6.1); reconciliation proposed, Section 6.3 item 8 |
| frontend/src/lib/ (including auth.ts) is excluded from git by a broad .gitignore rule | High (already occurred) | High (no version history for security-relevant code) | Identified during this audit; not yet remediated — recommended as an immediate follow-up |
| Large-file processing pressure (feature encoding, correlation matrix) on memory-constrained hosts | Medium | Medium | Partially mitigated (frequency-encoding cap, correlation sampling, Section 3.7); dask is installed but not wired in for further scale-out |
| A dataset with too few rows/classes causes training to fail | Low-Medium | Low | Fails honestly with a diagnosable error (Section 4.9); by design, not a defect |
| No dedicated task queue; single backend process is a scaling and fault-tolerance bottleneck | Medium | Medium | Documented (Section 6.1); Celery/RQ migration proposed, Section 6.3 item 6 |

## APPENDIX H: PRODUCTION READINESS AND PROPOSED DEPLOYMENT ARCHITECTURE

The repository already contains backend/Dockerfile, frontend/Dockerfile, a root docker-compose.yml defining frontend, backend, PostgreSQL and Redis services, and a frontend/vercel.json with basic security headers. None of this configuration is the verified runtime described elsewhere in this report — local development, as confirmed throughout this project, runs entirely on SQLite with no reverse proxy or containers active. Figure H.1 presents the deployment topology those files describe, explicitly labelled as proposed rather than implemented.

**Fig. H.1: Proposed Production Deployment Architecture**
*[Insert diagram, clearly labelled "PROPOSED — NOT VERIFIED RUNNING".]*

**Table H.1: Production readiness checklist against the verified current state**

| Criterion | Current State |
|---|---|
| Authentication cannot be bypassed outside development | Met (Section 4.10) |
| No production route silently fabricates data | Met for the six routes audited in this project (Section 4.10); dashboard/admin static-copy items in Section 6.2.2 remain open |
| Database strategy is explicit and documented | Met for local development (SQLite); PostgreSQL migration is configured but not exercised |
| In-flight work survives a process restart | Not met — the primary open item, Section 6.2.2 |
| Structured, diagnosable error reporting | Met (Section 4.9) |
| Automated regression coverage for the fixes in this project | Met — 6/6 new tests passing (Chapter 5) |
| Production observability (metrics/tracing/error reporting) | Not met — dependencies installed, not wired in (Section 6.3 item 11) |
| Containerised deployment exercised end-to-end | Not met — configuration exists, not verified running |

---

# REFERENCES

*(Single-spaced per reference, double space between references, per guideline — apply in final typeset document.)*

[1] Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., Blondel, M., Prettenhofer, P., Weiss, R., Dubourg, V., Vanderplas, J., Passos, A., Cournapeau, D., Brucher, M., Perrot, M., and Duchesnay, E. Scikit-learn: Machine Learning in Python. *Journal of Machine Learning Research*, 12, 2011: 2825-2830.

[2] McKinney, W. Data Structures for Statistical Computing in Python. *Proceedings of the 9th Python in Science Conference (SciPy)*, 2010: 56-61.

[3] Erickson, N., Mueller, J., Shirkov, A., Zhang, H., Larroy, P., Li, M., and Smola, A. AutoGluon-Tabular: Robust and Accurate AutoML for Structured Data. *arXiv preprint arXiv:2003.06505*, 2020.

[4] H2O.ai. *H2O AutoML: Automatic Machine Learning*. H2O.ai Documentation. 2024. <https://docs.h2o.ai/h2o/latest-stable/h2o-docs/automl.html>.

[5] Wooldridge, M., and Jennings, N. R. Intelligent Agents: Theory and Practice. *The Knowledge Engineering Review*, 10(2), 1995: 115-152.

[6] Ribeiro, M. T., Singh, S., and Guestrin, C. "Why Should I Trust You?": Explaining the Predictions of Any Classifier. *Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining*, 2016: 1135-1144.

[7] Lundberg, S. M., and Lee, S.-I. A Unified Approach to Interpreting Model Predictions. *Advances in Neural Information Processing Systems (NeurIPS)*, 30, 2017: 4765-4774.

[8] Rubin, D. B. Inference and Missing Data. *Biometrika*, 63(3), 1976: 581-592.

[9] Little, R. J. A., and Rubin, D. B. *Statistical Analysis with Missing Data*. 3rd ed. Hoboken, NJ: John Wiley & Sons, 2019.

[10] Breiman, L. Random Forests. *Machine Learning*, 45(1), 2001: 5-32.

[11] Zaharia, M., Chen, A., Davidson, A., Ghodsi, A., Hong, S. A., Konwinski, A., Murching, S., Nykodym, T., Ogilvie, P., Parkhe, M., Xie, F., and Zumar, C. Accelerating the Machine Learning Lifecycle with MLflow. *IEEE Data Engineering Bulletin*, 41(4), 2018: 39-45.

[12] Ramirez, S. *FastAPI Documentation*. 2024. <https://fastapi.tiangolo.com/>.

[13] Vercel Inc. *Next.js Documentation*. 2024. <https://nextjs.org/docs>.

[14] Auth.js Contributors. *NextAuth.js / Auth.js Documentation*. 2024. <https://authjs.dev/>.

[15] Prisma Data, Inc. *Prisma ORM Documentation*. 2024. <https://www.prisma.io/docs>.

[16] Abadi, D. J., Boncz, P. A., and Harizopoulos, S. Column-oriented Database Systems. *Proceedings of the VLDB Endowment*, 2(2), 2009: 1664-1665.

[17] Apache Software Foundation. *Apache Parquet Format Documentation*. 2024. <https://parquet.apache.org/docs/>.

[18] Ollama Inc. *Ollama Documentation: Running Large Language Models Locally*. 2024. <https://github.com/ollama/ollama>.

[19] OWASP Foundation. *OWASP Top 10:2021 - The Ten Most Critical Web Application Security Risks*. 2021. <https://owasp.org/Top10/>.

[20] Fielding, R. T. *Architectural Styles and the Design of Network-based Software Architectures*. Doctoral dissertation, University of California, Irvine, 2000.

[21] Newman, S. *Building Microservices: Designing Fine-Grained Systems*. 2nd ed. Sebastopol, CA: O'Reilly Media, 2021.

[22] Kleppmann, M. *Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems*. Sebastopol, CA: O'Reilly Media, 2017.

[23] Han, J., Kamber, M., and Pei, J. *Data Mining: Concepts and Techniques*. 3rd ed. Waltham, MA: Morgan Kaufmann, 2011.

[24] Provost, F., and Fawcett, T. *Data Science for Business: What You Need to Know about Data Mining and Data-Analytic Thinking*. Sebastopol, CA: O'Reilly Media, 2013.

[25] Molnar, C. *Interpretable Machine Learning: A Guide for Making Black Box Models Explainable*. 2nd ed. Independently published, 2022. <https://christophm.github.io/interpretable-ml-book/>.

[26] James, G., Witten, D., Hastie, T., and Tibshirani, R. *An Introduction to Statistical Learning with Applications in Python*. New York: Springer, 2023.

[27] Bottou, L. Large-Scale Machine Learning with Stochastic Gradient Descent. *Proceedings of COMPSTAT 2010*, 2010: 177-186.

[28] Van Rossum, G., and Drake, F. L. *Python 3 Reference Manual*. Scotts Valley, CA: CreateSpace, 2009.

[29] Richardson, C. *Microservices Patterns: With Examples in Java*. Shelter Island, NY: Manning Publications, 2018.

[30] SQLite Consortium. *SQLite Documentation*. 2024. <https://www.sqlite.org/docs.html>.
