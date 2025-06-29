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
      click: '/sounds/click.mp3',
      keypress: '/sounds/keypress.mp3',
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      if (typeof window !== 'undefined') {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = 0.5;
        
        // Add error handler for missing files
        audio.onerror = () => {
          console.log(`Sound file not found: ${path}`);
        };
        
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
      soundClone.play().catch((error) => {
        // Log error for debugging but don't break the game
        console.log(`Sound "${soundName}" could not be played:`, error.message);
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

  // Initialize global sound handlers
  initializeGlobalSounds() {
    if (typeof window === 'undefined') return;

    // Click sound handler
    document.addEventListener('click', (e) => {
      if (!this.enabled) return;
      
      const target = e.target as HTMLElement;
      // Skip if clicking on input fields or text areas
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      
      // Play click sound for buttons and interactive elements
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') ||
          target.hasAttribute('role') && target.getAttribute('role') === 'button') {
        this.play('click');
      }
    });

    // Keyboard sound handler
    document.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      
      // Don't play sound for modifier keys
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
      
      // Play keypress sound
      this.play('keypress');
    });
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Preload sounds when the module is imported
if (typeof window !== 'undefined') {
  soundManager.preloadSounds();
  // Initialize global sound handlers when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      soundManager.initializeGlobalSounds();
    });
  } else {
    soundManager.initializeGlobalSounds();
  }
}