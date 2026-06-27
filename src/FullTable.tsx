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
