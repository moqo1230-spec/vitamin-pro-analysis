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
