'use client';

import { useState } from "react";
import { Star, RefreshCw, Sparkles, Send, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  date: string;
  status: 'PENDING' | 'PUBLISHED';
  ai_reply_draft?: string | null;
}

interface Props {
  review: Review;
  onGenerate: (id: string) => Promise<void>;
  onApprove: (id: string, text: string) => Promise<void>;
}

export default function ReviewCard({ review, onGenerate, onApprove }: Props) {
  const [draftText, setDraftText] = useState(review.ai_reply_draft || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const isLowRating = review.rating <= 2;
  const borderLeftColor = isLowRating ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-transparent';

  const handleGenerateReply = async () => {
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/reviews/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: review.id })
      });
      
      if (res.ok) {
        const data = await res.json();
        // Set local state to show textarea immediately without reload
        setDraftText(data.draft);
      } else {
        console.error("Error generating reply");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    setIsPublishing(true);
    await onApprove(review.id, draftText);
    setIsPublishing(false);
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-5 transition-shadow hover:shadow-md ${borderLeftColor}`}>
      <div className="p-6">
        
        {/* Header Reviewer */}
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
              {review.reviewer_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900 text-base">{review.reviewer_name}</span>
                <span className="text-xs text-slate-500">• {review.date}</span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {review.status === 'PUBLISHED' 
              ? <Badge className="bg-green-100 text-green-700 hover:bg-green-200 shadow-none">Publicada</Badge>
              : <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-none">Pendiente</Badge>
            }
            {isLowRating && review.status === 'PENDING' && (
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 text-[10px]">¡Urgente!</Badge>
            )}
          </div>
        </div>

        {/* User Comment */}
        <p className="text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed border-l-2 border-slate-200 line-clamp-3 hover:line-clamp-none transition-all">
          "{review.comment}"
        </p>

        {/* AI Reply Area */}
        {review.status === 'PENDING' && (
          <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 relative">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
            
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-900">Respuesta sugerida por IA</span>
            </div>

            {draftText ? (
              <div className="flex flex-col gap-4">
                <Textarea 
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  className="min-h-[100px] bg-white border-blue-200 focus-visible:ring-blue-500 text-sm resize-y"
                  placeholder="Escribe la respuesta..."
                />
                <div className="flex flex-wrap justify-end gap-3 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateReply}
                    disabled={isGenerating || isPublishing}
                    className="text-slate-600 border-slate-300"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleApprove}
                    disabled={isGenerating || isPublishing || !draftText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isPublishing ? 'Publicando...' : 'Aprobar y publicar'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-200 rounded-xl bg-white/50">
                <Button 
                  onClick={handleGenerateReply} 
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 font-medium"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 mr-2 text-blue-200 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2 text-blue-200" />
                  )}
                  {isGenerating ? 'Generando...' : 'Generar respuesta con IA'}
                </Button>
              </div>
            )}
          </div>
        )}

        {review.status === 'PUBLISHED' && review.ai_reply_draft && (
           <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative">
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare className="w-4 h-4 text-green-600 hidden" />
                <span className="text-sm font-bold text-slate-700">Respuesta final publicada:</span>
              </div>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">{review.ai_reply_draft}</p>
           </div>
        )}
      </div>
    </div>
  );
}
