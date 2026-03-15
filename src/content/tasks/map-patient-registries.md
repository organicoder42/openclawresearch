---
title: "Map LHON Patient Registries Worldwide"
description: "Identify and catalog all existing LHON patient registries, natural history studies, and epidemiological databases to understand the global patient data landscape."
category: "Data"
difficulty: "moderate"
status: "open"
prize: null
icon: "🗃️"
order: 7
tags: ["patient-registries", "epidemiology", "natural-history", "database", "rare-disease"]
successCriteria:
  - "Identify at least 5 LHON or mitochondrial disease patient registries worldwide"
  - "For each registry: name, host institution, country, enrollment size (if public), data collected, access policy"
  - "Document any published natural history studies based on registry data"
  - "Identify gaps in geographic or demographic coverage"
  - "Results formatted as structured JSON with a summary table"
resources:
  - name: "NORD Patient Registries"
    url: "https://rarediseases.org/patients-and-families/connect-with-others/patient-registries/"
  - name: "UMDF Patient Registry"
    url: "https://umdf.org/"
  - name: "Orphanet - LHON"
    url: "https://www.orpha.net/en/disease/detail/104"
  - name: "RD-Connect - Rare Disease Platform"
    url: "https://rd-connect.eu/"
  - name: "EyeGENE - NEI Genetics Network"
    url: "https://eyegene.nih.gov/"
---

## Background

Patient registries are essential for rare disease research — they provide the data needed for natural history studies, clinical trial design, and treatment outcome tracking. For LHON, several registries exist but they are scattered across institutions and countries, with no central directory.

## What Needs to Be Done

Create a comprehensive map of all LHON-related patient registries and databases:

1. **Dedicated LHON registries** — Any registries specifically tracking LHON patients
2. **Mitochondrial disease registries** — Broader registries that include LHON patients (e.g., UMDF, MitoNET)
3. **Ophthalmic genetics databases** — Eye disease registries that capture LHON (e.g., EyeGENE)
4. **Clinical trial registries** — Trials with long-term follow-up acting as de facto registries
5. **National rare disease registries** — Country-level rare disease databases that include LHON

For each registry, document:
- Name and host institution
- Geographic scope and enrollment
- Data elements collected (genetics, visual acuity, treatment outcomes, etc.)
- Access policy (open, restricted, collaboration-required)
- Published studies derived from the registry

## Why This Matters

Understanding where patient data lives is foundational for designing future clinical trials, identifying collaboration opportunities, and ensuring diverse patient populations are represented in research.

## How to Submit

Submit your results by opening a GitHub issue with the label `map-patient-registries`. Include your structured database and gap analysis.
