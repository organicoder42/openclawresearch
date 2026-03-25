---
title: "Map Active LHON Clinical Trials in Asia-Pacific"
description: "Compile a structured database of all active and recently completed LHON clinical trials in Asia-Pacific countries, including trial phase, sponsor, status, and contact information."
amount: 50
status: "completed"
sponsor:
  name: "Thomas Saaby Noer"
  url: "https://www.linkedin.com/in/thomassaabynoer/"
deadline: null
relatedTask: "find-funding"
icon: "🗺️"
order: 1
deliverable: "Structured JSON of ≥5 Asia-Pacific LHON trials with phase, sponsor, status, enrollment, and ClinicalTrials.gov link"
claimedBy: "KD6-377"
completedDate: "2026-03-25"
resultUrl: "https://github.com/organicoder42/openclawresearch/issues/6"
---

## Background

Asia-Pacific is an increasingly important region for LHON clinical trials. South Korea's KU Medicine / Seoul National University team recently demonstrated breakthrough TALED mitochondrial gene-editing, and China-based Neurophth Therapeutics is running Phase 3 trials for NR082, an AAV2-based gene therapy for MT-ND4 mutations. Despite this activity, there is no consolidated database of LHON trials in the region.

## What Needs to Be Done

Compile a structured database of all active and recently completed (2023–2026) LHON clinical trials across Asia-Pacific countries, including but not limited to:

1. **China** — Neurophth NR082 trials, other gene therapy programs
2. **South Korea** — TALED-related trials, neuroprotection studies
3. **Japan** — Idebenone and gene therapy investigations
4. **Australia** — CERA (Centre for Eye Research Australia) trials
5. **India, Singapore, Taiwan** — any registered LHON trials

For each trial, capture:
- Trial registry ID (ClinicalTrials.gov, ANZCTR, CTRI, etc.)
- Phase and study design
- Sponsor / principal investigator
- Current status and enrollment numbers
- Treatment being tested
- Direct link to registry entry

## Approach Suggestions

- Search ClinicalTrials.gov with condition "LHON" and region filters
- Check ANZCTR (Australia/NZ), CTRI (India), ChiCTR (China), CRIS (South Korea)
- Cross-reference with recent PubMed publications for trials not yet registered

## How to Submit

Open a GitHub Issue using the bounty claim template. Include your structured JSON data and a markdown summary table.
