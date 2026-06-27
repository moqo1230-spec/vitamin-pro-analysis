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
