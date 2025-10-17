# FEST Backend API

Simple Express.js backend for the FEST festival management application, optimized for Vercel deployment.

## Features

- 🔐 Simple authentication system
- 👥 Members CRUD operations
- 🚀 Serverless-ready for Vercel
- 🗄️ MongoDB Atlas integration (permanent storage)
- 💾 Auto-initialization with default data
- 📦 In-memory fallback option

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication

**Login**
```
POST /api/auth/login
Body: { "password": "admin123" }
```

**Verify Token**
```
GET /api/auth/verify
Headers: { "Authorization": "Bearer <password>" }
```

### Members

**Get all members**
```
GET /api/members
```

**Get member by ID**
```
GET /api/members/:id
```

**Create member** (Admin only)
```
POST /api/members
Headers: { "Authorization": "Bearer <password>" }
Body: {
  "name": "John Doe",
  "role": "Volunteer",
  "bio": "Description",
  "joinYear": 2024,
  "email": "john@example.com",
  "phone": "+91 1234567890",
  "responsibilities": ["Task 1", "Task 2"]
}
```

**Update member** (Admin only)
```
PUT /api/members/:id
Headers: { "Authorization": "Bearer <password>" }
Body: { "name": "Updated Name", ... }
```

**Delete member** (Admin only)
```
DELETE /api/members/:id
Headers: { "Authorization": "Bearer <password>" }
```

**Reset to default members** (Admin only)
```
POST /api/members/reset
Headers: { "Authorization": "Bearer <password>" }
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
PORT=3001
ADMIN_PASSWORD=admin123
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fest
```

**Note:** See [`MONGODB_SETUP.md`](MONGODB_SETUP.md) for MongoDB Atlas setup instructions.

3. Run the server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Deploy to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd backend
vercel
```

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your repository
5. Set root directory to `backend`
6. Add environment variables:
   - `ADMIN_PASSWORD=your_secure_password`
7. Deploy!

### Environment Variables (Vercel)

Set these in your Vercel project settings:

- `ADMIN_PASSWORD` - Your admin password (default: admin123)
- `MONGODB_URI` - Your MongoDB Atlas connection string (required)
- `NODE_ENV` - Set to `production`

**See [`MONGODB_SETUP.md`](MONGODB_SETUP.md) for getting your MongoDB connection string.**

## Security Notes

⚠️ **Important for Production:**

1. **Change the default password** - Set a strong `ADMIN_PASSWORD` in environment variables
2. **Use a database** - Replace in-memory storage with MongoDB, PostgreSQL, or another database
3. **Implement proper JWT authentication** - Replace simple password tokens with JWT
4. **Add rate limiting** - Protect against brute force attacks
5. **Enable HTTPS** - Vercel provides this by default
6. **Add input validation** - Use libraries like Joi or Zod
7. **Add logging** - Implement proper logging for monitoring

## Database Setup

This backend uses **MongoDB Atlas** for permanent data storage.

### Quick Setup:

1. Create free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas/register
2. Create M0 (FREE) cluster
3. Get connection string
4. Add to `.env` and Vercel environment variables

**👉 Full guide:** [`MONGODB_SETUP.md`](MONGODB_SETUP.md)

### Fallback:

If `MONGODB_URI` is not set, the backend will use in-memory storage (data won't persist).

## Contact

For issues or questions, contact: santoshhiretanad292@gmail.com
