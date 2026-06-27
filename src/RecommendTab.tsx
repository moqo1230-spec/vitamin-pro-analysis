import { useState } from 'react';
import type { SymptomKey } from './data';
import { vitaminData, SYMPTOM_LABELS, PRESETS, scoreProduct, getReasons } from './data';

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
