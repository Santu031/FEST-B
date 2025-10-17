# Deploying FEST Backend to Vercel

## Prerequisites

- [Vercel Account](https://vercel.com/signup) (free)
- [Git](https://git-scm.com/) installed
- [GitHub Account](https://github.com) (recommended)

## Step-by-Step Deployment Guide

### Method 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to backend directory**
   ```bash
   cd backend
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name? `fest-backend` (or your choice)
   - Directory? `./` (current directory)
   - Override settings? `N`

5. **Set Environment Variables**
   ```bash
   vercel env add ADMIN_PASSWORD
   ```
   Enter your secure password when prompted.

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

7. **Your API is live!** 🎉
   You'll get a URL like: `https://fest-backend.vercel.app`

### Method 2: Deploy via GitHub + Vercel Dashboard

1. **Initialize Git** (if not already done)
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., `fest-backend`)
   - Don't initialize with README (we already have code)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/fest-backend.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset:** Other
     - **Root Directory:** Leave as `./` (or `backend` if you pushed the whole FEST folder)
     - **Build Command:** Leave empty or use `npm run build`
     - **Output Directory:** Leave empty
   
5. **Add Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add:
     - Name: `ADMIN_PASSWORD`
     - Value: Your secure password
     - Environment: All (Production, Preview, Development)
   
6. **Deploy!**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your API is live! 🎉

## Verifying Your Deployment

Test your API with these commands:

```bash
# Replace YOUR_DOMAIN with your actual Vercel domain
export API_URL=https://fest-backend.vercel.app

# Health check
curl $API_URL/api/health

# Get all members
curl $API_URL/api/members

# Login
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

## Connecting Frontend to Backend

Once deployed, update your frontend to use the backend API:

1. Create a `.env` file in your frontend directory:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

2. Create an API utility file (e.g., `src/lib/api.ts`):
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
   
   export const api = {
     async getMembers() {
       const response = await fetch(`${API_URL}/members`);
       return response.json();
     },
     
     async login(password: string) {
       const response = await fetch(`${API_URL}/auth/login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ password })
       });
       return response.json();
     },
     
     // Add more methods as needed
   };
   ```

## Troubleshooting

### Error: "Module not found"
- Ensure `package.json` is in the backend directory
- Run `npm install` locally first to verify dependencies

### Error: "Function timeout"
- Vercel free tier has 10s timeout
- Check if your functions are running efficiently

### CORS Issues
- The backend already has CORS enabled
- If issues persist, check your frontend URL in browser console

### 404 on API routes
- Verify `vercel.json` routing is correct
- Check that your routes start with `/api/`

## Environment Variables

After deployment, you can manage environment variables:

```bash
# Add new variable
vercel env add VARIABLE_NAME

# Remove variable
vercel env rm VARIABLE_NAME

# List all variables
vercel env ls
```

## Updating Your Deployment

### Via CLI:
```bash
cd backend
vercel --prod
```

### Via GitHub:
Just push to your main branch - Vercel auto-deploys!

```bash
git add .
git commit -m "Update API"
git push
```

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for DNS propagation (can take up to 48 hours)

## Monitoring

- **Logs:** View in Vercel Dashboard → Your Project → Deployments → Click deployment → Functions
- **Analytics:** Available in Vercel Dashboard (may require upgrade)
- **Status:** Check deployment status in dashboard

## Cost

- **Free Tier:** 
  - 100GB bandwidth/month
  - 100 hours serverless function execution
  - Unlimited deployments
  
This should be more than enough for most small to medium projects!

## Next Steps

1. ✅ Deploy backend to Vercel
2. ⬜ Update frontend to use backend API
3. ⬜ Deploy frontend to Vercel (separate project)
4. ⬜ Consider adding a database (MongoDB Atlas, PlanetScale, etc.)
5. ⬜ Implement proper JWT authentication
6. ⬜ Add rate limiting and security measures

## Support

If you encounter issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review deployment logs in Vercel Dashboard
- Contact: santoshhiretanad292@gmail.com

Good luck with your deployment! 🚀
