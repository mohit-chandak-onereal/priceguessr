# 🎮 PriceGuessr

A browser-based price guessing game where players have 6 attempts to guess item prices within 5% using progressive hints. Think Wordle meets The Price is Right!

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/priceguessr.git
cd priceguessr
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials:
- Supabase URL and keys
- Google Gemini API key

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🎯 Game Features

### Core Mechanics
- **6 Attempts**: Guess the price within 5% to win
- **Progressive Hints**: Each wrong guess reveals new clues
- **Multiple Categories**: Houses, Cars, Watches, Fashion, Art, and more
- **Score Labels**: From "Price Whisperer" 🎯 to "Wildly Off" 🎪

### Hint System (Progressive)
1. **Guess 1**: Blurred/ambiguous photo only
2. **Guess 2**: Different angle photo
3. **Guess 3**: Basic metadata (location, year, brand initial)
4. **Guess 4**: AI-generated clue
5. **Guess 5**: Detailed photo + full specs
6. **Guess 6**: Direct hint

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Database**: PostgreSQL via Supabase
- **AI**: Google Gemini API for dynamic hints
- **Auth**: Supabase Auth
- **Hosting**: Vercel

## 📁 Project Structure

```
priceguessr/
├── app/              # Next.js app router pages
├── components/       # React components
├── contexts/         # React contexts (theme)
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configurations
│   ├── database.ts  # Database helpers
│   ├── mock-data.ts # Mock data for testing
│   └── supabase.ts  # Supabase client
├── types/           # TypeScript type definitions
└── design-system.json # Design tokens
```

## 🎨 Features Implemented

### Phase 1-3 ✅
- Dark theme with CSS variables (light theme ready)
- Type-safe database layer
- Mock data for development
- Theme system with next-themes
- Comprehensive TypeScript interfaces

### Coming Soon
- Game state management
- UI components (PhotoViewer, GuessInput, etc.)
- API routes
- Real-time features
- Daily challenges
- Leaderboards

## 🚀 Deployment

The app is configured for easy deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 🔐 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and TypeScript