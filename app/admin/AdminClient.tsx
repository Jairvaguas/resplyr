'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Clock, CheckCircle, XCircle, DollarSign, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function AdminClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-[#F8FAFC] p-8 flex items-center justify-center font-sans tracking-tight">Cargando métricas...</div>;

  if (!data?.metrics) return <div className="min-h-screen bg-[#F8FAFC] p-8 flex items-center justify-center font-sans">Error al cargar datos.</div>;

  const { metrics, table, growthChart } = data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900 tracking-tight">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Resplyr Logo" height={32} width={0} sizes="100vw" style={{ width: "auto" }} className="object-contain" unoptimized />
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none shadow-none font-semibold">Admin</Badge>
          </div>
          <a href="/dashboard" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-200">Ver como usuario →</a>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card icon={<Users className="w-5 h-5 text-blue-600" />} title="Total registrados" value={metrics.totalUsers} />
          <Card icon={<Clock className="w-5 h-5 text-amber-500" />} title="En trial activo" value={metrics.activeTrials} />
          <Card icon={<CheckCircle className="w-5 h-5 text-green-600" />} title="Suscritos activos" value={metrics.activeSubscribers} />
          <Card icon={<XCircle className="w-5 h-5 text-red-500" />} title="Inactivos/exp" value={metrics.inactiveUsers} />
          <Card icon={<DollarSign className="w-5 h-5 text-green-600" />} title="MRR USD" value={`$${metrics.mrr}`} />
          <Card icon={<MapPin className="w-5 h-5 text-blue-600" />} title="Locaciones conectadas" value={metrics.totalLocationsConnected} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-600"></div>Crecimiento de Registros
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="Registros" stroke="#2563EB" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6, stroke: '#2563EB', strokeWidth: 2, fill: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5 text-slate-400" />Directorio de Usuarios</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Trial hasta</th>
                  <th className="px-6 py-4 text-center">Locaciones</th>
                  <th className="px-6 py-4 text-center">Reseñas respondidas</th>
                  <th className="px-6 py-4">Fecha registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {table.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{row.email}</td>
                    <td className="px-6 py-4 uppercase font-bold text-xs"><span className={`px-2.5 py-1 rounded-md ${row.plan === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{row.plan || 'trial'}</span></td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.status === 'active' ? 'bg-green-100 text-green-700' : row.status === 'trial' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {(row.status || 'unknown')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{row.trial_ends_at ? new Date(row.trial_ends_at).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-center font-semibold">{row.loc_count || 0}</td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600">{row.reply_count || 0}</td>
                    <td className="px-6 py-4 text-slate-500">{row.registration_date ? new Date(row.registration_date).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
                {table.length === 0 && (
                   <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No hay usuarios registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none"></div>
      <div className="flex justify-between items-start mb-3 relative z-10">
        <span className="text-sm font-semibold text-slate-500 leading-tight">{title}</span>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white group-hover:scale-110 transition-all border border-slate-100 shrink-0 ml-2">
           {icon}
        </div>
      </div>
      <div className="text-xl md:text-3xl font-black text-slate-900 tracking-tight relative z-10">{value}</div>
    </div>
  );
}