'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight, Plus, MapPin, Sparkles } from "lucide-react";
import LocationSwitcher, { LocationData } from "./LocationSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  userName: string;
  userAvatar: string;
  plan: 'trial' | 'basic' | 'pro' | 'business';
  locations: LocationData[];
  activeLocationId: string | null;
  setActiveLocationId: (id: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const locationLimits = { trial: 1, basic: 1, pro: 3, business: 9 };

export default function Sidebar({
  userName, userAvatar, plan, locations, activeLocationId, setActiveLocationId, isMobileMenuOpen, setIsMobileMenuOpen
}: SidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Desktop width vs Mobile hidden
  const sidebarWidth = isCollapsed ? 'w-[72px]' : 'w-[260px]';
  const mobileClasses = isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full';
  
  const usedLocations = locations.length;
  const maxLocations = locationLimits[plan] || 1;
  const hasAvailableSlots = usedLocations < maxLocations;

  const handleAddLocation = async () => {
    if (hasAvailableSlots) {
      router.push('/api/auth/google');
    } else {
      const res = await fetch('/api/billing/add-location', { method: 'POST' });
      const data = await res.json();
      if (data.checkoutUrl) router.push(data.checkoutUrl);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col 
          ${sidebarWidth} ${mobileClasses} md:translate-x-0`}
      >
        {/* Toggle button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-[12px] top-7 items-center justify-center w-6 h-6 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 z-50 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100 shrink-0">
          <Link href="/" className="flex items-center gap-2 overflow-hidden w-full">
            {isCollapsed ? (
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl mx-auto shrink-0">
                R
              </div>
            ) : (
              <Image 
                src="/logo.png" 
                alt="Resplyr Logo" 
                height={48}
                width={0}
                sizes="100vw"
                className="h-12 w-auto object-contain shrink-0"
                unoptimized
              />
            )}
          </Link>
        </div>

        {/* Navigation / Content */}
        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6">
          
          {/* Ubicaciones Section */}
          <div className="space-y-3">
            {!isCollapsed && (
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">Mis Ubicaciones</h3>
            )}
            
            <LocationSwitcher 
              locations={locations} 
              activeLocationId={activeLocationId} 
              onSelect={(id) => { setActiveLocationId(id); setIsMobileMenuOpen(false); }}
              isCollapsed={isCollapsed}
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={handleAddLocation}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all ${isCollapsed ? 'py-2 px-0' : 'py-2 px-3'}`}
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">
                        {hasAvailableSlots ? 'Agregar ubicación' : 'Agregar (+$15/mes)'}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {hasAvailableSlots ? 'Agregar ubicación' : 'Agregar ubicación (+$15/mes)'}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {!isCollapsed && (
              <div className="px-3 text-xs text-slate-400 font-medium">
                {usedLocations}/{maxLocations} ubicaciones usadas
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Main Links Section */}
          <div className="space-y-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    href="/dashboard" 
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 rounded-l-none"
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0 text-blue-600" />
                    {!isCollapsed && <span>Panel Principal</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Panel Principal</TooltipContent>}
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    href="/settings" 
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-2 border-transparent"
                  >
                    <Settings className="w-4 h-4 shrink-0 text-slate-400" />
                    {!isCollapsed && <span>Configuración</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Configuración</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Footer info (Plan & User) */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-3 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold uppercase text-slate-700">
                Plan {plan === 'trial' ? 'Trial' : plan}
              </span>
            </div>
          )}
          
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full`}>
            <Avatar className="w-8 h-8 rounded-full border border-slate-200 shadow-sm shrink-0">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-slate-900 truncate">{userName}</span>
                <span className="text-xs text-slate-500">Mi Cuenta</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for desktop layout (so content doesn't go under fixed sidebar) */}
      <div className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out ${sidebarWidth}`} />
    </>
  );
}
