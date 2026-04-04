'use client';

import { MapPin } from "lucide-react";

export interface LocationData {
  id: string;
  name: string;
}

interface Props {
  locations: LocationData[];
  activeLocationId: string | null;
  onSelect: (id: string) => void;
  isCollapsed: boolean;
}

export default function LocationSwitcher({ locations, activeLocationId, onSelect, isCollapsed }: Props) {
  if (locations.length === 0) return null;

  return (
    <div className="space-y-1">
      {locations.map((loc) => {
        const isActive = loc.id === activeLocationId;
        return (
          <button
            key={loc.id}
            onClick={() => onSelect(loc.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive 
                ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 rounded-l-none" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-2 border-transparent"
            }`}
            title={isCollapsed ? loc.name : undefined}
          >
            <MapPin className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
            {!isCollapsed && <span className="truncate text-left">{loc.name}</span>}
          </button>
        );
      })}
    </div>
  );
}
