# Vitamin App Redesign — Design Spec
Date: 2026-06-27

## Goal
화이트 테마 전환 + 세로 2컬럼 비교 레이아웃 + 레이더 차트 + 증상 기반 추천 탭을 일괄 구현.

---

## 1. 파일 구조 (Approach B)

```
src/
  data.ts               ← vitaminData 배열 + symptom scoring 함수
  VitaminComparator.tsx ← 탭 state, URL sync, 탭 라우팅만
  CompareTab.tsx        ← 레이더 차트 + 세로 2컬럼 비교 + Pharmacist Note
  FullTable.tsx         ← 전체 16개 제품 가로 스크롤 테이블
  RecommendTab.tsx      ← 프리셋 버튼 + 체크박스 + 추천 결과 카드
```

---

## 2. 화이트 테마

| 역할 | 값 |
|------|----|
| 페이지 배경 | `#F8F9FC` |
| 카드 배경 | `#FFFFFF` |
| 카드 테두리 | `1px solid #E8EAF0` |
| 제품 A 컬러 | `#2563EB` (blue-600) |
| 제품 B 컬러 | `#D97706` (amber-600) |
| 활성형 뱃지 배경 | `#CFFAFE` / 텍스트 `#0891B2` |
| 텍스트 주 | `#111827` |
| 텍스트 보조 | `#6B7280` |
| 섹션 헤더 배경 | `#F1F5F9` |

---

## 3. VitaminComparator.tsx (메인 쉘)

**책임:**
- `p1Id`, `p2Id` state
- `activeTab: 'compare' | 'table' | 'recommend'` state
- URL sync (`?a=N&b=N`, mount 시 복원)
- 탭 네비게이션 UI (상단 고정)
- 제품 선택 셀렉터 (compare 탭일 때만 표시)
- 링크 복사 버튼

**탭 바:**
```
[1:1 비교]  [전체 테이블]  [추천]
```

---

## 4. data.ts

**내용:**
- `vitaminData` 배열 (16개 제품, 기존 그대로)
- `SymptomKey` 타입 (8종)
- `symptomWeights: Record<SymptomKey, Partial<Record<string, number>>>` — 각 증상별 성분 가중치 맵
- `scoreProduct(product, selectedSymptoms[])` → 0~100 점수 반환 함수

**증상 8종:**
```
fatigue         극심한 육체피로
neuro           신경통·손발저림
liver           잦은 음주·간피로
mouth           구내염·입병 재발
brain           뇌피로·집중력
muscle          근육경련·눈떨림
skin            기미·피부 트러블
immune          혈행·면역 관리
```

**가중치 예시:**
```ts
liver: { udca: 3, b1_total: 2, b5: 1 }
neuro: { b12_active: 3, b1_total: 2, b6_active: 1 }
muscle: { mg: 3, b1_total: 1 }
```
`b12_active`, `b6_active` 등 활성형 여부는 boolean → 점수 변환 후 가중치 곱산.

---

## 5. CompareTab.tsx

**레이아웃 (위→아래):**

### 5a. 레이더 차트
- Chart.js `radar` (CDN via `<script>` in index.html 또는 npm install chart.js)
- 5축: `B1총량`, `B12(활성=100/일반=40)`, `UDCA`, `마그네슘`, `아연`
- 각 축 값은 전체 16개 제품 최대값 기준 퍼센트 정규화
- A = `rgba(37,99,235,0.25)` fill + `#2563EB` stroke
- B = `rgba(217,119,6,0.25)` fill + `#D97706` stroke
- 높이 220px, 카드 안에 배치
- 범례: "A 제품명" / "B 제품명"

### 5b. 세로 2컬럼 비교 테이블
- 3컬럼 grid: `90px | 1fr | 1fr`
- 성분명 컬럼: 이름 + 부제목, 탭하면 약학 설명 토글 (ChevronDown/Up 유지)
- A컬럼 / B컬럼 각각:
  - 숫자 성분: `값 + 단위` + 미니 bar (전체 max 기준 %), 더 높은 쪽 `↑` 강조
  - 텍스트 성분(B1형태, B2, B6, B12): 활성형이면 Active 뱃지 표시
  - B12: 활성형 여부 chip (`활성형` / `일반형`)
- 행 구분: `border-bottom: 1px solid #E8EAF0`
- 짝수 행 배경 `#F8F9FC`

**포함 행:**
B1 티아민 / B12 코발라민 / B2 리보플라빈 / B6 피리독신 / B3 / B5 / B7 / B9 / UDCA / 마그네슘 / 아연 / 비타민D

### 5c. Pharmacist's Note
기존 동적 분석 텍스트 유지 (B1 총량 비교, B12 활성여부, UDCA, 기타 성분, 주의사항).

---

## 6. FullTable.tsx

기존 구현 이동만. 화이트 테마 색상 적용.
- 배경 `#FFFFFF` / 홀수 행 `#F8F9FC`
- 헤더 `#F1F5F9`
- 최고값 강조: `text-amber-600 font-semibold`
- sticky 첫 컬럼 유지

---

## 7. RecommendTab.tsx

### 7a. 프리셋 버튼 (6개, 2열 그리드)
```
[음주 잦은 직장인]  [수험생·뇌피로]
[심한 신경통]      [여성·항산화]
[근육경련·눈떨림]  [입문·가성비]
```
각 프리셋이 활성화하는 체크박스 조합:
```ts
const PRESETS = {
  '음주 잦은 직장인': ['fatigue', 'liver'],
  '수험생·뇌피로':   ['brain', 'fatigue'],
  '심한 신경통':     ['neuro', 'fatigue'],
  '여성·항산화':     ['skin', 'immune'],
  '근육경련·눈떨림': ['muscle', 'fatigue'],
  '입문·가성비':     ['fatigue'],
}
```
- 탭 시 해당 증상 체크박스 자동 세팅 + 결과 즉시 갱신
- 활성 프리셋 배경 `#2563EB` 텍스트 white, 비활성 `#F1F5F9`

### 7b. 세부 증상 체크박스 (8개, 2열 그리드)
체크 변경 즉시 결과 리렌더.

### 7c. 추천 결과 카드
- `scoreProduct()` 기반 상위 3개 정렬
- 각 카드:
  - 순위 뱃지 (1위=금, 2위=은, 3위=동)
  - 제품명 + 제조사
  - 점수 프로그레스 바 (100점 만점)
  - "이 제품이 맞는 이유" — 선택된 증상별로 가장 가중치 높은 성분을 찾아, 해당 제품이 그 성분에서 전체 상위 3위 이내이면 "UDCA 60mg (최다)" 형식으로 나열. 최대 3개 표시.
  - 1위 카드에만: [A로 비교] [B로 비교] 버튼 → compare 탭 이동

---

## 8. Chart.js 도입

`npm install chart.js` (약 200KB gzip 60KB).  
`CompareTab.tsx`에서 `import { Chart, RadarController, ... } from 'chart.js'` tree-shake import.  
`useEffect`로 마운트 시 인스턴스 생성, p1Id/p2Id 변경 시 `chart.data` 업데이트 후 `chart.update()`.  
언마운트 시 `chart.destroy()`.

---

## 9. 비구현 범위 (이번 스펙 외)

- 가격 데이터 추가
- 3-way 비교
- 즐겨찾기/북마크
- 서버사이드 렌더링

---

## 10. 검증 기준

- [ ] `npm run build` 타입 에러 없음
- [ ] 모바일 375px에서 2컬럼 레이아웃 깨짐 없음
- [ ] 레이더 차트 제품 전환 시 애니메이션 정상
- [ ] 추천 탭 체크박스 0개 선택 시 빈 결과 또는 안내 메시지
- [ ] URL `?a=N&b=N` 복원 정상
- [ ] Netlify 배포 성공
