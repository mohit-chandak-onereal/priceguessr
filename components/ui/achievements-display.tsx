'use client';

import { Achievement, AchievementStats, getAchievementProgress } from '@/lib/achievements';
import { motion } from 'framer-motion';

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  progress: number;
}

export function AchievementCard({ achievement, unlocked, progress }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative p-4 rounded-lg border-2 transition-all
        ${unlocked 
          ? 'bg-gradient-to-br from-yellow-bright/20 to-orange-bright/20 border-yellow-bright' 
          : 'bg-stage-dark/50 border-border'
        }
      `}
    >
      {/* Icon */}
      <div className={`text-4xl mb-2 ${unlocked ? '' : 'opacity-30 grayscale'}`}>
        {achievement.icon}
      </div>
      
      {/* Name and Description */}
      <h3 className={`font-bold text-sm mb-1 ${unlocked ? 'text-yellow-bright' : 'text-muted'}`}>
        {achievement.name}
      </h3>
      <p className="text-xs text-muted">
        {achievement.description}
      </p>
      
      {/* Progress Bar (if not unlocked and has progress) */}
      {!unlocked && progress > 0 && progress < 100 && (
        <div className="mt-2">
          <div className="h-1 bg-black/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-bright transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-1">{Math.round(progress)}%</p>
        </div>
      )}
      
      {/* Unlocked Badge */}
      {unlocked && (
        <div className="absolute -top-2 -right-2 bg-green-bright text-white text-xs px-2 py-1 rounded-full font-bold">
          ✓
        </div>
      )}
    </motion.div>
  );
}

interface AchievementsDisplayProps {
  achievements: Achievement[];
  unlockedIds: Set<string>;
  stats: AchievementStats;
  showAll?: boolean;
}

export function AchievementsDisplay({ 
  achievements, 
  unlockedIds, 
  stats,
  showAll = false 
}: AchievementsDisplayProps) {
  const displayAchievements = showAll 
    ? achievements 
    : achievements.filter(a => unlockedIds.has(a.id) || getAchievementProgress(a, stats) > 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayAchievements.map(achievement => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          unlocked={unlockedIds.has(achievement.id)}
          progress={getAchievementProgress(achievement, stats)}
        />
      ))}
    </div>
  );
}

interface AchievementToastProps {
  achievement: Achievement;
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <div className="bg-gradient-to-r from-yellow-bright to-orange-bright p-4 rounded-lg shadow-xl border-2 border-yellow-bright">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{achievement.icon}</div>
          <div>
            <h4 className="font-bold text-stage-dark">Achievement Unlocked!</h4>
            <p className="text-sm text-stage-dark/80">{achievement.name}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}