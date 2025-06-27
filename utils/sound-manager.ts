// Sound effects manager for the game
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Check if sound preference is saved
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    }
  }

  // Preload sounds
  preloadSounds() {
    const soundFiles = {
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      tick: '/sounds/tick.mp3',
      gameOver: '/sounds/game-over.mp3',
      newHighScore: '/sounds/high-score.mp3',
      reveal: '/sounds/reveal.mp3',
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      if (typeof window !== 'undefined') {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = 0.5;
        this.sounds.set(key, audio);
      }
    });
  }

  // Play a sound effect
  play(soundName: string) {
    if (!this.enabled) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      // Clone the audio to allow overlapping sounds
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = sound.volume;
      soundClone.play().catch(() => {
        // Ignore errors (e.g., autoplay policy)
      });
    }
  }

  // Toggle sound on/off
  toggleSound() {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundEnabled', this.enabled.toString());
    }
    return this.enabled;
  }

  // Get current sound state
  isEnabled() {
    return this.enabled;
  }

  // Set volume for all sounds
  setVolume(volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = clampedVolume;
    });
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Preload sounds when the module is imported
if (typeof window !== 'undefined') {
  soundManager.preloadSounds();
}