import React, { useState, useEffect } from 'react';
import { FlaskConical, Check, Info, Zap, Shield, AlertTriangle, BookOpen, ChevronDown, ChevronUp, Copy, CheckCheck, LayoutGrid, ArrowLeftRight } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────
// 1. DATASET  (약학정보원 브라우저 직접 검증 v4.5 · 1일 복용량 기준)
// ──────────────────────────────────────────────────────────────────
const vitaminData = [
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

// ──────────────────────────────────────────────────────────────────
// 2. INGREDIENT GUIDES
// ──────────────────────────────────────────────────────────────────
const guides: Record<string, React.ReactNode> = {
  b1: (
    <div className="mt-2 text-xs text-cyan-300/80 bg-white/5 p-3 rounded-lg leading-relaxed border border-white/10">
      <p className="mb-1"><span className="text-cyan-400 font-semibold">💊 벤포티아민:</span> 수용성 티아민 대비 생체이용률 4~8배, 체내 농도 오래 유지 → 육체 피로에 탁월.</p>
      <p><span className="text-cyan-400 font-semibold">🧠 푸르설/비스벤티아민:</span> 뇌혈관장벽(BBB) 통과 → 뇌내 티아민 농도 높여 정신 피로·신경통에 유리.</p>
    </div>
  ),
  b2: (
    <div className="mt-2 text-xs text-cyan-300/80 bg-white/5 p-3 rounded-lg leading-relaxed border border-white/10">
      <p><span className="text-cyan-400 font-semibold">✨ 리보플라빈부티레이트(활성):</span> 일반형보다 체내 체류 시간 길어 구내염·설염 재발에 더 효과적.</p>
    </div>
  ),
  b6: (
    <div className="mt-2 text-xs text-cyan-300/80 bg-white/5 p-3 rounded-lg leading-relaxed border border-white/10">
      <p><span className="text-cyan-400 font-semibold">⚡ 피리독살포스페이트(활성):</span> 간 대사 없이 즉시 이용. 신경전달물질 생성 관여, 고용량 신경 독성 부작용 감소.</p>
    </div>
  ),
  b12: (
    <div className="mt-2 text-xs text-cyan-300/80 bg-white/5 p-3 rounded-lg leading-relaxed border border-white/10 space-y-1">
      <p><span className="text-red-400 font-semibold">🩸 메코발라민(활성):</span> 세포질 작용 → 말초신경 복구, 손발저림 완화 최강.</p>
      <p><span className="text-purple-400 font-semibold">⚡ 코바마미드(활성):</span> 미토콘드리아 ATP 생성 → 근육·뇌 에너지.</p>
      <p><span className="text-slate-400 font-semibold">🛡️ 시아노코발라민:</span> 안정성 높고 저렴하나, 체내 대사 후 활성화.</p>
    </div>
  ),
  udca: (
    <div className="mt-2 text-xs text-cyan-300/80 bg-white/5 p-3 rounded-lg leading-relaxed border border-white/10">
      <p><span className="text-green-400 font-semibold">🛡️ UDCA:</span> 담즙 분비 촉진 → 간 독소·노폐물 배출. 피로회복제와 병용 시 대사+해독 시너지.</p>
    </div>
  ),
  mg: (
    <div className="mt-2 text-xs text-cyan-300/80 bg-white/5 p-3 rounded-lg leading-relaxed border border-white/10 space-y-1">
      <p><span className="text-green-400 font-semibold">🧬 산화마그네슘:</span> 함량 높으나 흡수율 낮고 설사 유발 가능.</p>
      <p><span className="text-green-400 font-semibold">💧 유기염 마그네슘:</span> 글리세로인산/아스파르트산 등 흡수 빠르고 위장장애 적음.</p>
    </div>
  ),
};

// ──────────────────────────────────────────────────────────────────
// 3. HELPERS
// ──────────────────────────────────────────────────────────────────
const isActive = (s: string) =>
  !!s && (s.includes("활성") || s.includes("메코") || s.includes("히드록소") ||
          s.includes("푸르설") || s.includes("비스") || s.includes("코바") || s.includes("부티레이트"));

const b12Active = (s: string) =>
  s.includes("메코") || s.includes("히드록소") || s.includes("코바마미드");

const ActiveBadge = ({ desc }: { desc: string }) =>
  isActive(desc)
    ? <span className="ml-1 text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold border border-cyan-500/30 shadow-[0_0_6px_rgba(34,211,238,0.3)]">Active</span>
    : null;

const Bar = ({ val, maxVal, colorClass }: { val: number; maxVal: number; colorClass: string }) => {
  const pct = maxVal > 0 ? Math.round(Math.min((val / maxVal) * 100, 100)) : 0;
  return (
    <div className="flex-1 bg-white/10 rounded-full h-1.5">
      <div style={{ width: `${pct}%` }} className={`h-1.5 rounded-full transition-all duration-500 ${colorClass}`} />
    </div>
  );
};

type CompareRowProps = {
  label: string;
  sublabel?: string;
  guideKey?: string;
  expanded: string | null;
  onToggle: (k: string) => void;
  v1?: number;
  v2?: number;
  unit?: string;
  isText?: boolean;
  text1?: string;
  text2?: string;
};

const CompareRow = ({ label, sublabel, guideKey, expanded, onToggle, v1, v2, unit, isText, text1 = '', text2 = '' }: CompareRowProps) => {
  const maxVal = Math.max(v1 ?? 0, v2 ?? 0);
  const hasGuide = !!guideKey;

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => hasGuide && onToggle(guideKey!)}
        className={`w-full flex items-center justify-between px-4 pt-3 pb-1 text-left ${hasGuide ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div>
          <span className="text-sm font-semibold text-white/90">{label}</span>
          {sublabel && <span className="ml-2 text-[10px] text-white/35">{sublabel}</span>}
        </div>
        {hasGuide && (
          expanded === guideKey
            ? <ChevronUp size={14} className="text-white/30 flex-shrink-0" />
            : <ChevronDown size={14} className="text-white/30 flex-shrink-0" />
        )}
      </button>

      {hasGuide && expanded === guideKey && <div className="px-4">{guides[guideKey]}</div>}

      <div className="px-4 pb-3 mt-1.5 space-y-1.5">
        {isText ? (
          <>
            <div className="flex gap-2 items-start">
              <span className="text-[10px] font-bold text-cyan-400 w-4 flex-shrink-0 mt-0.5">A</span>
              <span className={`text-xs leading-relaxed ${isActive(text1) ? 'text-cyan-300' : 'text-white/55'}`}>
                {text1 || '—'}<ActiveBadge desc={text1} />
              </span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[10px] font-bold text-amber-400 w-4 flex-shrink-0 mt-0.5">B</span>
              <span className={`text-xs leading-relaxed ${isActive(text2) ? 'text-amber-300' : 'text-white/55'}`}>
                {text2 || '—'}<ActiveBadge desc={text2} />
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2 items-center">
              <span className="text-[10px] font-bold text-cyan-400 w-4 flex-shrink-0">A</span>
              <span className="text-xs text-cyan-300 w-16 flex-shrink-0 font-mono tabular-nums">
                {(v1 ?? 0) > 0 ? `${v1}${unit}` : '—'}
              </span>
              <Bar val={v1 ?? 0} maxVal={maxVal} colorClass="bg-cyan-400" />
              {(v1 ?? 0) > (v2 ?? 0) && (v1 ?? 0) > 0 && <span className="text-[9px] text-cyan-400 flex-shrink-0 font-bold">↑</span>}
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-[10px] font-bold text-amber-400 w-4 flex-shrink-0">B</span>
              <span className="text-xs text-amber-300 w-16 flex-shrink-0 font-mono tabular-nums">
                {(v2 ?? 0) > 0 ? `${v2}${unit}` : '—'}
              </span>
              <Bar val={v2 ?? 0} maxVal={maxVal} colorClass="bg-amber-400" />
              {(v2 ?? 0) > (v1 ?? 0) && (v2 ?? 0) > 0 && <span className="text-[9px] text-amber-400 flex-shrink-0 font-bold">↑</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// 4. FULL TABLE
// ──────────────────────────────────────────────────────────────────
type VitaminRow = typeof vitaminData[0];
const tableCols: { key: string; label: string; unit: string; fn: (v: VitaminRow) => number }[] = [
  { key: 'b1',   label: 'B1',   unit: 'mg',  fn: v => v.b1_total },
  { key: 'b3',   label: 'B3',   unit: 'mg',  fn: v => v.b3 },
  { key: 'b5',   label: 'B5',   unit: 'mg',  fn: v => v.b5 },
  { key: 'b7',   label: 'B7',   unit: 'mg',  fn: v => v.b7 },
  { key: 'b9',   label: 'B9',   unit: 'mg',  fn: v => v.b9 },
  { key: 'udca', label: 'UDCA', unit: 'mg',  fn: v => v.udca },
  { key: 'mg',   label: 'Mg',   unit: 'mg',  fn: v => v.mg },
  { key: 'zn',   label: 'Zn',   unit: 'mg',  fn: v => v.zn },
  { key: 'vitD', label: 'VitD', unit: 'IU',  fn: v => v.vitD },
];

const maxVals = Object.fromEntries(
  tableCols.map(c => [c.key, Math.max(...vitaminData.map(c.fn))])
);

const FullTable = ({ onSelect }: { onSelect: (id: number) => void }) => (
  <div className="mx-3 mt-3 mb-6">
    <p className="text-[10px] text-white/30 mb-2 text-center">제품명 탭 → 1:1 비교로 이동 · ★ = 전체 최고값</p>
    <div className="overflow-x-auto rounded-2xl border border-white/8">
      <table className="text-[10px] border-collapse" style={{ minWidth: '640px', width: '100%' }}>
        <thead>
          <tr className="bg-[#1a1a24]">
            <th className="sticky left-0 z-10 bg-[#1a1a24] px-3 py-2.5 text-left text-white/50 font-semibold border-b border-white/10 whitespace-nowrap" style={{ minWidth: '120px' }}>
              제품명
            </th>
            {tableCols.map(c => (
              <th key={c.key} className="px-2 py-2.5 text-center text-white/50 font-semibold border-b border-white/10 whitespace-nowrap">
                <div>{c.label}</div>
                <div className="text-white/25 font-normal text-[8px]">{c.unit}</div>
              </th>
            ))}
            <th className="px-2 py-2.5 text-center text-white/50 font-semibold border-b border-white/10 whitespace-nowrap">
              <div>B12</div>
              <div className="text-white/25 font-normal text-[8px]">형태</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {vitaminData.map((v, idx) => (
            <tr key={v.id} className={`${idx % 2 === 0 ? 'bg-[#0f0f14]' : 'bg-[#111118]'} hover:bg-white/5 transition-colors`}>
              <td
                className={`sticky left-0 z-10 ${idx % 2 === 0 ? 'bg-[#0f0f14]' : 'bg-[#111118]'} px-3 py-2 border-r border-white/5 cursor-pointer group`}
                onClick={() => onSelect(v.id)}
              >
                <div className="font-semibold text-white/80 group-hover:text-cyan-300 transition-colors whitespace-nowrap">{v.name}</div>
                <div className="text-white/30 text-[8px] mt-0.5">{v.maker}</div>
              </td>
              {tableCols.map(c => {
                const val = c.fn(v);
                const max = maxVals[c.key];
                const isTop = val > 0 && val === max;
                const pct = max > 0 ? (val / max) * 100 : 0;
                return (
                  <td key={c.key} className="px-2 py-1.5 text-center">
                    {val > 0 ? (
                      <>
                        <div className={`font-mono ${isTop ? 'text-amber-300 font-bold' : 'text-white/55'}`}>
                          {isTop && <span className="text-amber-400 mr-0.5">★</span>}
                          {val}
                        </div>
                        <div className="mt-0.5 h-0.5 bg-white/8 rounded-full mx-1">
                          <div
                            className={`h-0.5 rounded-full ${isTop ? 'bg-amber-400' : 'bg-white/25'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <span className="text-white/18">—</span>
                    )}
                  </td>
                );
              })}
              <td className="px-2 py-1.5 text-center">
                {b12Active(v.b12_info) ? (
                  <span className="inline-block text-[8px] bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/25">활성</span>
                ) : (
                  <span className="text-white/20 text-[8px]">일반</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────
// 5. MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────
const VitaminComparator = () => {
  const [p1Id, setP1Id] = useState(1);
  const [p2Id, setP2Id] = useState(3);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'compare' | 'table'>('compare');
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
  const toggle = (key: string) => setExpanded(prev => prev === key ? null : key);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // From table: select a product and switch to compare tab
  const handleTableSelect = (id: number) => {
    if (id !== p1Id && id !== p2Id) {
      setP2Id(id);
    }
    setActiveTab('compare');
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white font-sans pb-16 max-w-lg mx-auto">

      {/* Header */}
      <header className="px-4 pt-6 pb-3 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FlaskConical className="text-cyan-400" size={22} />
          <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Vitamin Pro Analysis
          </h1>
        </div>
        <div className="flex items-center justify-center gap-1 text-[10px] text-white/35">
          <Check size={10} className="text-green-400" />
          <span>약학정보원 브라우저 직접 검증 · 1일 복용량 기준 v4.5</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-[#0f0f14]/95 backdrop-blur-sm border-b border-white/5">
        <div className="flex px-3 pt-2 gap-1">
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold transition-colors ${
              activeTab === 'compare'
                ? 'bg-[#1a1a24] text-white border-t border-l border-r border-white/8'
                : 'text-white/35 hover:text-white/60'
            }`}
          >
            <ArrowLeftRight size={12} />
            1:1 비교
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold transition-colors ${
              activeTab === 'table'
                ? 'bg-[#1a1a24] text-white border-t border-l border-r border-white/8'
                : 'text-white/35 hover:text-white/60'
            }`}
          >
            <LayoutGrid size={12} />
            전체 테이블
          </button>
          <div className="flex-1" />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 mb-1 rounded-lg text-[10px] text-white/40 hover:text-cyan-300 hover:bg-white/5 transition-colors border border-white/8 self-center"
          >
            {copied ? <CheckCheck size={11} className="text-green-400" /> : <Copy size={11} />}
            {copied ? '복사됨' : '링크'}
          </button>
        </div>

        {/* Selectors — only in compare tab */}
        {activeTab === 'compare' && (
          <div className="bg-[#1a1a24]/50 px-3 pt-2 pb-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#1a1a24] rounded-xl p-3 border border-cyan-500/20">
                <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-1">제품 A</p>
                <select className="w-full bg-transparent text-cyan-200 text-xs font-bold outline-none"
                  value={p1Id} onChange={e => setP1Id(Number(e.target.value))}>
                  {vitaminData.map(v => (
                    <option key={v.id} value={v.id} disabled={v.id === p2Id} className="bg-[#1a1a24] text-white">{v.name}</option>
                  ))}
                </select>
                <div className="mt-1 flex gap-1 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{p1.maker}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/50">{p1.dailyDose}</span>
                </div>
              </div>
              <div className="bg-[#1a1a24] rounded-xl p-3 border border-amber-500/20">
                <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-1">제품 B</p>
                <select className="w-full bg-transparent text-amber-200 text-xs font-bold outline-none"
                  value={p2Id} onChange={e => setP2Id(Number(e.target.value))}>
                  {vitaminData.map(v => (
                    <option key={v.id} value={v.id} disabled={v.id === p1Id} className="bg-[#1a1a24] text-white">{v.name}</option>
                  ))}
                </select>
                <div className="mt-1 flex gap-1 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{p2.maker}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/50">{p2.dailyDose}</span>
                </div>
              </div>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-2 text-[10px]">
              <p className="text-cyan-400/60 leading-tight">{p1.target}</p>
              <p className="text-amber-400/60 leading-tight">{p2.target}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── FULL TABLE TAB ── */}
      {activeTab === 'table' && (
        <FullTable onSelect={handleTableSelect} />
      )}

      {/* ── COMPARE TAB ── */}
      {activeTab === 'compare' && (
        <>
          {/* Info banner */}
          <div className="mx-3 mt-3 flex gap-2 items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
            <Info size={11} className="flex-shrink-0 text-blue-400" />
            <span className="text-[10px] text-blue-300">성분명 탭 → 약학 설명 · <span className="text-cyan-300 font-bold">A=파란바</span> <span className="text-amber-300 font-bold">B=노란바</span> · ↑ 우위</span>
          </div>

          {/* Section 1: Vital B-Complex */}
          <div className="mx-3 mt-4 bg-[#1a1a24] rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <Zap size={15} className="text-amber-400" />
              <h2 className="text-sm font-bold text-white/90">Vital B-Complex</h2>
              <span className="text-[10px] text-white/30">피로회복 & 신경계 핵심</span>
            </div>

            {/* B1 */}
            <div className="border-b border-white/5">
              <button onClick={() => toggle('b1')} className="w-full flex items-center justify-between px-4 pt-3 pb-1 text-left">
                <div>
                  <span className="text-sm font-semibold text-white/90">B1 티아민</span>
                  <span className="ml-2 text-[10px] text-white/35">에너지 대사 · 피로물질 제거</span>
                </div>
                {expanded === 'b1' ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
              </button>
              {expanded === 'b1' && <div className="px-4">{guides.b1}</div>}
              <div className="px-4 pb-3 mt-1.5 space-y-1.5">
                <div className="flex gap-2 items-start">
                  <span className="text-[10px] font-bold text-cyan-400 w-4 flex-shrink-0 mt-0.5">A</span>
                  <span className={`text-xs leading-relaxed ${isActive(p1.b1_info) ? 'text-cyan-300' : 'text-white/55'}`}>
                    {p1.b1_info}<ActiveBadge desc={p1.b1_info} />
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-[10px] font-bold text-amber-400 w-4 flex-shrink-0 mt-0.5">B</span>
                  <span className={`text-xs leading-relaxed ${isActive(p2.b1_info) ? 'text-amber-300' : 'text-white/55'}`}>
                    {p2.b1_info}<ActiveBadge desc={p2.b1_info} />
                  </span>
                </div>
                <div className="pt-1 space-y-1">
                  <div className="flex gap-2 items-center">
                    <span className="text-[9px] text-white/30 w-4">A</span>
                    <span className="text-[10px] text-cyan-400 w-14 font-mono">{p1.b1_total}mg</span>
                    <Bar val={p1.b1_total} maxVal={Math.max(p1.b1_total, p2.b1_total)} colorClass="bg-cyan-400" />
                    {p1.b1_total > p2.b1_total && <span className="text-[9px] text-cyan-400 font-bold">↑</span>}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[9px] text-white/30 w-4">B</span>
                    <span className="text-[10px] text-amber-400 w-14 font-mono">{p2.b1_total}mg</span>
                    <Bar val={p2.b1_total} maxVal={Math.max(p1.b1_total, p2.b1_total)} colorClass="bg-amber-400" />
                    {p2.b1_total > p1.b1_total && <span className="text-[9px] text-amber-400 font-bold">↑</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* B12 */}
            <div className="border-b border-white/5">
              <button onClick={() => toggle('b12')} className="w-full flex items-center justify-between px-4 pt-3 pb-1 text-left">
                <div>
                  <span className="text-sm font-semibold text-white/90">B12 코발라민</span>
                  <span className="ml-2 text-[10px] text-white/35">신경통 · 손발저림 · 혈액</span>
                </div>
                {expanded === 'b12' ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
              </button>
              {expanded === 'b12' && <div className="px-4">{guides.b12}</div>}
              <div className="px-4 pb-2 mt-1.5 space-y-1.5">
                <div className="flex gap-2 items-start">
                  <span className="text-[10px] font-bold text-cyan-400 w-4 flex-shrink-0 mt-0.5">A</span>
                  <span className={`text-xs leading-relaxed ${b12Active(p1.b12_info) ? 'text-cyan-300' : 'text-white/55'}`}>{p1.b12_info}</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-[10px] font-bold text-amber-400 w-4 flex-shrink-0 mt-0.5">B</span>
                  <span className={`text-xs leading-relaxed ${b12Active(p2.b12_info) ? 'text-amber-300' : 'text-white/55'}`}>{p2.b12_info}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 px-4 pb-3">
                <div className={`text-[9px] text-center py-1 rounded ${b12Active(p1.b12_info) ? 'bg-red-500/20 text-red-300 border border-red-500/25' : 'bg-white/5 text-white/25'}`}>
                  {b12Active(p1.b12_info) ? '✓ 활성형' : '일반형'}
                </div>
                <div className={`text-[9px] text-center py-1 rounded ${b12Active(p2.b12_info) ? 'bg-red-500/20 text-red-300 border border-red-500/25' : 'bg-white/5 text-white/25'}`}>
                  {b12Active(p2.b12_info) ? '✓ 활성형' : '일반형'}
                </div>
              </div>
            </div>

            <CompareRow label="B2 리보플라빈" sublabel="구내염 · 입병"
              guideKey="b2" expanded={expanded} onToggle={toggle}
              isText text1={p1.b2_info} text2={p2.b2_info} />

            <CompareRow label="B6 피리독신" sublabel="신경염 · 호모시스테인"
              guideKey="b6" expanded={expanded} onToggle={toggle}
              isText text1={p1.b6_info} text2={p2.b6_info} />
          </div>

          {/* Section 2: Support B */}
          <div className="mx-3 mt-4 bg-[#1a1a24] rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <BookOpen size={15} className="text-purple-400" />
              <h2 className="text-sm font-bold text-white/90">Support B-Complex</h2>
              <span className="text-[10px] text-white/30">대사 보조</span>
            </div>
            <CompareRow label="B3 니코틴산" sublabel="혈관 확장 · 콜레스테롤" expanded={expanded} onToggle={toggle} v1={p1.b3} v2={p2.b3} unit="mg" />
            <CompareRow label="B5 판토텐산" sublabel="부신 기능 · 스트레스" expanded={expanded} onToggle={toggle} v1={p1.b5} v2={p2.b5} unit="mg" />
            <CompareRow label="B7 비오틴"   sublabel="모발 · 혈당" expanded={expanded} onToggle={toggle} v1={p1.b7} v2={p2.b7} unit="mg" />
            <CompareRow label="B9 폴산"     sublabel="세포분열 · 빈혈" expanded={expanded} onToggle={toggle} v1={p1.b9} v2={p2.b9} unit="mg" />
          </div>

          {/* Section 3: Organ Support */}
          <div className="mx-3 mt-4 bg-[#1a1a24] rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <Shield size={15} className="text-emerald-400" />
              <h2 className="text-sm font-bold text-white/90">Organ Support</h2>
              <span className="text-[10px] text-white/30">간 · 근육 · 면역</span>
            </div>
            <CompareRow label="UDCA (우루사)" sublabel="간 기능 보조"
              guideKey="udca" expanded={expanded} onToggle={toggle}
              v1={p1.udca} v2={p2.udca} unit="mg" />
            <CompareRow label="마그네슘 (Mg)" sublabel="근육 이완 · 눈떨림"
              guideKey="mg" expanded={expanded} onToggle={toggle}
              v1={p1.mg} v2={p2.mg} unit="mg" />
            <CompareRow label="아연 (Zn)" sublabel="면역 · 남성 활력" expanded={expanded} onToggle={toggle} v1={p1.zn} v2={p2.zn} unit="mg" />
            <CompareRow label="비타민 D" sublabel="뼈 건강 · 면역" expanded={expanded} onToggle={toggle} v1={p1.vitD} v2={p2.vitD} unit="IU" />
          </div>

          {/* Section 4: Pharmacist Note */}
          <div className="mx-3 mt-4 bg-[#1a1a24] rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <Info size={15} className="text-indigo-400" />
              <h2 className="text-sm font-bold text-white/90">Pharmacist's Note</h2>
            </div>
            <div className="p-4 space-y-3 text-xs text-white/55 leading-relaxed">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-semibold text-white/75 mb-1">💡 B1 & B12</p>
                <p>
                  {p1.b1_total !== p2.b1_total
                    ? `B1 총량: ${p1.b1_total > p2.b1_total ? p1.name : p2.name}이 ${Math.abs(p1.b1_total - p2.b1_total)}mg 더 높습니다. `
                    : '두 제품의 B1 총량이 동일합니다. '}
                  {b12Active(p1.b12_info) && !b12Active(p2.b12_info)
                    ? `${p1.name}은 활성형 B12로 신경병증에 더 유리합니다.`
                    : !b12Active(p1.b12_info) && b12Active(p2.b12_info)
                    ? `${p2.name}은 활성형 B12로 신경병증에 더 유리합니다.`
                    : b12Active(p1.b12_info) && b12Active(p2.b12_info)
                    ? '두 제품 모두 활성형 B12입니다.'
                    : '두 제품 모두 일반형 B12입니다.'}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-semibold text-white/75 mb-1">🛡️ 장기 보호</p>
                <p>{p1.udca > 30 || p2.udca > 30
                  ? `UDCA 고함량: ${p1.udca > p2.udca ? p1.name : p2.name} → 음주 잦거나 소화기 약한 분께 적합.`
                  : 'UDCA 함량이 낮거나 없습니다.'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="font-semibold text-white/75 mb-1">✨ 차별화</p>
                <p><span className="text-cyan-400">A</span> {p1.others.join(' · ')}</p>
                <p className="mt-1"><span className="text-amber-400">B</span> {p2.others.join(' · ')}</p>
              </div>
              <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                <AlertTriangle size={11} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p><span className="text-cyan-400 font-semibold">A 주의:</span> {p1.warning}</p>
                  <p className="mt-0.5"><span className="text-amber-400 font-semibold">B 주의:</span> {p2.warning}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mx-3 mt-4 grid grid-cols-2 gap-2">
            <div className="bg-[#1a1a24] rounded-xl p-3 border border-cyan-500/10">
              <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-2">A 특징</p>
              {p1.features.map((f, i) => (
                <span key={i} className="inline-block text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full mr-1 mb-1">{f}</span>
              ))}
            </div>
            <div className="bg-[#1a1a24] rounded-xl p-3 border border-amber-500/10">
              <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-2">B 특징</p>
              {p2.features.map((f, i) => (
                <span key={i} className="inline-block text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full mr-1 mb-1">{f}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VitaminComparator;
