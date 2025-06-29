'use client';

import { useEffect } from 'react';
import { soundManager } from '@/utils/sound-manager';

export function SoundInitializer() {
  useEffect(() => {
    // Initialize sounds when component mounts
    soundManager.preloadSounds();
    soundManager.initializeGlobalSounds();
  }, []);

  return null;
}