'use client';

interface ItemImageProps {
  category: string;
}

export function ItemImage({ category }: ItemImageProps) {
  // For now, we'll use placeholder images
  // In production, these would be actual product images
  const placeholderColors = {
    'Houses': 'from-blue-bright to-sky-500',
    'Cars': 'from-red-bright to-orange-bright',
    'Watches': 'from-gray-600 to-gray-800',
    'Designer Fashion': 'from-pink-bright to-purple-bright',
    'Art': 'from-yellow-bright to-orange-bright',
    'Grocery Items': 'from-green-bright to-emerald-500',
  };

  const gradient = placeholderColors[category as keyof typeof placeholderColors] || 'from-gray-500 to-gray-700';

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-yellow-bright shadow-2xl">
      {/* Placeholder gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`} />
      
      {/* Blur overlay to simulate hidden image */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/10" />
      
      {/* Question mark overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-8xl md:text-9xl text-white/30 font-bold animate-pulse">
          ?
        </div>
      </div>
      
      {/* "Image Hidden" text */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
          <p className="text-yellow-bright font-bold text-sm">IMAGE HIDDEN</p>
          <p className="text-white/70 text-xs">Make guesses to reveal details</p>
        </div>
      </div>
    </div>
  );
}