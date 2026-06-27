# Vitamin App Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 화이트 테마 + 세로 2컬럼 비교 레이아웃 + 레이더 차트 + 증상 기반 추천 탭을 vitamin-app에 구현한다.

**Architecture:** 기존 단일 파일 `VitaminComparator.tsx`를 5개 파일로 분리. `data.ts`에 모든 데이터·로직 집중, `VitaminComparator.tsx`는 탭 라우팅 쉘, 나머지 3개 파일은 각 탭 UI. Chart.js로 레이더 차트 구현.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, Chart.js 4, Vite, Netlify CLI

## Global Constraints

- 작업 디렉토리: `C:\Users\USER\Desktop\vitamine VS\vitamin-app`
- 모든 명령어는 해당 디렉토리에서 실행
- 화이트 테마 색상: 배경 `#F8F9FC`, 카드 `#FFFFFF`, 테두리 `#E8EAF0`, A컬러 `#2563EB`, B컬러 `#D97706`
- `npm run build` — TypeScript 에러 없음 필수
- 모바일 퍼스트 (max-width 448px)
- Tailwind arbitrary values 사용 가능 (예: `bg-[#F8F9FC]`)

---

### Task 1: Chart.js 설치 + data.ts 생성

**Files:**
- Create: `src/data.ts`
- Modify: `package.json` (chart.js dependency)

**Interfaces:**
- Produces:
  - `VitaminProduct` type
  - `vitaminData: VitaminProduct[]`
  - `SymptomKey` type
  - `SYMPTOM_LABELS: Record<SymptomKey, string>`
  - `PRESETS: Record<string, SymptomKey[]>`
  - `isActive(s: string): boolean`
  - `isB12Active(s: string): boolean`
  - `scoreProduct(product: VitaminProduct, symptoms: SymptomKey[]): number`
  - `getReasons(product: VitaminProduct, symptoms: SymptomKey[]): string[]`
  - `RADAR_MAX: Record<string, number>`
  - `getRadarValues(p: VitaminProduct): number[]`

- [ ] **Step 1: Chart.js 설치**

```bash
cd "C:\Users\USER\Desktop\vitamine VS\vitamin-app"
npm install chart.js
```

Expected: `chart.js` appears in `package.json` dependencies, no errors.

- [ ] **Step 2: src/data.ts 생성**

```typescript
// src/data.ts

export type VitaminProduct = {
  id: number;
  name: string;
  maker: string;
  dailyDose: string;
  b1_info: string;
  b1_total: number;
  b2_info: string;
  b6_info: string;
  b12_info: string;
  b3: number;
  b5: number;
  b7: number;
  b9: number;
  udca: number;
  mg: number;
  vitD: number;
  zn: number;
  others: string[];
  features: string[];
  target: string;
  warning: string;
};

// ── 16개 제품 데이터 (기존 VitaminComparator.tsx의 vitaminData 배열을 그대로 복사) ──
export const vitaminData: VitaminProduct[] = [
  { id:1,  name:"비맥스 제트",          maker:"GC녹십자",  dailyDose:"1일 1정",
    b1_info:"벤포티아민 100 + 비스벤티아민 30", b1_total:130,
    b2_info:"리보플라빈부티레이트(활성) 50",
    b6_info:"피리독살포스페이트(활성) 50",
    b12_info:"메코발라민(활성) 1000mcg",
    b3:10,  b5:100, b7:0.2,  b9:0.5,
    udca:60,  mg:60.3, vitD:1000, zn:24.1,
    others:["타우린 100mg","크롬","이노시톨"],
    features:["활성비타민 최다","비스벤티아민(뇌이행)"],
    target:"육체피로 심함 + 신경통 + 빠른 효과",
    warning:"위장장애 가능성 있음" },
  { id:2,  name:"벤포벨 S",             maker:"종근당",    dailyDose:"1일 1정",
    b1_info:"벤포티아민 100 + 비스벤티아민 30", b1_total:130,
    b2_info:"리보플라빈 100",
    b6_info:"피리독신 100",
    b12_info:"메코발라민(활성) 500mcg",
    b3:0,   b5:100, b7:0.2,  b9:0.4,
    udca:60,  mg:18.1, vitD:1000, zn:16,
    others:["타우린 100mg","메티오닌 15mg","오로트산 25mg"],
    features:["UDCA 고함량","간 해독 시너지"],
    target:"육체피로 + 잦은 음주(간 피로)",
    warning:"19세 미만 복용 금지" },
  { id:3,  name:"메가트루 633",          maker:"유한양행",  dailyDose:"1일 1정",
    b1_info:"벤포티아민 50 + 비스벤티아민 15", b1_total:65,
    b2_info:"리보플라빈부티레이트(활성) 5",
    b6_info:"피리독살포스페이트(활성) 30 + 피리독신 20",
    b12_info:"메코+코바+시아노 (3종) 1000mcg",
    b3:10,  b5:50,  b7:0.1,  b9:0.25,
    udca:15,  mg:70.3, vitD:500,  zn:15,
    others:["마그네슘 3종","활성비타민 6종"],
    features:["6(활성B)-3(B12)-3(Mg) 배합","신경안정 특화"],
    target:"수험생/뇌피로 + 신경과민 + 위장예민",
    warning:"절대 함량보단 생체이용률 중심 설계" },
  { id:4,  name:"비맥스 메타비",         maker:"GC녹십자",  dailyDose:"1일 1정",
    b1_info:"벤포티아민 100 + 비스벤티아민 30", b1_total:130,
    b2_info:"리보플라빈부티레이트(활성) 100",
    b6_info:"피리독신 100",
    b12_info:"히드록소코발라민(활성) 1000mcg",
    b3:10,  b5:100, b7:0.1,  b9:0.5,
    udca:30,  mg:60.3, vitD:1000, zn:30,
    others:["L-시스테인","셀레늄"],
    features:["활성 B군 고함량","피부 점막 회복"],
    target:"강력한 피로회복 + 구내염/피부염",
    warning:"요 색깔 진해짐" },
  { id:5,  name:"비맥스 메타",           maker:"GC녹십자",  dailyDose:"1일 1정",
    b1_info:"벤포티아민 95 + 비스벤티아민 5", b1_total:100,
    b2_info:"리보플라빈 100",
    b6_info:"피리독신 100",
    b12_info:"시아노코발라민 500mcg",
    b3:10,  b5:100, b7:0.1,  b9:0.4,
    udca:30,  mg:60.3, vitD:1000, zn:24,
    others:["콜린","이노시톨"],
    features:["알약 크기 작음","가성비/인지도 1위"],
    target:"종합 피로회복 (입문용 추천)",
    warning:"없음 (표준형)" },
  { id:6,  name:"벤포벨 G",             maker:"종근당",    dailyDose:"1일 1정",
    b1_info:"벤포티아민 100", b1_total:100,
    b2_info:"리보플라빈 100",
    b6_info:"피리독신 100",
    b12_info:"시아노코발라민 100mcg",
    b3:30,  b5:30,  b7:0.2,  b9:0.2,
    udca:30,  mg:18.1, vitD:1000, zn:16,
    others:["코큐텐 2mg","비타민C 50mg","셀레늄"],
    features:["육체피로 기본기","코큐텐(에너지 대사)"],
    target:"육체피로 + 어깨결림",
    warning:"B12 함량 상대적 낮음" },
  { id:7,  name:"메가트루 파워",          maker:"유한양행",  dailyDose:"1일 1정",
    b1_info:"벤포티아민 100", b1_total:100,
    b2_info:"리보플라빈 100",
    b6_info:"피리독신 100",
    b12_info:"시아노코발라민 100mcg",
    b3:30,  b5:30,  b7:0.1,  b9:0.4,
    udca:30,  mg:50,  vitD:1000, zn:25,
    others:["비타민K1(피토나디온) 60mcg","셀레늄"],
    features:["속편한 고함량","비타민K1 함유"],
    target:"소화기능 약한 분 + 피로회복",
    warning:"없음" },
  { id:8,  name:"임팩타민 시그니처",      maker:"대웅제약",  dailyDose:"1일 1정",
    b1_info:"벤포티아민 100 + 비스벤티아민 30", b1_total:130,
    b2_info:"리보플라빈부티레이트(활성) 25",
    b6_info:"피리독살포스페이트(활성) 10",
    b12_info:"메코발라민(활성) 500mcg",
    b3:50,  b5:100, b7:0.1,  b9:0.5,
    udca:15,  mg:60.3, vitD:1000, zn:15,
    others:["콜린 50mg","이노시톨 50mg"],
    features:["활성 B12(메코발라민)","뇌기능 활성화(콜린)"],
    target:"수험생 / 머리 많이 쓰는 직장인",
    warning:"B2/B6 함량 상대적 낮음" },
  { id:9,  name:"임팩타민 프리미엄 원스", maker:"대웅제약",  dailyDose:"1일 1정",
    b1_info:"벤포티아민 120", b1_total:120,
    b2_info:"리보플라빈 50",
    b6_info:"피리독신 50",
    b12_info:"시아노코발라민 500mcg",
    b3:50,  b5:50,  b7:0.25, b9:0.4,
    udca:15,  mg:0,   vitD:1000, zn:24.1,
    others:["비타민C 250mg","비타민E 10IU","셀레늄 25mcg"],
    features:["호모시스테인 케어","항산화 강화"],
    target:"피로회복 + 혈관/면역 관리",
    warning:"마그네슘 없음" },
  { id:10, name:"투엑스비 듀얼",          maker:"제일헬스",  dailyDose:"1일 1정",
    b1_info:"벤포 80 + 푸르설 20", b1_total:100,
    b2_info:"리보플라빈 100",
    b6_info:"피리독신 100",
    b12_info:"시아노코발라민 1000mcg",
    b3:20,  b5:100, b7:0.1,  b9:0.5,
    udca:30,  mg:30,  vitD:1000, zn:24.1,
    others:["감마오리자놀"],
    features:["벤포+푸르설 듀얼배합","가성비"],
    target:"육체피로 + 뇌피로 동시 공략",
    warning:"푸르설티아민 냄새 미약하게 남" },
  { id:11, name:"액티넘 EX 골드",         maker:"다케다",    dailyDose:"1일 3정(최대)",
    b1_info:"푸르설티아민 100 (활성)", b1_total:100,
    b2_info:"미함유",
    b6_info:"피리독살포스페이트(활성) 60",
    b12_info:"메코발라민(활성) 1500mcg",
    b3:0,   b5:0,   b7:0,    b9:1,
    udca:0,   mg:0,   vitD:0,   zn:0,
    others:["비타민E 100mg","감마오리자놀 10mg"],
    features:["신경비타민 특화","알약 작음"],
    target:"심한 신경통/손발저림 + 눈의 피로",
    warning:"종합영양제로는 부족함" },
  { id:12, name:"아로나민 골드",           maker:"일동제약",  dailyDose:"1일 2정",
    b1_info:"푸르설티아민 100", b1_total:100,
    b2_info:"리보플라빈부티레이트(활성) 5",
    b6_info:"피리독살포스페이트(활성) 5",
    b12_info:"히드록소코발라민(활성) 10.4mcg",
    b3:0,   b5:0,   b7:0,    b9:0,
    udca:0,   mg:0,   vitD:0,   zn:0,
    others:["비타민C 140mg","비타민E 40mg"],
    features:["활성비타민 4종","1일 2회 복용"],
    target:"가벼운 피로 + 빠른 효과 선호",
    warning:"함량 매우 낮음 / 가성비 낮음" },
  { id:13, name:"마그비 맥스",             maker:"유한양행",  dailyDose:"1일 2캡슐",
    b1_info:"벤포티아민 100", b1_total:100,
    b2_info:"리보플라빈 100",
    b6_info:"피리독신 100",
    b12_info:"시아노코발라민 1000mcg",
    b3:20,  b5:0,   b7:0,    b9:0,
    udca:0,   mg:420, vitD:0,   zn:0,
    others:["비타민E 1000IU (토코페롤)"],
    features:["마그네슘/Vit E 초고함량","혈행개선"],
    target:"근육경련(눈떨림) + 혈액순환",
    warning:"설사 부작용 주의 (Mg 고함량)" },
  { id:14, name:"엑세라민 프로",           maker:"일동제약",  dailyDose:"1일 1정",
    b1_info:"푸르설티아민 100", b1_total:100,
    b2_info:"리보플라빈 50",
    b6_info:"피리독신 50",
    b12_info:"시아노코발라민 1000mcg",
    b3:50,  b5:150, b7:0.5,  b9:0.4,
    udca:10,  mg:50,  vitD:1000, zn:50,
    others:["비오틴/판토텐산 고함량"],
    features:["푸르설티아민 100mg","대사 활성화"],
    target:"강한 육체활동 + 에너지 대사",
    warning:"특유의 마늘 냄새(푸르설)" },
  { id:15, name:"아로나민 씨플러스",        maker:"일동제약",  dailyDose:"1일 2정",
    b1_info:"푸르설티아민 50", b1_total:50,
    b2_info:"리보플라빈부티레이트 10",
    b6_info:"피리독신 10",
    b12_info:"시아노코발라민 12mcg",
    b3:100, b5:40,  b7:0.045,b9:0.5,
    udca:0,   mg:0,   vitD:0,   zn:15,
    others:["비타민C 1200mg","철분"],
    features:["항산화/멜라닌 케어","여성 타겟"],
    target:"기미/주근깨 + 가벼운 피로",
    warning:"위장장애(Vit C)" },
  { id:16, name:"글루콤",                  maker:"고려제약",  dailyDose:"1일 1병",
    b1_info:"미함유", b1_total:0,
    b2_info:"미함유",
    b6_info:"미함유",
    b12_info:"코바마미드(활성) 2500mcg",
    b3:0,   b5:0,   b7:0,    b9:0,
    udca:0,   mg:0,   vitD:0,   zn:0,
    others:["필수아미노산 7종","글루타민"],
    features:["액상 앰플","활성 B12 초고함량"],
    target:"수험생(기억력) + 단기 에너지 부스팅",
    warning:"B군 종합제 아님 (병용 권장)" },
];

// ── 헬퍼 함수 ──
export const isActive = (s: string) =>
  !!s && (s.includes('활성') || s.includes('메코') || s.includes('히드록소') ||
    s.includes('푸르설') || s.includes('비스') || s.includes('코바') || s.includes('부티레이트'));

export const isB12Active = (s: string) =>
  s.includes('메코') || s.includes('히드록소') || s.includes('코바마미드');

// ── 레이더 차트용 ──
const _maxB1   = Math.max(...vitaminData.map(v => v.b1_total));
const _maxUdca = Math.max(...vitaminData.map(v => v.udca));
const _maxMg   = Math.max(...vitaminData.map(v => v.mg));
const _maxZn   = Math.max(...vitaminData.map(v => v.zn));

export const RADAR_MAX = { b1: _maxB1, udca: _maxUdca, mg: _maxMg, zn: _maxZn };

export function getRadarValues(p: VitaminProduct): number[] {
  return [
    _maxB1   > 0 ? Math.round((p.b1_total / _maxB1)   * 100) : 0,
    isB12Active(p.b12_info) ? 100 : 40,
    _maxUdca > 0 ? Math.round((p.udca     / _maxUdca) * 100) : 0,
    _maxMg   > 0 ? Math.round((p.mg       / _maxMg)   * 100) : 0,
    _maxZn   > 0 ? Math.round((p.zn       / _maxZn)   * 100) : 0,
  ];
}

// ── 추천 시스템 ──
export type SymptomKey = 'fatigue' | 'neuro' | 'liver' | 'mouth' | 'brain' | 'muscle' | 'skin' | 'immune';

export const SYMPTOM_LABELS: Record<SymptomKey, string> = {
  fatigue: '극심한 육체피로',
  neuro:   '신경통·손발저림',
  liver:   '잦은 음주·간피로',
  mouth:   '구내염·입병 재발',
  brain:   '뇌피로·집중력',
  muscle:  '근육경련·눈떨림',
  skin:    '기미·피부 트러블',
  immune:  '혈행·면역 관리',
};

export const PRESETS: Record<string, SymptomKey[]> = {
  '음주 잦은 직장인': ['fatigue', 'liver'],
  '수험생·뇌피로':   ['brain', 'fatigue'],
  '심한 신경통':     ['neuro', 'fatigue'],
  '여성·항산화':     ['skin', 'immune'],
  '근육경련·눈떨림': ['muscle', 'fatigue'],
  '입문·가성비':     ['fatigue'],
};

type WeightMap = Partial<Record<string, number>>;

const symptomWeights: Record<SymptomKey, WeightMap> = {
  fatigue: { b1_total: 3, b3: 1, b5: 1 },
  neuro:   { b12_active: 3, b1_total: 2, b6_active: 1 },
  liver:   { udca: 3, b1_total: 2, b5: 1 },
  mouth:   { b2_active: 3, b6_active: 2, b9: 1 },
  brain:   { b1_bbb: 3, b12_active: 2, b3: 1 },
  muscle:  { mg: 3, b1_total: 1 },
  skin:    { b2_active: 2, b9: 2, zn: 2 },
  immune:  { vitD: 2, zn: 3, b9: 1 },
};

function getDerived(p: VitaminProduct): Record<string, number> {
  const b6Active = p.b6_info.includes('피리독살포스페이트') || p.b6_info.includes('활성');
  const b2Active = p.b2_info.includes('부티레이트') || p.b2_info.includes('활성');
  const b1Bbb   = (p.b1_info.includes('비스벤') || p.b1_info.includes('푸르설')) ? p.b1_total : 0;
  return {
    b1_total:   p.b1_total,
    b3:         p.b3,
    b5:         p.b5,
    b9:         p.b9,
    udca:       p.udca,
    mg:         p.mg,
    zn:         p.zn,
    vitD:       p.vitD,
    b12_active: isB12Active(p.b12_info) ? 1 : 0,
    b6_active:  b6Active ? 1 : 0,
    b2_active:  b2Active ? 1 : 0,
    b1_bbb:     b1Bbb,
  };
}

const _derivedKeys = ['b1_total','b3','b5','b9','udca','mg','zn','vitD','b12_active','b6_active','b2_active','b1_bbb'];
const _scoreMax: Record<string, number> = Object.fromEntries(
  _derivedKeys.map(k => [k, Math.max(...vitaminData.map(p => getDerived(p)[k] ?? 0), 1)])
);

export function scoreProduct(product: VitaminProduct, symptoms: SymptomKey[]): number {
  if (symptoms.length === 0) return 0;
  const derived = getDerived(product);
  let raw = 0, maxPossible = 0;
  for (const sym of symptoms) {
    for (const [key, w] of Object.entries(symptomWeights[sym])) {
      const val = derived[key] ?? 0;
      raw += (val / _scoreMax[key]) * (w ?? 0);
      maxPossible += (w ?? 0);
    }
  }
  return maxPossible > 0 ? Math.round((raw / maxPossible) * 100) : 0;
}

export function getReasons(product: VitaminProduct, symptoms: SymptomKey[]): string[] {
  const derived = getDerived(product);
  const reasons: string[] = [];
  const seen = new Set<string>();

  for (const sym of symptoms) {
    const sorted = Object.entries(symptomWeights[sym]).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));
    for (const [key] of sorted) {
      if (seen.has(key)) continue;
      const val = derived[key] ?? 0;
      if (val === 0) continue;
      const rank = vitaminData
        .map(p => getDerived(p)[key] ?? 0)
        .sort((a, b) => b - a)
        .indexOf(val);
      if (rank < 3) {
        seen.add(key);
        const labels: Record<string, string> = {
          b1_total: `B1 ${val}mg`, udca: `UDCA ${val}mg`, mg: `마그네슘 ${val}mg`,
          zn: `아연 ${val}mg`, vitD: `비타민D ${val}IU`, b3: `B3 ${val}mg`,
          b5: `B5 ${val}mg`, b9: `엽산 ${val}mg`, b12_active: '활성형 B12',
          b6_active: '활성형 B6', b2_active: '활성형 B2', b1_bbb: `뇌이행 B1 ${val}mg`,
        };
        reasons.push(labels[key] ?? key);
        if (reasons.length >= 3) return reasons;
      }
    }
  }
  return reasons;
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공, 타입 에러 없음. (VitaminComparator.tsx가 아직 data.ts를 import하지 않으므로 경고 없음)

- [ ] **Step 4: Commit**

```bash
git add src/data.ts package.json package-lock.json
git commit -m "feat: extract data.ts with symptom scoring and radar chart helpers"
```

---

### Task 2: index.css 화이트 테마 + VitaminComparator.tsx 쉘 리라이트

**Files:**
- Modify: `src/index.css`
- Rewrite: `src/VitaminComparator.tsx`

**Interfaces:**
- Consumes: `vitaminData`, `VitaminProduct`, `SymptomKey` from `./data`
- Produces: `<VitaminComparator />` — 탭 라우팅 쉘, `p1Id`/`p2Id`/`activeTab` state를 props로 하위 탭에 전달

- [ ] **Step 1: index.css 업데이트**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background-color: #F8F9FC; color: #111827; }
```

- [ ] **Step 2: VitaminComparator.tsx 전체 교체**

```tsx
// src/VitaminComparator.tsx
import React, { useState, useEffect } from 'react';
import { FlaskConical, Check, Copy, CheckCheck, ArrowLeftRight, LayoutGrid, Sparkles } from 'lucide-react';
import { vitaminData } from './data';
import CompareTab from './CompareTab';
import FullTable from './FullTable';
import RecommendTab from './RecommendTab';

type Tab = 'compare' | 'table' | 'recommend';

const VitaminComparator = () => {
  const [p1Id, setP1Id] = useState(1);
  const [p2Id, setP2Id] = useState(3);
  const [activeTab, setActiveTab] = useState<Tab>('compare');
  const [copied, setCopied] = useState(false);

  // URL → state on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = Number(params.get('a'));
    const b = Number(params.get('b'));
    if (a && vitaminData.find(v => v.id === a)) setP1Id(a);
    if (b && vitaminData.find(v => v.id === b)) setP2Id(b);
  }, []);

  // state → URL on change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('a', String(p1Id));
    params.set('b', String(p2Id));
    window.history.replaceState({}, '', `?${params}`);
  }, [p1Id, p2Id]);

  const p1 = vitaminData.find(v => v.id === p1Id)!;
  const p2 = vitaminData.find(v => v.id === p2Id)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTableSelect = (id: number) => {
    if (id !== p1Id && id !== p2Id) setP2Id(id);
    setActiveTab('compare');
  };

  const handleRecommendSelect = (id: number, slot: 'a' | 'b') => {
    if (slot === 'a') setP1Id(id);
    else setP2Id(id);
    setActiveTab('compare');
  };

  const TAB_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'compare',   label: '1:1 비교',   icon: <ArrowLeftRight size={13} /> },
    { key: 'table',     label: '전체 테이블', icon: <LayoutGrid size={13} /> },
    { key: 'recommend', label: '추천',        icon: <Sparkles size={13} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#111827] font-sans pb-16 max-w-lg mx-auto">

      {/* Header */}
      <header className="px-4 pt-5 pb-2 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FlaskConical className="text-blue-600" size={20} />
          <h1 className="text-base font-bold tracking-tight text-[#111827]">
            Vitamin Pro Analysis
          </h1>
        </div>
        <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
          <Check size={9} className="text-green-500" />
          <span>약학정보원 직접 검증 · 1일 복용량 기준 v4.5</span>
        </div>
      </header>

      {/* Sticky nav */}
      <div className="sticky top-0 z-30 bg-[#F8F9FC]/95 backdrop-blur-sm border-b border-[#E8EAF0]">

        {/* Tab bar */}
        <div className="flex items-center px-3 pt-1">
          {TAB_ITEMS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === t.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 mb-1 rounded-lg text-[10px] text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-[#E8EAF0]"
          >
            {copied ? <CheckCheck size={11} className="text-green-500" /> : <Copy size={11} />}
            {copied ? '복사됨' : '링크'}
          </button>
        </div>

        {/* Product selectors — compare tab only */}
        {activeTab === 'compare' && (
          <div className="px-3 pb-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-xl p-2.5 border border-[#E8EAF0] border-l-2 border-l-blue-500">
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">제품 A</p>
                <select
                  className="w-full bg-transparent text-blue-700 text-xs font-semibold outline-none"
                  value={p1Id}
                  onChange={e => setP1Id(Number(e.target.value))}
                >
                  {vitaminData.map(v => (
                    <option key={v.id} value={v.id} disabled={v.id === p2Id} className="text-gray-800">{v.name}</option>
                  ))}
                </select>
                <p className="text-[9px] text-gray-400 mt-0.5">{p1.maker} · {p1.dailyDose}</p>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-[#E8EAF0] border-l-2 border-l-amber-500">
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1">제품 B</p>
                <select
                  className="w-full bg-transparent text-amber-700 text-xs font-semibold outline-none"
                  value={p2Id}
                  onChange={e => setP2Id(Number(e.target.value))}
                >
                  {vitaminData.map(v => (
                    <option key={v.id} value={v.id} disabled={v.id === p1Id} className="text-gray-800">{v.name}</option>
                  ))}
                </select>
                <p className="text-[9px] text-gray-400 mt-0.5">{p2.maker} · {p2.dailyDose}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab content */}
      {activeTab === 'compare'   && <CompareTab p1={p1} p2={p2} />}
      {activeTab === 'table'     && <FullTable onSelect={handleTableSelect} />}
      {activeTab === 'recommend' && <RecommendTab onSelect={handleRecommendSelect} />}
    </div>
  );
};

export default VitaminComparator;
```

- [ ] **Step 3: 임시 stub 파일 생성 (빌드 통과용)**

CompareTab.tsx, FullTable.tsx, RecommendTab.tsx가 없으면 빌드 실패. 빈 stub 먼저 생성:

```tsx
// src/CompareTab.tsx  (임시)
import { VitaminProduct } from './data';
export default function CompareTab({ p1, p2 }: { p1: VitaminProduct; p2: VitaminProduct }) {
  return <div className="p-4 text-gray-400">CompareTab WIP — {p1.name} vs {p2.name}</div>;
}
```

```tsx
// src/FullTable.tsx  (임시)
export default function FullTable({ onSelect }: { onSelect: (id: number) => void }) {
  return <div className="p-4 text-gray-400">FullTable WIP</div>;
}
```

```tsx
// src/RecommendTab.tsx  (임시)
export default function RecommendTab({ onSelect }: { onSelect: (id: number, slot: 'a' | 'b') => void }) {
  return <div className="p-4 text-gray-400">RecommendTab WIP</div>;
}
```

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/VitaminComparator.tsx src/CompareTab.tsx src/FullTable.tsx src/RecommendTab.tsx
git commit -m "feat: white theme shell + stub tab components"
```

---

### Task 3: CompareTab.tsx — 레이더 차트 + 2컬럼 비교 테이블

**Files:**
- Rewrite: `src/CompareTab.tsx`

**Interfaces:**
- Consumes: `VitaminProduct`, `vitaminData`, `isActive`, `isB12Active`, `getRadarValues` from `./data`
- Props: `{ p1: VitaminProduct; p2: VitaminProduct }`
- Produces: visible radar chart + 2-column ingredient table

- [ ] **Step 1: Chart.js 등록 + CompareTab 전체 작성**

```tsx
// src/CompareTab.tsx
import React, { useEffect, useRef } from 'react';
import {
  Chart, RadarController, LineElement, PointElement,
  RadialLinearScale, Filler, Legend, Tooltip,
} from 'chart.js';
import {
  ChevronDown, ChevronUp, Info, Zap, Shield, BookOpen, AlertTriangle,
} from 'lucide-react';
import { VitaminProduct, vitaminData, isActive, isB12Active, getRadarValues } from './data';

Chart.register(RadarController, LineElement, PointElement, RadialLinearScale, Filler, Legend, Tooltip);

// ── 약학 설명 가이드 ──
const guides: Record<string, React.ReactNode> = {
  b1: (
    <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg leading-relaxed border border-blue-100">
      <p className="mb-1"><span className="text-blue-600 font-semibold">💊 벤포티아민:</span> 수용성 티아민 대비 생체이용률 4~8배, 체내 농도 오래 유지 → 육체 피로에 탁월.</p>
      <p><span className="text-blue-600 font-semibold">🧠 푸르설/비스벤티아민:</span> 뇌혈관장벽(BBB) 통과 → 뇌내 티아민 농도 높여 정신 피로·신경통에 유리.</p>
    </div>
  ),
  b2: (
    <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg leading-relaxed border border-blue-100">
      <p><span className="text-blue-600 font-semibold">✨ 리보플라빈부티레이트(활성):</span> 일반형보다 체내 체류 시간 길어 구내염·설염 재발에 더 효과적.</p>
    </div>
  ),
  b6: (
    <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg leading-relaxed border border-blue-100">
      <p><span className="text-blue-600 font-semibold">⚡ 피리독살포스페이트(활성):</span> 간 대사 없이 즉시 이용. 신경전달물질 생성 관여, 고용량 신경 독성 부작용 감소.</p>
    </div>
  ),
  b12: (
    <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg leading-relaxed border border-blue-100 space-y-1">
      <p><span className="text-red-500 font-semibold">🩸 메코발라민(활성):</span> 말초신경 복구, 손발저림 완화 최강.</p>
      <p><span className="text-purple-500 font-semibold">⚡ 코바마미드(활성):</span> 미토콘드리아 ATP 생성 → 근육·뇌 에너지.</p>
      <p><span className="text-gray-400 font-semibold">🛡️ 시아노코발라민:</span> 안정성 높고 저렴하나 체내 대사 후 활성화.</p>
    </div>
  ),
  udca: (
    <div className="mt-2 text-xs text-gray-500 bg-green-50 p-3 rounded-lg leading-relaxed border border-green-100">
      <p><span className="text-green-600 font-semibold">🛡️ UDCA:</span> 담즙 분비 촉진 → 간 독소·노폐물 배출. 피로회복제와 병용 시 대사+해독 시너지.</p>
    </div>
  ),
  mg: (
    <div className="mt-2 text-xs text-gray-500 bg-green-50 p-3 rounded-lg leading-relaxed border border-green-100 space-y-1">
      <p><span className="text-green-600 font-semibold">🧬 산화마그네슘:</span> 함량 높으나 흡수율 낮고 설사 유발 가능.</p>
      <p><span className="text-green-600 font-semibold">💧 유기염 마그네슘:</span> 글리세로인산/아스파르트산 등 흡수 빠르고 위장장애 적음.</p>
    </div>
  ),
};

// ── 공통 컴포넌트 ──
const ActiveBadge = ({ s }: { s: string }) =>
  isActive(s) ? (
    <span className="ml-1 text-[9px] bg-cyan-50 text-cyan-600 px-1.5 py-0.5 rounded-full border border-cyan-200">Active</span>
  ) : null;

type RowProps = {
  label: string;
  sub: string;
  guideKey?: string;
  expanded: string | null;
  onToggle: (k: string) => void;
  // numeric mode
  v1?: number; v2?: number; unit?: string;
  // text mode
  isText?: boolean; t1?: string; t2?: string;
};

const BLUE  = '#2563EB';
const AMBER = '#D97706';
const MAX_VALS: Record<string, number> = {
  b1_total: Math.max(...vitaminData.map(v => v.b1_total)),
  b3:       Math.max(...vitaminData.map(v => v.b3)),
  b5:       Math.max(...vitaminData.map(v => v.b5)),
  b7:       Math.max(...vitaminData.map(v => v.b7)),
  b9:       Math.max(...vitaminData.map(v => v.b9)),
  udca:     Math.max(...vitaminData.map(v => v.udca)),
  mg:       Math.max(...vitaminData.map(v => v.mg)),
  zn:       Math.max(...vitaminData.map(v => v.zn)),
  vitD:     Math.max(...vitaminData.map(v => v.vitD)),
};

function MiniBar({ val, maxVal, color }: { val: number; maxVal: number; color: string }) {
  const pct = maxVal > 0 ? Math.min((val / maxVal) * 100, 100) : 0;
  return (
    <div className="h-1 bg-gray-100 rounded-full mt-1">
      <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function CompareRow({ label, sub, guideKey, expanded, onToggle, v1, v2, unit, isText, t1 = '', t2 = '' }: RowProps) {
  const hasGuide = !!guideKey;
  const maxV = Math.max(v1 ?? 0, v2 ?? 0);
  return (
    <div className="border-b border-[#E8EAF0] last:border-0">
      {/* Header row: label | A col | B col */}
      <button
        onClick={() => hasGuide && onToggle(guideKey!)}
        className={`w-full grid border-b border-[#F1F5F9] ${hasGuide ? 'cursor-pointer' : 'cursor-default'}`}
        style={{ gridTemplateColumns: '90px 1fr 1fr' }}
      >
        <div className="px-3 py-2.5 bg-[#F8F9FC] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#111827] leading-tight">{label}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{sub}</p>
          </div>
          {hasGuide && (expanded === guideKey
            ? <ChevronUp size={12} className="text-gray-300 flex-shrink-0" />
            : <ChevronDown size={12} className="text-gray-300 flex-shrink-0" />
          )}
        </div>
        {/* A cell */}
        {isText ? (
          <div className="px-2 py-2.5 text-center border-l border-[#E8EAF0]">
            <p className={`text-[10px] leading-tight ${isActive(t1) ? 'text-blue-700' : 'text-gray-400'}`}>
              {t1 || '—'}<ActiveBadge s={t1} />
            </p>
          </div>
        ) : (
          <div className="px-3 py-2.5 border-l border-[#E8EAF0]">
            <p className="text-sm font-semibold" style={{ color: (v1 ?? 0) >= (v2 ?? 0) && (v1 ?? 0) > 0 ? BLUE : '#9CA3AF' }}>
              {(v1 ?? 0) > 0 ? `${v1}` : '—'}
              {(v1 ?? 0) > 0 && <span className="text-[9px] font-normal text-gray-400 ml-0.5">{unit}</span>}
              {(v1 ?? 0) > (v2 ?? 0) && (v1 ?? 0) > 0 && <span className="text-[10px] ml-0.5" style={{ color: BLUE }}> ↑</span>}
            </p>
            {(v1 ?? 0) > 0 && <MiniBar val={v1 ?? 0} maxVal={maxV} color={BLUE} />}
          </div>
        )}
        {/* B cell */}
        {isText ? (
          <div className="px-2 py-2.5 text-center border-l border-[#E8EAF0]">
            <p className={`text-[10px] leading-tight ${isActive(t2) ? 'text-amber-700' : 'text-gray-400'}`}>
              {t2 || '—'}<ActiveBadge s={t2} />
            </p>
          </div>
        ) : (
          <div className="px-3 py-2.5 border-l border-[#E8EAF0]">
            <p className="text-sm font-semibold" style={{ color: (v2 ?? 0) >= (v1 ?? 0) && (v2 ?? 0) > 0 ? AMBER : '#9CA3AF' }}>
              {(v2 ?? 0) > 0 ? `${v2}` : '—'}
              {(v2 ?? 0) > 0 && <span className="text-[9px] font-normal text-gray-400 ml-0.5">{unit}</span>}
              {(v2 ?? 0) > (v1 ?? 0) && (v2 ?? 0) > 0 && <span className="text-[10px] ml-0.5" style={{ color: AMBER }}> ↑</span>}
            </p>
            {(v2 ?? 0) > 0 && <MiniBar val={v2 ?? 0} maxVal={maxV} color={AMBER} />}
          </div>
        )}
      </button>
      {/* Guide expansion */}
      {hasGuide && expanded === guideKey && (
        <div className="px-3 pb-2 col-span-3">{guides[guideKey]}</div>
      )}
    </div>
  );
}

// ── MAIN ──
export default function CompareTab({ p1, p2 }: { p1: VitaminProduct; p2: VitaminProduct }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (k: string) => setExpanded(prev => prev === k ? null : k);

  // Radar chart
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const d1 = getRadarValues(p1);
    const d2 = getRadarValues(p2);

    if (chartRef.current) {
      chartRef.current.data.datasets[0].data  = d1;
      chartRef.current.data.datasets[0].label = p1.name;
      chartRef.current.data.datasets[1].data  = d2;
      chartRef.current.data.datasets[1].label = p2.name;
      chartRef.current.update('active');
      return;
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels: ['B1 총량', 'B12 강도', 'UDCA', '마그네슘', '아연'],
        datasets: [
          {
            label: p1.name,
            data: d1,
            backgroundColor: 'rgba(37,99,235,0.12)',
            borderColor: BLUE,
            pointBackgroundColor: BLUE,
            borderWidth: 2,
            pointRadius: 3,
          },
          {
            label: p2.name,
            data: d2,
            backgroundColor: 'rgba(217,119,6,0.12)',
            borderColor: AMBER,
            pointBackgroundColor: AMBER,
            borderWidth: 2,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { display: false },
            grid: { color: '#E8EAF0' },
            angleLines: { color: '#E8EAF0' },
            pointLabels: { font: { size: 10 }, color: '#6B7280' },
          },
        },
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 10 }, color: '#111827', boxWidth: 12, padding: 12 } },
          tooltip: { enabled: true },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [p1, p2]);

  // B12 chip helper
  const B12Chip = ({ active }: { active: boolean }) => (
    <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full border font-semibold ${
      active ? 'bg-cyan-50 text-cyan-600 border-cyan-200' : 'bg-gray-50 text-gray-400 border-gray-200'
    }`}>
      {active ? '✓ 활성형' : '일반형'}
    </span>
  );

  // Column header row
  const ColHeader = () => (
    <div className="grid border-b border-[#E8EAF0] bg-[#F1F5F9]" style={{ gridTemplateColumns: '90px 1fr 1fr' }}>
      <div className="px-3 py-1.5 text-[9px] font-semibold text-gray-400 uppercase tracking-wider">성분</div>
      <div className="px-3 py-1.5 text-[9px] font-bold text-blue-600 text-center border-l border-[#E8EAF0]">
        A — {p1.name}
      </div>
      <div className="px-3 py-1.5 text-[9px] font-bold text-amber-600 text-center border-l border-[#E8EAF0]">
        B — {p2.name}
      </div>
    </div>
  );

  return (
    <div className="pb-4">

      {/* Radar chart */}
      <div className="mx-3 mt-3 bg-white rounded-2xl border border-[#E8EAF0] p-3">
        <p className="text-[10px] font-semibold text-gray-400 text-center mb-2 uppercase tracking-wider">종합 강점 비교</p>
        <div style={{ height: 220 }}>
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Vital B-Complex */}
      <div className="mx-3 mt-3 bg-white rounded-2xl border border-[#E8EAF0] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F8F9FC] border-b border-[#E8EAF0]">
          <Zap size={14} className="text-amber-500" />
          <span className="text-xs font-bold text-[#111827]">Vital B-Complex</span>
          <span className="text-[10px] text-gray-400">피로회복 & 신경계 핵심</span>
        </div>
        <ColHeader />

        {/* B1 row — custom (text + bar combined) */}
        <div className="border-b border-[#E8EAF0]">
          <button onClick={() => toggle('b1')} className="w-full grid" style={{ gridTemplateColumns: '90px 1fr 1fr' }}>
            <div className="px-3 py-2.5 bg-[#F8F9FC] flex items-center justify-between border-b border-[#F1F5F9]">
              <div>
                <p className="text-xs font-semibold text-[#111827]">B1 티아민</p>
                <p className="text-[9px] text-gray-400 mt-0.5">에너지 대사</p>
              </div>
              {expanded === 'b1' ? <ChevronUp size={12} className="text-gray-300" /> : <ChevronDown size={12} className="text-gray-300" />}
            </div>
            <div className="px-3 py-2.5 border-l border-[#E8EAF0] border-b border-[#F1F5F9]">
              <p className={`text-[10px] leading-tight ${isActive(p1.b1_info) ? 'text-blue-700' : 'text-gray-400'}`}>
                {p1.b1_info}<ActiveBadge s={p1.b1_info} />
              </p>
              <p className="text-sm font-semibold mt-1" style={{ color: p1.b1_total >= p2.b1_total ? BLUE : '#9CA3AF' }}>
                {p1.b1_total}mg{p1.b1_total > p2.b1_total && <span className="text-[10px] ml-0.5" style={{ color: BLUE }}> ↑</span>}
              </p>
              <MiniBar val={p1.b1_total} maxVal={Math.max(p1.b1_total, p2.b1_total)} color={BLUE} />
            </div>
            <div className="px-3 py-2.5 border-l border-[#E8EAF0] border-b border-[#F1F5F9]">
              <p className={`text-[10px] leading-tight ${isActive(p2.b1_info) ? 'text-amber-700' : 'text-gray-400'}`}>
                {p2.b1_info}<ActiveBadge s={p2.b1_info} />
              </p>
              <p className="text-sm font-semibold mt-1" style={{ color: p2.b1_total >= p1.b1_total ? AMBER : '#9CA3AF' }}>
                {p2.b1_total}mg{p2.b1_total > p1.b1_total && <span className="text-[10px] ml-0.5" style={{ color: AMBER }}> ↑</span>}
              </p>
              <MiniBar val={p2.b1_total} maxVal={Math.max(p1.b1_total, p2.b1_total)} color={AMBER} />
            </div>
          </button>
          {expanded === 'b1' && <div className="px-3 pb-2">{guides.b1}</div>}
        </div>

        {/* B12 row */}
        <div className="border-b border-[#E8EAF0]">
          <button onClick={() => toggle('b12')} className="w-full grid" style={{ gridTemplateColumns: '90px 1fr 1fr' }}>
            <div className="px-3 py-2.5 bg-[#F8F9FC] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#111827]">B12 코발라민</p>
                <p className="text-[9px] text-gray-400 mt-0.5">신경통·손발저림</p>
              </div>
              {expanded === 'b12' ? <ChevronUp size={12} className="text-gray-300" /> : <ChevronDown size={12} className="text-gray-300" />}
            </div>
            <div className="px-3 py-2.5 border-l border-[#E8EAF0] space-y-1">
              <p className={`text-[10px] leading-tight ${isB12Active(p1.b12_info) ? 'text-blue-700' : 'text-gray-400'}`}>{p1.b12_info}</p>
              <B12Chip active={isB12Active(p1.b12_info)} />
            </div>
            <div className="px-3 py-2.5 border-l border-[#E8EAF0] space-y-1">
              <p className={`text-[10px] leading-tight ${isB12Active(p2.b12_info) ? 'text-amber-700' : 'text-gray-400'}`}>{p2.b12_info}</p>
              <B12Chip active={isB12Active(p2.b12_info)} />
            </div>
          </button>
          {expanded === 'b12' && <div className="px-3 pb-2">{guides.b12}</div>}
        </div>

        <CompareRow label="B2 리보플라빈" sub="구내염·입병" guideKey="b2" expanded={expanded} onToggle={toggle} isText t1={p1.b2_info} t2={p2.b2_info} />
        <CompareRow label="B6 피리독신"  sub="신경염·호모시스테인" guideKey="b6" expanded={expanded} onToggle={toggle} isText t1={p1.b6_info} t2={p2.b6_info} />
      </div>

      {/* Support B */}
      <div className="mx-3 mt-3 bg-white rounded-2xl border border-[#E8EAF0] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F8F9FC] border-b border-[#E8EAF0]">
          <BookOpen size={14} className="text-purple-500" />
          <span className="text-xs font-bold text-[#111827]">Support B-Complex</span>
          <span className="text-[10px] text-gray-400">대사 보조</span>
        </div>
        <ColHeader />
        <CompareRow label="B3 니코틴산" sub="혈관 확장" expanded={expanded} onToggle={toggle} v1={p1.b3} v2={p2.b3} unit="mg" />
        <CompareRow label="B5 판토텐산" sub="부신·스트레스" expanded={expanded} onToggle={toggle} v1={p1.b5} v2={p2.b5} unit="mg" />
        <CompareRow label="B7 비오틴"   sub="모발·혈당" expanded={expanded} onToggle={toggle} v1={p1.b7} v2={p2.b7} unit="mg" />
        <CompareRow label="B9 폴산"     sub="세포분열·빈혈" expanded={expanded} onToggle={toggle} v1={p1.b9} v2={p2.b9} unit="mg" />
      </div>

      {/* Organ Support */}
      <div className="mx-3 mt-3 bg-white rounded-2xl border border-[#E8EAF0] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F8F9FC] border-b border-[#E8EAF0]">
          <Shield size={14} className="text-emerald-500" />
          <span className="text-xs font-bold text-[#111827]">Organ Support</span>
          <span className="text-[10px] text-gray-400">간·근육·면역</span>
        </div>
        <ColHeader />
        <CompareRow label="UDCA" sub="간 기능 보조" guideKey="udca" expanded={expanded} onToggle={toggle} v1={p1.udca} v2={p2.udca} unit="mg" />
        <CompareRow label="마그네슘"  sub="근육 이완·눈떨림" guideKey="mg" expanded={expanded} onToggle={toggle} v1={p1.mg}  v2={p2.mg}  unit="mg" />
        <CompareRow label="아연"     sub="면역·남성 활력" expanded={expanded} onToggle={toggle} v1={p1.zn}  v2={p2.zn}  unit="mg" />
        <CompareRow label="비타민D"  sub="뼈 건강·면역" expanded={expanded} onToggle={toggle} v1={p1.vitD} v2={p2.vitD} unit="IU" />
      </div>

      {/* Pharmacist Note */}
      <div className="mx-3 mt-3 bg-white rounded-2xl border border-[#E8EAF0] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F8F9FC] border-b border-[#E8EAF0]">
          <Info size={14} className="text-indigo-500" />
          <span className="text-xs font-bold text-[#111827]">Pharmacist's Note</span>
        </div>
        <div className="p-3 space-y-2 text-xs text-gray-500">
          <div className="bg-[#F8F9FC] rounded-lg p-3">
            <p className="font-semibold text-gray-700 mb-1">💡 B1 & B12</p>
            <p>
              {p1.b1_total !== p2.b1_total
                ? `B1 총량: ${p1.b1_total > p2.b1_total ? p1.name : p2.name}이 ${Math.abs(p1.b1_total - p2.b1_total)}mg 더 높습니다. `
                : '두 제품의 B1 총량이 동일합니다. '}
              {isB12Active(p1.b12_info) && !isB12Active(p2.b12_info)
                ? `${p1.name}은 활성형 B12로 신경병증에 더 유리합니다.`
                : !isB12Active(p1.b12_info) && isB12Active(p2.b12_info)
                ? `${p2.name}은 활성형 B12로 신경병증에 더 유리합니다.`
                : isB12Active(p1.b12_info) && isB12Active(p2.b12_info)
                ? '두 제품 모두 활성형 B12입니다.'
                : '두 제품 모두 일반형 B12입니다.'}
            </p>
          </div>
          <div className="bg-[#F8F9FC] rounded-lg p-3">
            <p className="font-semibold text-gray-700 mb-1">🛡️ 장기 보호</p>
            <p>{p1.udca > 30 || p2.udca > 30
              ? `UDCA 고함량: ${p1.udca > p2.udca ? p1.name : p2.name} → 음주 잦거나 소화기 약한 분께 적합.`
              : 'UDCA 함량이 낮거나 없습니다.'}</p>
          </div>
          <div className="bg-[#F8F9FC] rounded-lg p-3">
            <p className="font-semibold text-gray-700 mb-1">✨ 기타 성분</p>
            <p><span className="text-blue-600">A</span> {p1.others.join(' · ')}</p>
            <p className="mt-0.5"><span className="text-amber-600">B</span> {p2.others.join(' · ')}</p>
          </div>
          <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg p-3">
            <AlertTriangle size={11} className="text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p><span className="text-blue-600 font-semibold">A 주의:</span> {p1.warning}</p>
              <p className="mt-0.5"><span className="text-amber-600 font-semibold">B 주의:</span> {p2.warning}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
```

주의: `useState`를 import하는 것을 잊지 마세요. 파일 상단에 이미 `import React, { useEffect, useRef } from 'react';` — `useState` 추가 필요:

```tsx
import React, { useState, useEffect, useRef } from 'react';
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공. (`FullTable`, `RecommendTab`은 아직 stub)

- [ ] **Step 3: Commit**

```bash
git add src/CompareTab.tsx
git commit -m "feat: CompareTab with radar chart and 2-column ingredient table"
```

---

### Task 4: FullTable.tsx — 화이트 테마 전체 테이블

**Files:**
- Rewrite: `src/FullTable.tsx`

**Interfaces:**
- Consumes: `vitaminData`, `isB12Active` from `./data`
- Props: `{ onSelect: (id: number) => void }`

- [ ] **Step 1: FullTable.tsx 작성**

```tsx
// src/FullTable.tsx
import React from 'react';
import { vitaminData, isB12Active } from './data';

type Props = { onSelect: (id: number) => void };

const cols: { key: string; label: string; unit: string; fn: (v: typeof vitaminData[0]) => number }[] = [
  { key: 'b1',   label: 'B1',   unit: 'mg', fn: v => v.b1_total },
  { key: 'b3',   label: 'B3',   unit: 'mg', fn: v => v.b3 },
  { key: 'b5',   label: 'B5',   unit: 'mg', fn: v => v.b5 },
  { key: 'b7',   label: 'B7',   unit: 'mg', fn: v => v.b7 },
  { key: 'b9',   label: 'B9',   unit: 'mg', fn: v => v.b9 },
  { key: 'udca', label: 'UDCA', unit: 'mg', fn: v => v.udca },
  { key: 'mg',   label: 'Mg',   unit: 'mg', fn: v => v.mg },
  { key: 'zn',   label: 'Zn',   unit: 'mg', fn: v => v.zn },
  { key: 'vitD', label: 'VitD', unit: 'IU', fn: v => v.vitD },
];

const maxVals = Object.fromEntries(
  cols.map(c => [c.key, Math.max(...vitaminData.map(c.fn))])
);

export default function FullTable({ onSelect }: Props) {
  return (
    <div className="mx-3 mt-3 mb-6">
      <p className="text-[10px] text-gray-400 mb-2 text-center">제품명 탭 → 1:1 비교로 이동 · ★ = 전체 최고값</p>
      <div className="overflow-x-auto rounded-2xl border border-[#E8EAF0] bg-white">
        <table className="text-[10px] border-collapse" style={{ minWidth: '640px', width: '100%' }}>
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="sticky left-0 z-10 bg-[#F1F5F9] px-3 py-2.5 text-left text-gray-500 font-semibold border-b border-[#E8EAF0] whitespace-nowrap" style={{ minWidth: '120px' }}>
                제품명
              </th>
              {cols.map(c => (
                <th key={c.key} className="px-2 py-2.5 text-center text-gray-500 font-semibold border-b border-[#E8EAF0] whitespace-nowrap">
                  <div>{c.label}</div>
                  <div className="text-gray-300 font-normal text-[8px]">{c.unit}</div>
                </th>
              ))}
              <th className="px-2 py-2.5 text-center text-gray-500 font-semibold border-b border-[#E8EAF0] whitespace-nowrap">
                <div>B12</div>
                <div className="text-gray-300 font-normal text-[8px]">형태</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {vitaminData.map((v, idx) => (
              <tr key={v.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]'}>
                <td
                  className={`sticky left-0 z-10 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]'} px-3 py-2 border-r border-[#E8EAF0] cursor-pointer group`}
                  onClick={() => onSelect(v.id)}
                >
                  <div className="font-semibold text-[#111827] group-hover:text-blue-600 transition-colors whitespace-nowrap">{v.name}</div>
                  <div className="text-gray-400 text-[8px] mt-0.5">{v.maker}</div>
                </td>
                {cols.map(c => {
                  const val = c.fn(v);
                  const isTop = val > 0 && val === maxVals[c.key];
                  const pct = maxVals[c.key] > 0 ? (val / maxVals[c.key]) * 100 : 0;
                  return (
                    <td key={c.key} className="px-2 py-1.5 text-center">
                      {val > 0 ? (
                        <>
                          <div className={`font-mono ${isTop ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
                            {isTop && <span className="text-amber-500 mr-0.5">★</span>}{val}
                          </div>
                          <div className="mt-0.5 h-0.5 bg-gray-100 rounded-full mx-1">
                            <div className={`h-0.5 rounded-full ${isTop ? 'bg-amber-400' : 'bg-gray-300'}`} style={{ width: `${pct}%` }} />
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-200">—</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-2 py-1.5 text-center">
                  {isB12Active(v.b12_info) ? (
                    <span className="inline-block text-[8px] bg-cyan-50 text-cyan-600 px-1.5 py-0.5 rounded-full border border-cyan-200">활성</span>
                  ) : (
                    <span className="text-gray-300 text-[8px]">일반</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공.

- [ ] **Step 3: Commit**

```bash
git add src/FullTable.tsx
git commit -m "feat: FullTable with white theme"
```

---

### Task 5: RecommendTab.tsx — 프리셋 + 체크박스 + 추천 결과

**Files:**
- Rewrite: `src/RecommendTab.tsx`

**Interfaces:**
- Consumes: `vitaminData`, `SymptomKey`, `SYMPTOM_LABELS`, `PRESETS`, `scoreProduct`, `getReasons` from `./data`
- Props: `{ onSelect: (id: number, slot: 'a' | 'b') => void }`

- [ ] **Step 1: RecommendTab.tsx 작성**

```tsx
// src/RecommendTab.tsx
import React, { useState } from 'react';
import { vitaminData, SymptomKey, SYMPTOM_LABELS, PRESETS, scoreProduct, getReasons } from './data';

type Props = { onSelect: (id: number, slot: 'a' | 'b') => void };

const RANK_COLORS = ['#F59E0B', '#9CA3AF', '#CD7F32'] as const; // gold, silver, bronze
const RANK_LABELS = ['1위', '2위', '3위'] as const;

export default function RecommendTab({ onSelect }: Props) {
  const [selected, setSelected] = useState<Set<SymptomKey>>(new Set());
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const toggleSymptom = (key: SymptomKey) => {
    setActivePreset(null);
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const applyPreset = (label: string) => {
    setActivePreset(label);
    setSelected(new Set(PRESETS[label]));
  };

  const symptoms = Array.from(selected);
  const results = symptoms.length === 0
    ? []
    : [...vitaminData]
        .map(v => ({ product: v, score: scoreProduct(v, symptoms), reasons: getReasons(v, symptoms) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

  return (
    <div className="px-3 pt-3 pb-6 space-y-4">

      {/* Preset buttons */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">대상별 빠른 선택</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(PRESETS).map(label => (
            <button
              key={label}
              onClick={() => applyPreset(label)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                activePreset === label
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-[#E8EAF0] hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Symptom checkboxes */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">세부 증상 선택</p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(SYMPTOM_LABELS) as [SymptomKey, string][]).map(([key, label]) => (
            <label
              key={key}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
                selected.has(key)
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-[#E8EAF0] text-gray-600 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selected.has(key)}
                onChange={() => toggleSymptom(key)}
                className="w-3.5 h-3.5 rounded accent-blue-600"
              />
              <span className="text-xs">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Results */}
      {symptoms.length === 0 ? (
        <div className="text-center py-8 text-gray-300">
          <p className="text-4xl mb-2">💊</p>
          <p className="text-sm">증상을 선택하면 맞는 제품을 추천해드립니다</p>
        </div>
      ) : (
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">추천 결과</p>
          <div className="space-y-3">
            {results.map(({ product, score, reasons }, idx) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#E8EAF0] p-3 overflow-hidden"
                style={{ borderLeftWidth: idx === 0 ? 3 : 1, borderLeftColor: idx === 0 ? '#2563EB' : '#E8EAF0' }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: RANK_COLORS[idx] }}
                    >
                      {RANK_LABELS[idx]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{product.name}</p>
                      <p className="text-[9px] text-gray-400">{product.maker} · {product.dailyDose}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-blue-600 flex-shrink-0">{score}점</span>
                </div>

                {/* Score bar */}
                <div className="h-1.5 bg-gray-100 rounded-full mb-2">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, backgroundColor: RANK_COLORS[idx] }}
                  />
                </div>

                {/* Reasons */}
                {reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {reasons.map((r, i) => (
                      <span key={i} className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {/* Compare buttons — 1위 카드에만 */}
                {idx === 0 && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => onSelect(product.id, 'a')}
                      className="flex-1 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      A로 비교
                    </button>
                    <button
                      onClick={() => onSelect(product.id, 'b')}
                      className="flex-1 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      B로 비교
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공, 경고 없음.

- [ ] **Step 3: Commit**

```bash
git add src/RecommendTab.tsx
git commit -m "feat: RecommendTab with preset + checkbox + scored results"
```

---

### Task 6: 최종 통합 검증 + 배포

**Files:**
- No new files. Verify all tabs work together.

- [ ] **Step 1: 최종 빌드**

```bash
npm run build
```

Expected: 빌드 성공. `dist/assets/index-*.js` 크기가 약 350~400KB (chart.js 추가로 이전보다 큼).

- [ ] **Step 2: 검증 체크리스트**

다음 항목을 `npm run dev` 후 브라우저에서 직접 확인:

- [ ] 1:1 비교 탭: 레이더 차트가 렌더링됨
- [ ] 제품 변경 시 레이더 차트 애니메이션 업데이트
- [ ] 2컬럼 테이블에서 ↑ 표시가 올바른 쪽에 나타남
- [ ] B12 활성형 chip 정상 표시
- [ ] 성분명 탭 → 약학 설명 펼침/접힘
- [ ] 전체 테이블 탭: 16개 제품 모두 표시, sticky 첫 컬럼
- [ ] 추천 탭: 프리셋 버튼 탭 → 체크박스 자동 선택 + 결과 표시
- [ ] 추천 탭: 체크박스 0개 선택 시 빈 화면 안내 메시지 표시
- [ ] "A로 비교" / "B로 비교" 버튼 → 1:1 비교 탭으로 이동
- [ ] URL `?a=2&b=5` 로 직접 접속 시 해당 제품 선택됨
- [ ] 링크 복사 버튼 → "복사됨" 상태로 2초 전환

- [ ] **Step 3: Netlify 배포**

```bash
netlify deploy --prod --dir dist
```

Expected 출력:
```
✓ Deploy is live!
Production URL: https://vitamin-pro-kr.netlify.app
```

- [ ] **Step 4: 최종 commit + push**

```bash
git add -A
git commit -m "feat: complete redesign — white theme, 2-col layout, radar chart, recommend tab"
git push origin master
```

---

## 검증 기준 (스펙 §10)

| 항목 | 완료 기준 |
|------|-----------|
| `npm run build` | 타입 에러 없음 |
| 모바일 375px | 2컬럼 레이아웃 깨짐 없음 |
| 레이더 차트 | 제품 전환 시 애니메이션 정상 |
| 추천 탭 0개 선택 | 안내 메시지 표시 |
| URL 복원 | `?a=N&b=N` 마운트 시 정상 선택 |
| 배포 | Netlify production 성공 |
