# 🎯 Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment Checklist

### ✅ Code Preparation

- [ ] All files are in the `backend` directory
- [ ] `package.json` exists with correct dependencies
- [ ] `vercel.json` is configured properly
- [ ] `api/index.js` exports the Express app as default
- [ ] All dependencies are listed in `package.json`
- [ ] Code tested locally (run `npm run dev`)
- [ ] API endpoints tested (run `./test-api.sh`)

### ✅ Security

- [ ] Change `ADMIN_PASSWORD` from default
- [ ] No sensitive data hardcoded in files
- [ ] `.env` file is in `.gitignore`
- [ ] Environment variables ready for Vercel

### ✅ Git Setup

- [ ] Git repository initialized
- [ ] `.gitignore` includes `node_modules`, `.env`, `.vercel`
- [ ] All changes committed
- [ ] Pushed to GitHub (if using GitHub method)

## Deployment Steps

### Method 1: Vercel CLI (Recommended)

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Navigate to backend: `cd backend`
- [ ] Deploy: `vercel`
- [ ] Set environment variables: `vercel env add ADMIN_PASSWORD`
- [ ] Deploy to production: `vercel --prod`

### Method 2: GitHub + Vercel Dashboard

- [ ] Push code to GitHub
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click "Import Project"
- [ ] Select repository
- [ ] Set root directory to `backend` (if needed)
- [ ] Add environment variables
- [ ] Click "Deploy"

## Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] Deployment completed without errors
- [ ] Check deployment logs in Vercel Dashboard
- [ ] Visit deployment URL
- [ ] Test health endpoint: `https://your-app.vercel.app/api/health`
- [ ] Test members endpoint: `https://your-app.vercel.app/api/members`
- [ ] Test login endpoint with curl or Postman

### ✅ Environment Variables

- [ ] `ADMIN_PASSWORD` is set in Vercel
- [ ] Variables are set for Production environment
- [ ] Test login with new password

### ✅ Testing

Run these commands (replace URL with your actual deployment URL):

```bash
# Set your deployment URL
export API_URL=https://your-app.vercel.app/api

# Health check
curl $API_URL/health

# Get members
curl $API_URL/members

# Test login
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_password"}'
```

- [ ] Health check returns `{"status":"ok"}`
- [ ] Members endpoint returns array of members
- [ ] Login works with correct password
- [ ] Login fails with wrong password
- [ ] Protected endpoints require authentication

## Integration with Frontend

### ✅ Frontend Configuration

- [ ] Create `.env` in frontend directory
- [ ] Add `VITE_API_URL=https://your-backend.vercel.app/api`
- [ ] Update API calls to use environment variable
- [ ] Test frontend with deployed backend
- [ ] CORS working properly
- [ ] All API calls successful

## Optional Enhancements

### Database Integration (Recommended for Production)

- [ ] Choose database (MongoDB, PostgreSQL, etc.)
- [ ] Set up database service (MongoDB Atlas, Vercel Postgres)
- [ ] Install database client package
- [ ] Update code to use database
- [ ] Add database connection string to environment variables
- [ ] Test database connection
- [ ] Migrate initial data to database

### Security Improvements

- [ ] Implement JWT authentication (instead of simple password)
- [ ] Add rate limiting (e.g., express-rate-limit)
- [ ] Add input validation (e.g., Zod, Joi)
- [ ] Implement request logging
- [ ] Add helmet.js for security headers
- [ ] Set up HTTPS (automatic with Vercel)

### Monitoring & Logging

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure logging service
- [ ] Set up uptime monitoring
- [ ] Configure alerts for errors

## Troubleshooting Common Issues

### Build Fails

- **Check:** `package.json` is present and valid
- **Check:** All dependencies are listed correctly
- **Check:** Node version compatibility (use LTS version)
- **Fix:** Review build logs in Vercel Dashboard

### Function Timeout

- **Check:** Functions complete within 10s (free tier limit)
- **Fix:** Optimize slow operations
- **Fix:** Consider upgrading Vercel plan

### Environment Variables Not Working

- **Check:** Variables are set for correct environment (Production)
- **Check:** Variable names match exactly (case-sensitive)
- **Fix:** Redeploy after adding variables

### CORS Errors

- **Check:** CORS is enabled in `api/index.js`
- **Check:** Frontend URL is allowed
- **Fix:** Update CORS configuration:
  ```javascript
  app.use(cors({
    origin: ['https://your-frontend.vercel.app'],
    credentials: true
  }));
  ```

### 404 on API Routes

- **Check:** Routes start with `/api/`
- **Check:** `vercel.json` routing is correct
- **Fix:** Verify route configuration

## Deployment URLs

Keep track of your deployment URLs:

**Backend:**
- Development: `http://localhost:3001`
- Production: `https://_____________________.vercel.app`

**Frontend:**
- Development: `http://localhost:5173`
- Production: `https://_____________________.vercel.app`

## Contact & Support

- 📧 Email: santoshhiretanad292@gmail.com
- 📱 Phone: +91 9972433292

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated:** $(date +%Y-%m-%d)

✨ **Pro Tip:** Bookmark this checklist and use it for every deployment!
