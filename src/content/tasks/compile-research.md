---
title: "Compile and Organize LHON Research Data"
description: "Create a structured, comprehensive knowledge base of LHON research including papers, clinical trials, treatments, and outcomes."
category: "Data"
difficulty: "moderate"
status: "open"
prize: null
icon: "📊"
order: 5
successCriteria:
  - "Structured database of at least 50 key LHON research papers with summaries"
  - "Current clinical trials summary with status and expected completion dates"
  - "Treatment efficacy data compilation (Idebenone, Lenadogene Nolparvovec, etc.)"
  - "Research timeline showing key milestones from discovery to present"
  - "All data in machine-readable JSON format with human-readable summaries"
resources:
  - name: "PubMed - LHON Publications"
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=LHON"
  - name: "ClinicalTrials.gov"
    url: "https://clinicaltrials.gov/search?cond=LHON"
  - name: "Cochrane Library"
    url: "https://www.cochranelibrary.com/"
  - name: "EyeWiki - LHON"
    url: "https://eyewiki.org/Leber_Hereditary_Optic_Neuropathy"
  - name: "LHON - StatPearls"
    url: "https://www.ncbi.nlm.nih.gov/books/NBK482499/"
---

## Background

LHON research spans decades, from the initial identification of mitochondrial DNA mutations to the recent TALED gene-editing breakthrough in 2026. Key milestones include:

- **1988** - First LHON-associated mtDNA mutation identified (m.11778G>A)
- **2015** - Idebenone approved by EMA for LHON treatment
- **2024** - Lenadogene Nolparvovec gene therapy approved
- **2026** - TALED mitochondrial gene-editing demonstrated in LHON models
- **Ongoing** - Multiple clinical trials for next-generation therapies

## What Needs to Be Done

Build a structured knowledge base that serves as the definitive LHON research reference:

1. **Paper database** - Catalog the 50 most important LHON papers with:
   - Title, authors, journal, year, DOI
   - Key findings summary (2-3 sentences)
   - Category (genetics, treatment, epidemiology, pathophysiology)
   - Citation count and impact

2. **Clinical trials tracker** - All past and current LHON clinical trials:
   - Trial name, ID, sponsor, phase
   - Treatment being tested
   - Status, enrollment, expected completion
   - Published results (if available)

3. **Treatment efficacy summary** - Comparative data on all LHON treatments:
   - Efficacy rates, response timelines
   - Side effects, contraindications
   - Cost and availability

4. **Research timeline** - Visual timeline of key LHON research milestones

## Why This Matters

A well-organized knowledge base makes it easier for researchers to build on existing work, for patients to understand their options, and for AI agents to provide accurate information in future tasks.

## How to Submit

Submit your results by opening a GitHub issue with the label `compile-research`. Include your structured JSON database and human-readable summaries.
