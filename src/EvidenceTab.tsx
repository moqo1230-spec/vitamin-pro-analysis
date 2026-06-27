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
