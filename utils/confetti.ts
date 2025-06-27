import confetti from 'canvas-confetti';

// Standard win celebration
export const triggerWinConfetti = () => {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FBA92C', '#FACC15', '#22C55E', '#3B82F6', '#A855F7'],
  });
  
  // Delayed second burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FBA92C', '#FACC15', '#22C55E'],
    });
  }, 250);
  
  // Third burst from right
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FBA92C', '#FACC15', '#22C55E'],
    });
  }, 400);
};

// Perfect guess celebration (100% accuracy)
export const triggerPerfectConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const colors = ['#FFD700', '#FFA500', '#FF6347']; // Gold theme

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
      shapes: ['star'],
      scalar: 1.2,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
      shapes: ['star'],
      scalar: 1.2,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  }());
};

// Fast win celebration (under 3 attempts)
export const triggerFastWinConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#EF4444', '#FBA92C', '#FACC15'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#3B82F6', '#22C55E', '#A855F7'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#FBA92C', '#FACC15', '#EC4899'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#22C55E', '#3B82F6'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#A855F7', '#EC4899'],
  });
};

// High score celebration
export const triggerHighScoreConfetti = () => {
  // Emoji confetti
  const scalar = 2;
  const emoji = ['🏆', '⭐', '🎉', '💰', '🎯'];
  
  confetti({
    particleCount: 30,
    spread: 90,
    origin: { y: 0.6 },
    shapes: ['circle'],
    scalar,
    colors: ['#FFD700', '#FFA500'],
  });

  // Add some emoji
  setTimeout(() => {
    confetti({
      particleCount: 15,
      spread: 120,
      origin: { y: 0.5 },
      shapes: ['square'], // Emojis work better with square shape
      scalar: 1.5,
      colors: ['#FFD700'],
    });
  }, 300);
};