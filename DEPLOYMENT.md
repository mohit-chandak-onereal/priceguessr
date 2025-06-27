# 🚀 Deployment Guide for PriceGuessr

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository (✅ Already set up)
- Vercel account (free at vercel.com)
- Environment variables ready

### Step 1: Import Project to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your repository: `mohit-chandak-onereal/priceguessr`
4. Click "Import"

### Step 2: Configure Project

Vercel will auto-detect Next.js. Confirm these settings:
- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 3: Add Environment Variables

Click "Environment Variables" and add:

| Variable Name | Value | Required |
|--------------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes* |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service key | Yes* |
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes* |

*For initial deployment, you can use placeholder values and update later.

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for the build
3. Your app will be live at `https://priceguessr.vercel.app` (or similar)

### Step 5: Configure Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Post-Deployment

### Automatic Deployments
- Every push to `main` branch triggers a new deployment
- Pull requests get preview deployments

### Environment Variables Update
1. Go to Project Settings → Environment Variables
2. Update any variable
3. Redeploy from Deployments tab

### Monitoring
- Check Function logs for API errors
- Monitor Analytics for usage
- Set up Speed Insights (free tier available)

## Current Deployment Status

As of now, the app will show:
- ✅ Dark themed Next.js page
- ✅ Custom metadata (PriceGuessr title)
- ✅ Proper project structure
- ⏳ Game features (coming soon)

## Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Environment Variables
- Double-check no trailing spaces
- Ensure NEXT_PUBLIC_ prefix for client-side vars
- Redeploy after changing variables

### Performance
- Enable Vercel Analytics
- Use Image Optimization
- Monitor Core Web Vitals

## Next Steps After Deployment

1. **Add Supabase Integration**
   - Create Supabase project
   - Add real environment variables
   - Set up database tables

2. **Configure Gemini AI**
   - Get API key from Google AI Studio
   - Add to environment variables
   - Test hint generation

3. **Custom Domain**
   - Purchase domain (if needed)
   - Configure in Vercel
   - Set up SSL (automatic)

---

Need help? Check [Vercel Docs](https://vercel.com/docs) or the project README.