// src/CompareTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Chart, RadarController, LineElement, PointElement,
  RadialLinearScale, Filler, Legend, Tooltip,
} from 'chart.js';
import {
  ChevronDown, ChevronUp, Info, Zap, Shield, BookOpen, AlertTriangle,
} from 'lucide-react';
import type { VitaminProduct } from './data';
import { vitaminData, isActive, isB12Active, getRadarValues } from './data';

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

// Suppress unused variable warning for MAX_VALS — used as documentation / future use
void MAX_VALS;

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
  const chartRef  = useRef<InstanceType<typeof Chart> | null>(null);

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
