'use client';

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsBar from "@/components/dashboard/StatsBar";
import ReviewCard from "@/components/dashboard/ReviewCard";
import EmptyState from "@/components/dashboard/EmptyState";

interface Props {
  isConnected: boolean;
  locations: any[];
  reviews: any[];
  userName: string;
  userAvatar: string;
}

export default function ClientDashboard({ isConnected, locations, reviews, userName, userAvatar }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(
    locations.length > 0 ? locations[0].id : null
  );

  const handleConnect = () => {
    window.location.href = "/api/auth/google";
  };

  const handleSync = () => {
    console.log("Syncing...");
  };

  const handleGenerate = async (id: string) => {
    console.log("Generating for", id);
  };

  const handleApprove = async (id: string, text: string) => {
    console.log("Approving", id, text);
  };

  const locationReviews = reviews.filter(r => r.location_id === activeLocationId);
  const pendingCount = locationReviews.filter(r => !r.ai_reply_draft && !r.replied).length;
  const answeredCount = locationReviews.filter(r => r.replied).length;
  
  const totalReviewsThisMonth = locationReviews.length;
  const avgRating = totalReviewsThisMonth > 0 
    ? (locationReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviewsThisMonth).toFixed(1) 
    : "0.0";

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      {/* Mobile Menu Button - Top Right */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 right-4 z-30 p-2 bg-white rounded-lg shadow-sm border border-slate-200"
      >
        <Menu className="w-5 h-5 text-slate-600" />
      </button>

      {/* Sidebar with enhanced location switcher */}
      <Sidebar 
        userName={userName}
        userAvatar={userAvatar}
        plan="trial"
        locations={locations.map(l => ({ id: l.id, name: l.name }))}
        activeLocationId={activeLocationId}
        setActiveLocationId={setActiveLocationId}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main SaaS Content Area */}
      <main className="flex-1 flex flex-col items-center overflow-x-hidden">
         <div className="w-full max-w-5xl px-4 md:px-8 py-8 md:py-12">
            {!isConnected ? (
              <EmptyState 
                 hasGoogleConnected={false}
                 onConnect={handleConnect}
                 onSync={handleSync}
              />
            ) : (
               <>
                 <div className="mb-8">
                   <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Bienvenido, {userName}</h1>
                   <p className="text-slate-500">Aquí tienes el resumen y las reseñas recientes de tus ubicaciones.</p>
                 </div>

                 {/* Top modern metrics bar */}
                 <StatsBar 
                   pending={locationReviews.filter(r => !r.replied).length}
                   answeredThisMonth={answeredCount}
                   averageRating={avgRating}
                   totalThisMonth={totalReviewsThisMonth}
                 />

                 {locationReviews.length === 0 ? (
                    <EmptyState 
                       hasGoogleConnected={true}
                       onConnect={handleConnect}
                       onSync={handleSync}
                    />
                 ) : (
                    <div className="space-y-6">
                       <h2 className="text-xl font-bold text-slate-800">Reseñas de la Ubicación</h2>
                       {locationReviews.map(r => (
                         <ReviewCard 
                           key={r.id}
                           review={{
                              id: r.id,
                              reviewer_name: r.reviewer_name || "Anónimo",
                              rating: r.rating,
                              comment: r.comment || "Sin comentario provisto.",
                              date: new Date(r.review_date).toLocaleDateString(),
                              status: r.replied ? 'PUBLISHED' : 'PENDING',
                              ai_reply_draft: r.ai_reply_draft
                           }}
                           onGenerate={handleGenerate}
                           onApprove={handleApprove}
                         />
                       ))}
                    </div>
                 )}
               </>
            )}
         </div>
      </main>
    </div>
  );
}
