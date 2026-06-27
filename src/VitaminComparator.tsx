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
