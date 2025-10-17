# 🚀 Quick Start Guide

## Getting Started in 5 Minutes

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Run the Server Locally

```bash
npm run dev
```

You should see:
```
Server running on port 3001
```

### 3. Test the API

Open a new terminal and run:

```bash
# Make the test script executable (first time only)
chmod +x test-api.sh

# Run tests
./test-api.sh
```

Or test manually:

```bash
# Health check
curl http://localhost:3001/api/health

# Get members
curl http://localhost:3001/api/members

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

## What's Included

✅ **Express.js Backend** - Fast and minimal Node.js framework  
✅ **RESTful API** - Clean and organized endpoints  
✅ **Authentication** - Simple admin login system  
✅ **CORS Enabled** - Ready to connect with your frontend  
✅ **Vercel Ready** - Deploy in seconds with zero config  
✅ **In-Memory Storage** - Works out of the box (easily upgradeable to database)

## API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/auth/verify` | Verify token | Yes |
| GET | `/api/members` | Get all members | No |
| GET | `/api/members/:id` | Get member by ID | No |
| POST | `/api/members` | Create member | Yes |
| PUT | `/api/members/:id` | Update member | Yes |
| DELETE | `/api/members/:id` | Delete member | Yes |
| POST | `/api/members/reset` | Reset to defaults | Yes |

## Default Credentials

- **Admin Password:** `admin123`

⚠️ **Change this before deploying to production!**

## Project Structure

```
backend/
├── api/
│   └── index.js          # Main API file (serverless function)
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── vercel.json          # Vercel deployment config
├── README.md            # Detailed documentation
├── DEPLOYMENT_GUIDE.md  # Step-by-step deployment
├── QUICK_START.md       # This file!
└── test-api.sh          # API testing script
```

## Next Steps

### Option A: Continue Development Locally

1. Keep the server running (`npm run dev`)
2. Make changes to `api/index.js`
3. Test with `./test-api.sh` or your frontend
4. Commit changes to Git

### Option B: Deploy to Vercel Now

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## Upgrading to a Database

Currently using in-memory storage. To upgrade:

### MongoDB (Recommended for Vercel)

1. **Create free MongoDB Atlas cluster:**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create account and cluster
   - Get connection string

2. **Install Mongoose:**
   ```bash
   npm install mongoose
   ```

3. **Update `api/index.js`:**
   ```javascript
   import mongoose from 'mongoose';
   
   // Connect to MongoDB
   mongoose.connect(process.env.MONGODB_URI);
   
   // Define Member schema
   const memberSchema = new mongoose.Schema({
     name: String,
     role: String,
     bio: String,
     joinYear: Number,
     email: String,
     phone: String,
     responsibilities: [String]
   });
   
   const Member = mongoose.model('Member', memberSchema);
   
   // Replace array operations with database queries
   app.get('/api/members', async (req, res) => {
     const members = await Member.find();
     res.json(members);
   });
   ```

4. **Add to Vercel environment variables:**
   ```
   MONGODB_URI=your_connection_string
   ```

### PostgreSQL with Vercel Postgres

1. **Install in Vercel Dashboard:**
   - Go to your project → Storage → Create Database
   - Select Postgres

2. **Install pg:**
   ```bash
   npm install pg
   ```

3. **Update code to use SQL queries**

## Customization

### Change Admin Password

**Option 1: Environment Variable (Recommended)**
```bash
# Create .env file
echo "ADMIN_PASSWORD=your_secure_password" > .env
```

**Option 2: In Vercel Dashboard**
- Project Settings → Environment Variables
- Add `ADMIN_PASSWORD` with your secure password

### Add New Endpoints

Edit `api/index.js`:

```javascript
// Add new endpoint
app.get('/api/custom-endpoint', (req, res) => {
  res.json({ message: 'Your custom response' });
});
```

### Enable Request Logging

```javascript
// Add after app initialization
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

## Troubleshooting

### Port already in use
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

### Module not found
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors from frontend
The backend already has CORS enabled. If you still get errors:

```javascript
// In api/index.js, update CORS config
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

## Tips & Best Practices

1. **Always use environment variables** for sensitive data
2. **Test locally** before deploying
3. **Keep dependencies updated**: `npm update`
4. **Monitor Vercel logs** after deployment
5. **Use database** for production (not in-memory storage)
6. **Implement rate limiting** for security
7. **Add input validation** (e.g., with Zod or Joi)

## Resources

- 📚 [Express.js Documentation](https://expressjs.com/)
- 🚀 [Vercel Documentation](https://vercel.com/docs)
- 🔐 [JWT Authentication Guide](https://jwt.io/introduction)
- 🗄️ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Support

Questions or issues?

- 📧 Email: santoshhiretanad292@gmail.com
- 📱 Phone: +91 9972433292

Happy coding! 🎉
