interface ShareData {
  score?: number;
  accuracy?: number;
  attempts?: number;
  itemName?: string;
  streak?: number;
}

export function generateShareText(data: ShareData): string {
  const { score = 0, accuracy = 0, attempts = 6, itemName = 'an item', streak = 0 } = data;
  
  // Generate emoji grid based on attempts
  const maxAttempts = 6;
  const emojis: string[] = Array.from({ length: attempts }, (_, i) => {
    if (i === attempts - 1 && accuracy >= 95) return '🎯'; // Last attempt was winning
    return '🟨'; // Regular attempt
  });
  
  // Fill remaining with empty slots
  while (emojis.length < maxAttempts) {
    emojis.push('⬜');
  }
  
  let text = `🎰 PriceGuessr\n\n`;
  text += emojis.join('') + '\n\n';
  
  if (accuracy >= 95) {
    text += `✅ Won with ${accuracy.toFixed(1)}% accuracy!\n`;
    text += `📊 Score: ${score.toLocaleString()} points\n`;
    if (streak > 1) {
      text += `🔥 Streak: ${streak} wins\n`;
    }
  } else {
    text += `❌ Game Over\n`;
    text += `💸 The ${itemName} stumped me!\n`;
  }
  
  text += `\nPlay at: ${getShareUrl()}`;
  
  return text;
}

export function getShareUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://priceguessr.com';
}

export async function shareResults(data: ShareData): Promise<boolean> {
  const text = generateShareText(data);
  
  // Check if Web Share API is available
  if (navigator.share && canUseWebShare()) {
    try {
      await navigator.share({
        title: 'PriceGuessr Results',
        text: text,
      });
      return true;
    } catch (err) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed:', err);
      return false;
    }
  } else {
    // Fallback to clipboard
    return copyToClipboard(text);
  }
}

export function canUseWebShare(): boolean {
  // Web Share API is available on mobile and some desktop browsers
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

export function shareOnTwitter(data: ShareData): void {
  const text = generateShareText(data);
  const encodedText = encodeURIComponent(text);
  const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
  window.open(url, '_blank', 'width=550,height=420');
}

export function shareOnFacebook(): void {
  const url = encodeURIComponent(getShareUrl());
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(fbUrl, '_blank', 'width=550,height=420');
}

export function shareOnWhatsApp(data: ShareData): void {
  const text = generateShareText(data);
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/?text=${encodedText}`;
  window.open(url, '_blank');
}