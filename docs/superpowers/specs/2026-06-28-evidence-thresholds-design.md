# Evidence Thresholds Design

## Goal

Add PubMed-based evidence thresholds to the vitamin comparison app:
1. Inline threshold markers on CompareTab MiniBar per ingredient row
2. New "근거" tab (EvidenceTab) with per-ingredient evidence cards + PMID links

## Context

- App: React 18 + TypeScript + Vite + Tailwind CSS v3
- 16 hardcoded Korean OTC vitamin products in `src/data.ts`
- Current tabs: `compare` | `table` | `recommend`
- Deployed: vitamin-pro-kr.netlify.app (Netlify static)
- No backend — all data is static TypeScript

## Decisions Made

- **Approach**: Static `src/evidence.ts` constants (no backend, no API calls)
- **Scope**: Personal tool — accuracy over breadth, maintainable by hand
- **Negative evidence included**: Mg muscle-cramp Cochrane finding displayed honestly to increase credibility

---

## Architecture

### Files

| File | Action | Responsibility |
|------|--------|----------------|
| `src/evidence.ts` | Create | Evidence threshold data + types |
| `src/EvidenceTab.tsx` | Create | New tab: ingredient cards + PMID links |
| `src/CompareTab.tsx` | Modify | Inline threshold markers on MiniBar rows |
| `src/VitaminComparator.tsx` | Modify | Add 4th tab "근거" (BookOpen icon) |

Data flow: `evidence.ts` is imported by both `CompareTab` (markers) and `EvidenceTab` (cards). No circular dependencies.

---

## §1 — `src/evidence.ts`

### Types

```typescript
export type EvidenceLevel = 'RCT' | 'Cochrane' | 'in vitro' | 'insufficient';

export type EvidenceEntry = {
  ingredient: string;       // matches data.ts field key: 'b1', 'b12', 'mg', 'udca', 'zn', 'vitD'
  minDose: number;          // minimum effective dose from evidence (0 if insufficient)
  unit: 'mg' | 'mcg' | 'IU';
  purpose: string;          // Korean label, e.g. '신경통', '알코올·피로'
  evidenceLevel: EvidenceLevel;
  formNote?: string;        // e.g. '활성형(메코발라민) 필요', '벤포티아민 한정'
  summary: string;          // 1-line Korean clinical summary
  pmid: number;
  doi: string;
};
```

### Data (PubMed-sourced, as of 2026-06-28)

All entries sourced from PubMed. DOIs are canonical links.

| ingredient | purpose | minDose | unit | evidenceLevel | formNote | PMID | DOI |
|---|---|---|---|---|---|---|---|
| `b12` | 신경통 | 1000 | mcg | RCT | 활성형(메코발라민) 필요 | 41548600 | 10.1016/j.tjnut.2026.101368 |
| `b1` | 알코올성 신경통 | 150 | mg | Cochrane | 벤포티아민 한정 | 18646107 | 10.1002/14651858.CD004573.pub3 |
| `b1` | 당뇨성 다발신경증 | 300 | mg | RCT | 벤포티아민 300mg×2회 | 41571333 | 10.1136/bmjdrc-2025-005773 |
| `mg` | 근육경련 예방 | 0 | mg | insufficient | — | 32956536 | 10.1002/14651858.CD009402.pub3 |
| `udca` | 알코올성 간 보호 | 0 | mg | in vitro | OTC 50-150mg은 임상 치료 용량(13-15mg/kg/일)에 미치지 못함 | 7615206 | 10.1016/0016-5085(95)90345-3 |

**Summary strings (Korean, 1 line each):**
- b12/신경통: `"메코발라민 1000mcg/일, 16주 RCT에서 당뇨성 말초신경통 증상 점수 유의미 개선"`
- b1/알코올성: `"벤포티아민 150mg 이상, 알코올성 신경병증 진동 감각 개선 (Cochrane 소규모)"`
- b1/당뇨성: `"벤포티아민 300mg×2회/일, 12개월 RCT에서 신경병증 증상 점수 경향성 개선"`
- mg/경련: `"⚠️ Cochrane 메타분석: 성인의 특발성 근육경련에 마그네슘 예방 효과 불충분"`
- udca/간: `"⚠️ 시험관 실험 수준: UDCA가 에탄올 유발 간세포 손상 억제. OTC 50-150mg은 임상 치료 용량(13-15mg/kg/일)보다 낮음"`

---

## §2 — CompareTab Inline Markers

### Target rows

Only add markers to rows where an `EvidenceEntry` exists for the ingredient. Currently: `b1`, `b12`, `mg`, `udca`.

### Marker rendering

Each numeric CompareRow (existing component in `CompareTab.tsx`) receives an optional `threshold` prop added to its existing `RowProps` interface:

```typescript
type ThresholdMark = {
  value: number;         // absolute dose value
  label: string;         // e.g. '신경통 기준'
  evidenceLevel: EvidenceLevel;
  insufficient?: boolean;
};
```

**MiniBar with marker:**
```
B12 [████████░░░░░░] 500mcg
             ▼ 신경통 1000mcg
```

- Marker rendered as a small `▼` positioned at `(threshold / globalMax) * 100%` on the bar track
- Color: `insufficient` → amber warning icon instead of marker
- Product value ≥ threshold → bar segment color stays blue/amber
- Product value < threshold → bar segment color shifts to muted gray, small orange dot on bar end

### Insufficient evidence display

For `mg` (근육경련): show a small `⚠️` icon after the bar with tooltip text from `summary`. No threshold marker rendered.

---

## §3 — EvidenceTab

### Tab registration

In `VitaminComparator.tsx`, add 4th tab:
```typescript
{ key: 'evidence', label: '근거', icon: <BookOpen size={13} /> }
```
Tab type: `type Tab = 'compare' | 'table' | 'recommend' | 'evidence';`

Import `BookOpen` from `lucide-react`.

### EvidenceTab layout

```
┌─────────────────────────────────┐
│ 📚 임상 근거 기준               │
│ PubMed 논문 기반 · 2026-06 갱신 │
└─────────────────────────────────┘

[B12 메코발라민]
┌─────────────────────────────────┐
│ 🔵 [RCT]  신경통 목적           │
│ 최소 유효 용량: 1000 mcg/일     │
│ 활성형(메코발라민) 필요          │
│ "메코발라민 1000mcg/일, 16주..."│
│ → PubMed 41548600              │
└─────────────────────────────────┘

[B1 티아민]
┌─────────────────────────────────┐
│ 🟣 [Cochrane]  알코올성 신경통  │
│ ...                             │
└─────────────────────────────────┘

[마그네슘]
┌─────────────────────────────────┐
│ 🟡 [근거 불충분]  근육경련 예방  │
│ ⚠️ Cochrane 메타분석(2020):     │
│ "성인 특발성 경련에 예방 효과   │
│  임상적으로 불충분"             │
│ → PubMed 32956536              │
└─────────────────────────────────┘
```

### Evidence level badge colors

| Level | Badge style |
|-------|------------|
| `RCT` | `bg-blue-50 text-blue-600 border-blue-200` |
| `Cochrane` | `bg-purple-50 text-purple-600 border-purple-200` |
| `in vitro` | `bg-gray-100 text-gray-500 border-gray-200` |
| `insufficient` | `bg-amber-50 text-amber-600 border-amber-200` |

### PMID link format

```
https://pubmed.ncbi.nlm.nih.gov/{pmid}/
```

Rendered as: `PubMed {pmid}` with `target="_blank" rel="noopener noreferrer"`

---

## Global Constraints

- No new npm dependencies — use only existing packages (React, Tailwind, Lucide)
- Tailwind only — no inline `style=` except where absolutely required for dynamic widths
- TypeScript strict — no `any`, all props typed
- All text Korean except component/variable names
- No backend, no fetch calls — all data static in `evidence.ts`
- Preserve existing white theme tokens: bg `#F8F9FC`, card `#FFFFFF`, border `#E8EAF0`, A=`#2563EB`, B=`#D97706`

---

## Out of Scope

- Zinc and Vitamin D thresholds (insufficient search results in this session; add in future update)
- User-configurable thresholds
- Dynamic PubMed API integration
- Threshold comparison between A and B products (markers are absolute, not relative)
