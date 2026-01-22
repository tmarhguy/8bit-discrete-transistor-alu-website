'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { buildJourneyStages } from '@/lib/data/buildJourney';
import InteractiveGallery from '@/components/ui/InteractiveGallery';

export default function BuildJourneyStagePage() {
  const params = useParams();
  const router = useRouter();
  const stageId = params.stage as string;

  const stage = buildJourneyStages.find((s) => s.id === stageId);
  const stageIndex = buildJourneyStages.findIndex((s) => s.id === stageId);

  const isGalleryDisabled = stage?.galleryDisabled ?? false;
  const notice = stage?.notice;

  if (!stage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Stage Not Found</h1>
          <button
            onClick={() => router.push('/#build-journey')}
            className="px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors"
          >
            Return to Build Journey
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    completed: 'bg-green-500',
    'in-progress': 'bg-blue-500',
    upcoming: 'bg-gray-500',
  };

  const statusLabels = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    upcoming: 'Upcoming',
  };

  const prevStage = stageIndex > 0 ? buildJourneyStages[stageIndex - 1] : null;
  const nextStage = stageIndex + 1 < buildJourneyStages.length ? buildJourneyStages[stageIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 glass glass-border border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/#build-journey')}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Build Journey</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Stage {stageIndex + 1} of {buildJourneyStages.length}</span>
              <div className={`px-3 py-1 ${statusColors[stage.status || 'completed']} rounded-full`}>
                <span className="text-white text-xs font-semibold">{statusLabels[stage.status || 'completed']}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <span className="text-background font-bold text-2xl">{stageIndex + 1}</span>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">{stage.title}</h1>
              <p className="text-xl text-muted-foreground">{stage.description}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass glass-border rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
          <div className="prose prose-invert max-w-none">
            {stage.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground mb-4 whitespace-pre-wrap">{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {isGalleryDisabled ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <div className="rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-black/70 p-8 text-center">
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#F5DEB3]">Ongoing</span>
              <h2 className="text-3xl font-bold text-[#F5DEB3] mt-4">
                {notice?.title ?? 'Work in Progress'}
              </h2>
              <p className="text-sm text-muted-foreground/80 mt-3 max-w-3xl mx-auto">
                {notice?.body ?? 'Photos and videos will appear here once the milestone is further along.'}
              </p>
            </div>
          </motion.div>
        ) : (
          stage?.detailImages && stage.detailImages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Detailed Images ({stage.detailImages.length})</h2>
              <div className="w-full">
                <InteractiveGallery images={stage.detailImages} title={stage.title} />
              </div>
            </motion.div>
          )
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-between items-center pt-8 border-t border-white/10">
          {prevStage ? (
            <button onClick={() => router.push(`/build-journey/${prevStage.id}`)} className="flex items-center gap-2 px-6 py-3 glass glass-border rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="font-medium text-foreground">{prevStage.title}</div>
              </div>
            </button>
          ) : <div></div>}

          {nextStage ? (
            <button onClick={() => router.push(`/build-journey/${nextStage.id}`)} className="flex items-center gap-2 px-6 py-3 glass glass-border rounded-lg hover:bg-white/10 transition-colors">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Next</div>
                <div className="font-medium text-foreground">{nextStage.title}</div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : <div></div>}
        </motion.div>
      </div>


    </div>
  );
}
