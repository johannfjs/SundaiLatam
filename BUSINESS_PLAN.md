# FitScience AI — Business Plan

---

## Executive Summary

FitScience AI is a subscription SaaS platform that generates personalized, peer-reviewed-backed workout routines using large language models and a curated corpus of exercise science research. Every recommendation is traced to a citation. Users see not just what to do, but **why** — backed by the same journals that elite coaches and sport scientists read.

---

## Problem Statement

1. **Unscientific training is the norm.** 80%+ of gym-goers follow routines from YouTube, Instagram, or "bro-science" — with no grounding in evidence.
2. **Research is fragmented and inaccessible.** Thousands of relevant exercise science papers exist (Journal of Strength & Conditioning Research, Sports Medicine, etc.), but reading them is a full-time job.
3. **Science-credentialed coaches are expensive.** A trainer with a sports science degree charges $80–200/session. Most people can't afford that.

---

## Solution

An AI agent that ingests peer-reviewed exercise science literature, retrieves relevant research given your profile, and generates a fully structured, periodized workout program — with every set/rep recommendation traceable to a citation.

**Key differentiators:**

- Real-time streaming: watch the reasoning and the routine populate simultaneously
- Citation traceability: every exercise selection links to the source paper
- Structured output: volume per muscle group, RPE targets, tempo prescriptions
- Fully personalized: goal, equipment, injuries, time available, experience level

---

## Target Market

### Primary Persona: "Science Alex"

- Age 18–45, male or female
- Intermediate-to-advanced lifter (1–5+ years)
- Reads fitness research (follows RP Strength, Jeff Nippard, PubMed)
- Values optimization, frustrated by generic "3 sets of 10" programs
- Pays for quality: already uses fitness apps, protein supplements, gym membership

### Secondary: Personal Trainers

- Need evidence-based program templates for clients
- Want citation backup for recommendations
- Potential white-label / coach tier customers

### Market Size

| Segment                          | TAM          |
| -------------------------------- | ------------ |
| Fitness apps global              | $4.7B (2025) |
| Evidence-based / premium fitness | ~$600M (SAM) |
| Addressable with current product | ~$60M (SOM)  |

---

## Revenue Model

| Tier           | Price  | Features                                                          |
| -------------- | ------ | ----------------------------------------------------------------- |
| **Free**       | $0/mo  | 3 routine generations/month, basic output, no PDF export          |
| **Pro**        | $15/mo | Unlimited generations, PDF export with citations, routine history |
| **Coach**      | $49/mo | Client management dashboard, white-label output, API access       |
| **Enterprise** | Custom | EHR/clinic integration, corporate wellness, custom corpus         |

### Financial Projections (12-month post-launch)

| Month | Users  | Pro Conv. | MRR     |
| ----- | ------ | --------- | ------- |
| 3     | 1,000  | 15%       | $2,250  |
| 6     | 4,000  | 18%       | $10,800 |
| 9     | 8,000  | 20%       | $24,000 |
| 12    | 12,000 | 22%       | $39,600 |

**Path to profitability:** ~8,000 users at 20% Pro conversion = $24K MRR exceeds infrastructure + team costs for a lean 2-person operation.

---

## Competitive Analysis

| Competitor              | Science-backed          | Citation tracing | Structured output | Real-time streaming |
| ----------------------- | ----------------------- | ---------------- | ----------------- | ------------------- |
| Fitbod                  | Partial (adaptive load) | No               | Yes               | No                  |
| Freeletics              | No                      | No               | No                | No                  |
| Hevy                    | No                      | No               | Yes (tracking)    | No                  |
| Whoop Coach             | Partial (recovery)      | No               | No                | No                  |
| ChatGPT / Claude direct | Inconsistent            | No               | No                | No                  |
| **FitScience AI**       | **Yes**                 | **Yes**          | **Yes**           | **Yes**             |

### Moat

1. **Proprietary curated corpus** — quality matters more than quantity; our team hand-selects high-impact exercise science papers (not scraped noise).
2. **Structured streaming architecture** — the dual-event SSE pipeline (narrative + JSON routine) is a specific technical product decision most competitors won't replicate easily.
3. **Citation traceability** — builds trust, reduces hallucinations, and creates a feedback loop for corpus improvement.
4. **Exercise science consultant** — a credentialed collaborator validates outputs and curates the article library.

---

## Go-to-Market Strategy

### Phase 1: Community Seeding (Months 1–3)

- Product Hunt launch (target: #3 Product of the Day)
- Reddit: r/Fitness, r/strength_training, r/powerlifting, r/bodybuilding
- Target 500 signups from beta waitlist, 50 paying users in week 1
- Collect testimonials and case studies from early users

### Phase 2: Content Engine (Months 4–6)

- Partner with science-based fitness creators:
  - Renaissance Periodization (RP Strength)
  - Jeff Nippard
  - Alan Thrall / Barbell Medicine
- SEO content: "evidence-based [exercise name] programming", "how many sets per week for hypertrophy", etc.
- Each article links to a live FitScience AI demo

### Phase 3: Trainer Channel (Months 7–12)

- Outreach to personal trainers and online coaches
- Affiliate program: 20% recurring commission for coach referrals
- NSCA / CSCS community targeting

---

## Technical Roadmap

| Milestone                                 | Timeline  |
| ----------------------------------------- | --------- |
| MVP: RAG + streaming + routine generation | Month 1   |
| Routine history, PDF export               | Month 2   |
| Mobile PWA, voice input                   | Month 3   |
| Trainer dashboard (Coach tier)            | Month 5   |
| Progress tracking integration             | Month 6   |
| Video form demonstrations                 | Month 9   |
| Computer vision form check (stretch goal) | Month 12+ |

---

## Team Requirements

| Role                        | Responsibility                                          |
| --------------------------- | ------------------------------------------------------- |
| Full-stack ML Engineer      | FastAPI + LangChain + React, model tuning, RAG pipeline |
| Exercise Science Consultant | Corpus curation, output validation, clinical accuracy   |
| Growth / Marketing          | Community, content, partnerships, SEO                   |

---

## Funding Scenario (Optional Raise)

**$250K pre-seed** to fund:

- 12 months runway for 2 engineers
- $50K content & community marketing
- $30K compute / OpenAI API costs at scale
- $20K legal (IP, ToS, data licensing for article corpus)

**Bootstrappable** at lean scope: 1 engineer + $500/mo API budget until first 200 paying users (~$3K MRR).

---

## Risks & Mitigations

| Risk                                                      | Mitigation                                                                  |
| --------------------------------------------------------- | --------------------------------------------------------------------------- |
| LLM hallucinations in citations                           | Retrieval-grounded generation + Pydantic validation; human review tier      |
| OpenAI API cost at scale                                  | Token budget guards; prompt optimization; local model fallback              |
| Copyright on ingested articles                            | Use open-access papers (PubMed Central PMC, arXiv); partner with publishers |
| Competition from OpenAI/Anthropic adding fitness features | Corpus depth + structured output + UX moat; move faster                     |
| Regulatory (medical advice claims)                        | Clear "not medical advice" disclaimer; focus on healthy adults              |
