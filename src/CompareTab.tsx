import type { VitaminProduct } from './data';

export default function CompareTab({ p1, p2 }: { p1: VitaminProduct; p2: VitaminProduct }) {
  return <div className="p-4 text-gray-400">CompareTab WIP — {p1.name} vs {p2.name}</div>;
}
