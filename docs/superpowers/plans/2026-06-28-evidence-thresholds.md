# Evidence Thresholds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PubMed-based evidence threshold markers to CompareTab MiniBar rows and create a new "근거" EvidenceTab with ingredient evidence cards and PMID links.

**Architecture:** `src/evidence.ts` holds all static threshold data (types + EVIDENCE array + lookup maps). `src/EvidenceTab.tsx` is a self-contained new tab component that imports from evidence.ts. `src/CompareTab.tsx` is modified to add a tick mark on MiniBar and ⚠️ notes. `src/VitaminComparator.tsx` gets a 4th tab entry and the EvidenceTab render.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, Lucide React — no new npm dependencies.

## Global Constraints

- No new npm dependencies — existing only: react, react-dom, chart.js, lucide-react, tailwindcss
- Tailwind utility classes only; `style=` props only for dynamic numeric widths (MiniBar percentage)
- TypeScript strict — no `any`, all props explicitly typed
- All user-visible text in Korean
- No backend or fetch calls — all data static in evidence.ts
- White theme tokens: bg `#F8F9FC`, card `#FFFFFF`, border `#E8EAF0`, A=`#2563EB`, B=`#D97706`
- Project root for all commands: `C:\Users\USER\Desktop\vitamine VS\vitamin-app`
- Build: `npm run build` — must produce 0 TypeScript errors
- Deploy: `netlify deploy --prod --dir dist`

---

### Task 1: Create `src/evidence.ts`

**Files:**
- Create: `src/evidence.ts`

**Interfaces:**
- Produces:
  - `EvidenceLevel` — union type used by EvidenceTab badge rendering
  - `EvidenceEntry` — full evidence record type used by EvidenceTab
  - `EVIDENCE` — array of all evidence entries, imported by EvidenceTab
  - `THRESHOLD_MAP` — per-ingredient lookup used by CompareTab for MiniBar tick
  - `EVIDENCE_NOTE` — per-ingredient ⚠️ classification used by CompareTab

- [ ] **Step 1: Write `src/evidence.ts`**

```typescript
// src/evidence.ts

export type EvidenceLevel = 'RCT' | 'Cochrane' | 'in vitro' | 'insufficient';

export type EvidenceEntry = {
  ingredient: string;
  minDose: number;
  unit: 'mg' | 'mcg' | 'IU';
  purpose: string;
  evidenceLevel: EvidenceLevel;
  formNote?: string;
  summary: string;
  pmid: number;
  doi: string;
};

export const EVIDENCE: EvidenceEntry[] = [
  {
    ingredient: 'b12',
    minDose: 1000,
    unit: 'mcg',
    purpose: '신경통',
    evidenceLevel: 'RCT',
    formNote: '활성형(메코발라민) 필요',
    summary: '메코발라민 1000mcg/일, 16주 RCT에서 당뇨성 말초신경통 증상 점수 유의미 개선',
    pmid: 41548600,
    doi: '10.1016/j.tjnut.2026.101368',
  },
  {
    ingredient: 'b1',
    minDose: 150,
    unit: 'mg',
    purpose: '알코올성 신경통',
    evidenceLevel: 'Cochrane',
    formNote: '벤포티아민 한정',
    summary: '벤포티아민 150mg 이상, 알코올성 신경병증 진동 감각 개선 (Cochrane 소규모)',
    pmid: 18646107,
    doi: '10.1002/14651858.CD004573.pub3',
  },
  {
    ingredient: 'b1',
    minDose: 300,
    unit: 'mg',
    purpose: '당뇨성 다발신경증',
    evidenceLevel: 'RCT',
    formNote: '벤포티아민 300mg×2회/일',
    summary: '벤포티아민 300mg×2회/일, 12개월 RCT에서 신경병증 증상 점수 경향성 개선',
    pmid: 41571333,
    doi: '10.1136/bmjdrc-2025-005773',
  },
  {
    ingredient: 'mg',
    minDose: 0,
    unit: 'mg',
    purpose: '근육경련 예방',
    evidenceLevel: 'insufficient',
    summary: '⚠️ Cochrane 메타분석(2020): 성인 특발성 근육경련에 마그네슘 예방 효과 임상적으로 불충분',
    pmid: 32956536,
    doi: '10.1002/14651858.CD009402.pub3',
  },
  {
    ingredient: 'udca',
    minDose: 0,
    unit: 'mg',
    purpose: '알코올성 간 보호',
    evidenceLevel: 'in vitro',
    formNote: 'OTC 50-150mg은 임상 치료 용량(13-15mg/kg/일)에 미치지 못함',
    summary: '⚠️ 시험관 실험 수준: UDCA가 에탄올 유발 간세포 손상 억제. OTC 용량은 임상 치료 용량보다 낮음',
    pmid: 7615206,
    doi: '10.1016/0016-5085(95)90345-3',
  },
];

// CompareTab: ingredient → tick mark data (null = no numeric marker shown)
export const THRESHOLD_MAP: Record<string, { value: number; label: string; unit: string } | null> = {
  b1:   { value: 150, label: '알코올성 신경통', unit: 'mg' },
  b12:  null,
  mg:   null,
  udca: null,
};

// CompareTab: ingredient → warning classification for ⚠️ icon
export const EVIDENCE_NOTE: Record<string, 'insufficient' | 'in_vitro' | undefined> = {
  mg:   'insufficient',
  udca: 'in_vitro',
};
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
npm run build
```

Expected: Build succeeds (new file not yet imported anywhere, so no errors).

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
git add src/evidence.ts
git commit -m "feat: add evidence.ts with PubMed-based threshold data"
```

---

### Task 2: Create `src/EvidenceTab.tsx`

**Files:**
- Create: `src/EvidenceTab.tsx`

**Interfaces:**
- Consumes:
  - `EVIDENCE: EvidenceEntry[]` from `./evidence`
  - `EvidenceLevel` from `./evidence`
- Produces: default export `EvidenceTab` — no props, self-contained

- [ ] **Step 1: Write `src/EvidenceTab.tsx`**

```tsx
// src/EvidenceTab.tsx
import { EVIDENCE, type EvidenceLevel, type EvidenceEntry } from './evidence';

const INGREDIENT_LABEL: Record<string, string> = {
  b1:   'B1 티아민 / 벤포티아민',
  b12:  'B12 메코발라민',
  mg:   '마그네슘',
  udca: 'UDCA',
};

const BADGE: Record<EvidenceLevel, string> = {
  RCT:          'bg-blue-50 text-blue-600 border-blue-200',
  Cochrane:     'bg-purple-50 text-purple-600 border-purple-200',
  'in vitro':   'bg-gray-100 text-gray-500 border-gray-200',
  insufficient: 'bg-amber-50 text-amber-600 border-amber-200',
};

const BADGE_LABEL: Record<EvidenceLevel, string> = {
  RCT:          'RCT',
  Cochrane:     'Cochrane',
  'in vitro':   '시험관',
  insufficient: '근거 불충분',
};

function EvidenceCard({ entry }: { entry: EvidenceEntry }) {
  const hasDose = entry.minDose > 0;
  return (
    <div className="bg-white rounded-xl border border-[#E8EAF0] p-3 space-y-1.5">
      <div className="flex items-center gap-2">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${BADGE[entry.evidenceLevel]}`}>
          {BADGE_LABEL[entry.evidenceLevel]}
        </span>
        <span className="text-[10px] font-semibold text-gray-700">{entry.purpose}</span>
      </div>
      {hasDose && (
        <p className="text-xs font-bold text-[#111827]">
          최소 유효 용량: {entry.minDose}{entry.unit}/일
        </p>
      )}
      {entry.formNote && (
        <p className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
          {entry.formNote}
        </p>
      )}
      <p className="text-[10px] text-gray-500 leading-relaxed">{entry.summary}</p>
      <a
        href={`https://pubmed.ncbi.nlm.nih.gov/${entry.pmid}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-blue-500 hover:text-blue-700 hover:underline"
      >
        PubMed {entry.pmid} →
      </a>
    </div>
  );
}

export default function EvidenceTab() {
  // Group entries by ingredient, preserving display order
  const ORDER = ['b12', 'b1', 'mg', 'udca'];
  const grouped: Record<string, EvidenceEntry[]> = {};
  for (const key of ORDER) {
    grouped[key] = EVIDENCE.filter(e => e.ingredient === key);
  }

  return (
    <div className="mx-3 mt-3 mb-6 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E8EAF0] p-4">
        <p className="text-xs font-bold text-[#111827] mb-0.5">📚 임상 근거 기준</p>
        <p className="text-[10px] text-gray-400">PubMed 논문 기반 · 2026-06 갱신 · 치료 목적 논문 기준이며 건강보조식품 효능과 다를 수 있음</p>
      </div>

      {/* Ingredient sections */}
      {ORDER.map(key => {
        const entries = grouped[key];
        if (!entries || entries.length === 0) return null;
        return (
          <div key={key} className="space-y-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1">
              {INGREDIENT_LABEL[key] ?? key}
            </p>
            {entries.map(entry => (
              <EvidenceCard key={`${entry.ingredient}-${entry.pmid}`} entry={entry} />
            ))}
          </div>
        );
      })}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
        <p className="text-[10px] text-amber-700 leading-relaxed">
          ⚠️ 이 정보는 의학적 조언이 아닙니다. 논문 기반 참고 자료이며, 실제 복용 결정은 의사·약사와 상담하세요.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
npm run build
```

Expected: 0 errors. (EvidenceTab not yet imported in VitaminComparator, so no "unused" errors in strict mode — TypeScript only errors on actual type mismatches.)

- [ ] **Step 3: Commit**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
git add src/EvidenceTab.tsx
git commit -m "feat: add EvidenceTab with PubMed evidence cards"
```

---

### Task 3: Modify `src/CompareTab.tsx` — threshold markers

**Files:**
- Modify: `src/CompareTab.tsx`

**Interfaces:**
- Consumes:
  - `THRESHOLD_MAP` from `./evidence` — `{ value, label, unit } | null` per ingredient
  - `EVIDENCE_NOTE` from `./evidence` — `'insufficient' | 'in_vitro' | undefined` per ingredient

Changes in this task:
1. Add import of `THRESHOLD_MAP` and `EVIDENCE_NOTE` from `./evidence`
2. Modify `MiniBar` to accept optional `thresholdPct?: number` — renders a thin vertical tick mark
3. Add `evidenceNote?: 'insufficient' | 'in_vitro'` to `RowProps` — renders ⚠️ after ingredient label
4. Thread `thresholdPct` into `MiniBar` calls in `CompareRow` (numeric mode)
5. Thread `thresholdPct` into `MiniBar` calls in the custom B1 row
6. Thread `evidenceNote` into `CompareRow` for `mg` and `udca` rows

- [ ] **Step 1: Add import for evidence lookups**

Find the current imports at the top of `src/CompareTab.tsx`:
```tsx
import type { VitaminProduct } from './data';
import { vitaminData, isActive, isB12Active, getRadarValues } from './data';
```

Replace with:
```tsx
import type { VitaminProduct } from './data';
import { vitaminData, isActive, isB12Active, getRadarValues } from './data';
import { THRESHOLD_MAP, EVIDENCE_NOTE } from './evidence';
```

- [ ] **Step 2: Modify `MiniBar` to show threshold tick mark**

Find the current `MiniBar` function:
```tsx
function MiniBar({ val, maxVal, color }: { val: number; maxVal: number; color: string }) {
  const pct = maxVal > 0 ? Math.min((val / maxVal) * 100, 100) : 0;
  return (
    <div className="h-1 bg-gray-100 rounded-full mt-1">
      <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}
```

Replace with:
```tsx
function MiniBar({ val, maxVal, color, thresholdPct }: {
  val: number; maxVal: number; color: string; thresholdPct?: number;
}) {
  const pct = maxVal > 0 ? Math.min((val / maxVal) * 100, 100) : 0;
  return (
    <div className="h-1 bg-gray-100 rounded-full mt-1 relative">
      <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      {thresholdPct !== undefined && (
        <div
          className="absolute top-[-2px] w-px h-[5px] bg-orange-400 rounded-sm"
          style={{ left: `${Math.min(thresholdPct, 98)}%` }}
          title={`임상 근거 기준선`}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Add `evidenceNote` and `thresholdPct` to `RowProps`**

Find the current `RowProps` type:
```tsx
type RowProps = {
  label: string;
  sub: string;
  guideKey?: string;
  expanded: string | null;
  onToggle: (k: string) => void;
  // numeric mode
  v1?: number; v2?: number; unit?: string; globalMax?: number;
  // text mode
  isText?: boolean; t1?: string; t2?: string;
};
```

Replace with:
```tsx
type RowProps = {
  label: string;
  sub: string;
  guideKey?: string;
  expanded: string | null;
  onToggle: (k: string) => void;
  // numeric mode
  v1?: number; v2?: number; unit?: string; globalMax?: number;
  // text mode
  isText?: boolean; t1?: string; t2?: string;
  // evidence
  thresholdPct?: number;
  evidenceNote?: 'insufficient' | 'in_vitro';
};
```

- [ ] **Step 4: Thread `evidenceNote` and `thresholdPct` into `CompareRow` render**

Find the `CompareRow` function signature:
```tsx
function CompareRow({ label, sub, guideKey, expanded, onToggle, v1, v2, unit, globalMax, isText, t1 = '', t2 = '' }: RowProps) {
```

Replace with:
```tsx
function CompareRow({ label, sub, guideKey, expanded, onToggle, v1, v2, unit, globalMax, isText, t1 = '', t2 = '', thresholdPct, evidenceNote }: RowProps) {
```

Then find the label column div inside the button:
```tsx
        <div className="px-3 py-2.5 bg-[#F8F9FC] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#111827] leading-tight">{label}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{sub}</p>
          </div>
```

Replace with:
```tsx
        <div className="px-3 py-2.5 bg-[#F8F9FC] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-[#111827] leading-tight">{label}</p>
              {evidenceNote && (
                <span
                  title={evidenceNote === 'insufficient' ? '임상 근거 불충분 (Cochrane 메타분석)' : '시험관 실험 수준 (임상 용량 미달)'}
                  className="text-[10px] cursor-help"
                >⚠️</span>
              )}
            </div>
            <p className="text-[9px] text-gray-400 mt-0.5">{sub}</p>
          </div>
```

Then find the two `MiniBar` calls inside the numeric A cell and B cell of `CompareRow`:

A cell MiniBar:
```tsx
            {(v1 ?? 0) > 0 && <MiniBar val={v1 ?? 0} maxVal={maxV} color={BLUE} />}
```
Replace with:
```tsx
            {(v1 ?? 0) > 0 && <MiniBar val={v1 ?? 0} maxVal={maxV} color={BLUE} thresholdPct={thresholdPct} />}
```

B cell MiniBar:
```tsx
            {(v2 ?? 0) > 0 && <MiniBar val={v2 ?? 0} maxVal={maxV} color={AMBER} />}
```
Replace with:
```tsx
            {(v2 ?? 0) > 0 && <MiniBar val={v2 ?? 0} maxVal={maxV} color={AMBER} thresholdPct={thresholdPct} />}
```

- [ ] **Step 5: Thread threshold into the custom B1 row MiniBar calls**

The B1 row is a custom inline block (lines ~276-305 in CompareTab.tsx). It has two MiniBar calls:

First `MiniBar` call (product A):
```tsx
              <MiniBar val={p1.b1_total} maxVal={MAX_VALS.b1_total} color={BLUE} />
```
Replace with:
```tsx
              <MiniBar val={p1.b1_total} maxVal={MAX_VALS.b1_total} color={BLUE} thresholdPct={
                THRESHOLD_MAP['b1'] ? (THRESHOLD_MAP['b1'].value / MAX_VALS.b1_total) * 100 : undefined
              } />
```

Second `MiniBar` call (product B):
```tsx
              <MiniBar val={p2.b1_total} maxVal={MAX_VALS.b1_total} color={AMBER} />
```
Replace with:
```tsx
              <MiniBar val={p2.b1_total} maxVal={MAX_VALS.b1_total} color={AMBER} thresholdPct={
                THRESHOLD_MAP['b1'] ? (THRESHOLD_MAP['b1'].value / MAX_VALS.b1_total) * 100 : undefined
              } />
```

- [ ] **Step 6: Thread `evidenceNote` and `thresholdPct` into Organ Support CompareRow calls**

Find the Organ Support section and its four CompareRow calls:
```tsx
        <CompareRow label="UDCA" sub="간 기능 보조" guideKey="udca" expanded={expanded} onToggle={toggle} v1={p1.udca} v2={p2.udca} unit="mg" globalMax={MAX_VALS.udca} />
        <CompareRow label="마그네슘"  sub="근육 이완·눈떨림" guideKey="mg" expanded={expanded} onToggle={toggle} v1={p1.mg}  v2={p2.mg}  unit="mg" globalMax={MAX_VALS.mg} />
        <CompareRow label="아연"     sub="면역·남성 활력" expanded={expanded} onToggle={toggle} v1={p1.zn}  v2={p2.zn}  unit="mg" globalMax={MAX_VALS.zn} />
        <CompareRow label="비타민D"  sub="뼈 건강·면역" expanded={expanded} onToggle={toggle} v1={p1.vitD} v2={p2.vitD} unit="IU" globalMax={MAX_VALS.vitD} />
```

Replace with:
```tsx
        <CompareRow label="UDCA" sub="간 기능 보조" guideKey="udca" expanded={expanded} onToggle={toggle} v1={p1.udca} v2={p2.udca} unit="mg" globalMax={MAX_VALS.udca} evidenceNote={EVIDENCE_NOTE['udca']} />
        <CompareRow label="마그네슘"  sub="근육 이완·눈떨림" guideKey="mg" expanded={expanded} onToggle={toggle} v1={p1.mg}  v2={p2.mg}  unit="mg" globalMax={MAX_VALS.mg} evidenceNote={EVIDENCE_NOTE['mg']} />
        <CompareRow label="아연"     sub="면역·남성 활력" expanded={expanded} onToggle={toggle} v1={p1.zn}  v2={p2.zn}  unit="mg" globalMax={MAX_VALS.zn} />
        <CompareRow label="비타민D"  sub="뼈 건강·면역" expanded={expanded} onToggle={toggle} v1={p1.vitD} v2={p2.vitD} unit="IU" globalMax={MAX_VALS.vitD} />
```

- [ ] **Step 7: Verify build passes**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
npm run build
```

Expected: 0 TypeScript errors, build output in `dist/`.

- [ ] **Step 8: Commit**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
git add src/CompareTab.tsx
git commit -m "feat: add evidence threshold markers to CompareTab MiniBar"
```

---

### Task 4: Add "근거" tab to `src/VitaminComparator.tsx` + build + deploy

**Files:**
- Modify: `src/VitaminComparator.tsx`

**Interfaces:**
- Consumes: `EvidenceTab` default export from `./EvidenceTab`

- [ ] **Step 1: Add `BookOpen` to lucide-react imports and import `EvidenceTab`**

Find in `src/VitaminComparator.tsx`:
```tsx
import { FlaskConical, Check, Copy, CheckCheck, ArrowLeftRight, LayoutGrid, Sparkles } from 'lucide-react';
import { vitaminData } from './data';
import CompareTab from './CompareTab';
import FullTable from './FullTable';
import RecommendTab from './RecommendTab';
```

Replace with:
```tsx
import { FlaskConical, Check, Copy, CheckCheck, ArrowLeftRight, LayoutGrid, Sparkles, BookOpen } from 'lucide-react';
import { vitaminData } from './data';
import CompareTab from './CompareTab';
import FullTable from './FullTable';
import RecommendTab from './RecommendTab';
import EvidenceTab from './EvidenceTab';
```

- [ ] **Step 2: Expand `Tab` type to include `'evidence'`**

Find:
```tsx
type Tab = 'compare' | 'table' | 'recommend';
```

Replace with:
```tsx
type Tab = 'compare' | 'table' | 'recommend' | 'evidence';
```

- [ ] **Step 3: Add "근거" tab to `TAB_ITEMS`**

Find:
```tsx
  const TAB_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'compare',   label: '1:1 비교',   icon: <ArrowLeftRight size={13} /> },
    { key: 'table',     label: '전체 테이블', icon: <LayoutGrid size={13} /> },
    { key: 'recommend', label: '추천',        icon: <Sparkles size={13} /> },
  ];
```

Replace with:
```tsx
  const TAB_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'compare',   label: '1:1 비교',   icon: <ArrowLeftRight size={13} /> },
    { key: 'table',     label: '전체 테이블', icon: <LayoutGrid size={13} /> },
    { key: 'recommend', label: '추천',        icon: <Sparkles size={13} /> },
    { key: 'evidence',  label: '근거',        icon: <BookOpen size={13} /> },
  ];
```

- [ ] **Step 4: Add `EvidenceTab` render in tab content section**

Find:
```tsx
      {activeTab === 'compare'   && <CompareTab p1={p1} p2={p2} />}
      {activeTab === 'table'     && <FullTable onSelect={handleTableSelect} />}
      {activeTab === 'recommend' && <RecommendTab onSelect={handleRecommendSelect} />}
```

Replace with:
```tsx
      {activeTab === 'compare'   && <CompareTab p1={p1} p2={p2} />}
      {activeTab === 'table'     && <FullTable onSelect={handleTableSelect} />}
      {activeTab === 'recommend' && <RecommendTab onSelect={handleRecommendSelect} />}
      {activeTab === 'evidence'  && <EvidenceTab />}
```

- [ ] **Step 5: Build and verify**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
npm run build
```

Expected output: 0 TypeScript errors. Build size will increase slightly (new EvidenceTab component). Verify the dist/ directory was updated.

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
git add src/VitaminComparator.tsx
git commit -m "feat: add 근거 evidence tab to VitaminComparator"
```

- [ ] **Step 7: Deploy to Netlify**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
netlify deploy --prod --dir dist
```

Expected: `Website URL: https://vitamin-pro-kr.netlify.app`

- [ ] **Step 8: Manual verification checklist**

Open https://vitamin-pro-kr.netlify.app and verify:

1. Tab bar shows 4 tabs: 1:1 비교 / 전체 테이블 / 추천 / **근거**
2. Click **근거** tab → shows "📚 임상 근거 기준" header card
3. Evidence cards appear for: B12 메코발라민, B1 티아민/벤포티아민 (2 cards), 마그네슘, UDCA
4. Each card shows badge ([RCT] / [Cochrane] / [시험관] / [근거 불충분])
5. B12 card shows "최소 유효 용량: 1000mcg/일"
6. Each card has "PubMed {pmid} →" link that opens pubmed.ncbi.nlm.nih.gov
7. Click **1:1 비교** tab → B1 티아민 MiniBar has a thin orange tick mark at ~150/max position
8. 마그네슘 row label shows ⚠️ icon; hover shows "임상 근거 불충분" tooltip
9. UDCA row label shows ⚠️ icon; hover shows "시험관 실험 수준" tooltip

- [ ] **Step 9: Final commit with git push**

```bash
cd "C:/Users/USER/Desktop/vitamine VS/vitamin-app"
git push origin master
```
