'use client';

import { Star, MessageSquare, CheckSquare, TrendingUp } from "lucide-react";

interface StatsProps {
  pending: number;
  answeredThisMonth: number;
  averageRating: string;
  totalThisMonth: number;
}

export default function StatsBar({ pending, answeredThisMonth, averageRating, totalThisMonth }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-slate-500">Reseñas pendientes</span>
          <MessageSquare className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-3xl font-extrabold text-slate-900">{pending}</div>
      </div>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-slate-500">Respondidas este mes</span>
          <CheckSquare className="w-4 h-4 text-green-500" />
        </div>
        <div className="text-3xl font-extrabold text-slate-900">{answeredThisMonth}</div>
      </div>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-slate-500">Rating promedio</span>
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
        </div>
        <div className="text-3xl font-extrabold text-slate-900">{averageRating}</div>
      </div>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-slate-500">Nuevas este mes</span>
          <TrendingUp className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-3xl font-extrabold text-slate-900">{totalThisMonth}</div>
      </div>
    </div>
  );
}
