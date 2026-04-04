import { Search } from 'lucide-react';
import type { StoreCategory } from '@/types';

interface StoreFiltersProps {
  segments: StoreCategory[];
  search: string;
  onSearchChange: (val: string) => void;
  activeSegment: StoreCategory['slug'];
  onSegmentChange: (slug: StoreCategory['slug']) => void;
}

export default function StoreFilters({
  segments,
  search,
  onSearchChange,
  activeSegment,
  onSegmentChange,
}: StoreFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          placeholder="Buscar loja..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-white"
        />
      </div>

      {/* Segment filters */}
      <div className="flex flex-wrap gap-2">
        {segments.map((seg) => (
          <button
            key={seg.slug}
            onClick={() => onSegmentChange(seg.slug)}
            className={`px-4 py-2 text-xs tracking-wider uppercase font-medium transition-all duration-200 border ${
              activeSegment === seg.slug
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
            }`}
          >
            {seg.label}
          </button>
        ))}
      </div>
    </div>
  );
}
