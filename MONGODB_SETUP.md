# 🗄️ MongoDB Atlas Setup Guide

Your backend is now configured to use MongoDB Atlas for permanent data storage! Follow these steps to complete the setup.

## ✅ What's Already Done

- ✅ Mongoose installed
- ✅ Backend code updated with MongoDB integration
- ✅ Database schema created
- ✅ All CRUD operations updated
- ✅ Auto-initialization with default members

## 🚀 Setup MongoDB Atlas (10 minutes)

### Step 1: Create MongoDB Atlas Account

1. **Visit:** https://www.mongodb.com/cloud/atlas/register

2. **Sign up** using one of these methods:
   - Google Account (fastest)
   - GitHub Account
   - Email

3. **Fill Organization Details:**
   - Organization Name: `FEST`
   - Project Name: `fest-backend`

### Step 2: Create FREE Database Cluster

1. **Choose Deployment Type:**
   - Click "Build a Database"
   - Select **M0 (FREE)** tier
   - Click "Create"

2. **Cloud Provider & Region:**
   - **Provider:** AWS (recommended)
   - **Region:** Choose closest to you:
     - 🇮🇳 India: `Mumbai (ap-south-1)`
     - 🇺🇸 USA: `N. Virginia (us-east-1)`
     - 🇪🇺 Europe: `Ireland (eu-west-1)`
   - **Cluster Name:** `fest-cluster` (or any name you like)
   - Click "Create Cluster"

### Step 3: Create Database User

**Security → Database Access → Add New Database User**

1. **Authentication Method:** Password
2. **Username:** `festadmin`
3. **Password:** Click "Autogenerate Secure Password" 
   - **IMPORTANT:** Copy and save this password!
   - Or create your own secure password

4. **Database User Privileges:** 
   - Select "Read and write to any database"

5. Click "Add User"

### Step 4: Configure Network Access

**Security → Network Access → Add IP Address**

1. Click "Add IP Address"
2. Click "**Allow Access from Anywhere**" (0.0.0.0/0)
   - This is required for Vercel serverless functions
   - In production, you can restrict to Vercel IPs

3. Click "Confirm"

### Step 5: Get Connection String

1. **Go to:** Database → Connect
2. Click "**Connect your application**"
3. **Driver:** Node.js
4. **Version:** Latest
5. **Copy the connection string:**

```
mongodb+srv://festadmin:<password>@fest-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **Replace `<password>`** with your actual password

**Example:**
```
mongodb+srv://festadmin:MySecurePass123@fest-cluster.abc12.mongodb.net/?retryWrites=true&w=majority
```

---

## 🔧 Configure Your Backend

### Local Development

Edit `/Users/santosh/Desktop/FEST/backend/.env`:

```env
PORT=3001
ADMIN_PASSWORD=admin123
NODE_ENV=development
MONGODB_URI=mongodb+srv://festadmin:YOUR_PASSWORD@fest-cluster.xxxxx.mongodb.net/fest?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_PASSWORD` with your actual MongoDB password
- `fest-cluster.xxxxx` with your actual cluster address

### Test Locally

```bash
cd /Users/santosh/Desktop/FEST/backend
npm run dev
```

You should see:
```
Server running on port 3001
✅ Connected to MongoDB
✅ Database initialized with default members
```

### Test API

```bash
curl http://localhost:3001/api/members
```

Should return array of members from MongoDB!

---

## 🌐 Deploy to Vercel with MongoDB

### Option 1: Vercel CLI (Fastest)

```bash
cd /Users/santosh/Desktop/FEST/backend

# Add MongoDB URI to Vercel
vercel env add MONGODB_URI

# When prompted, paste your connection string:
# mongodb+srv://festadmin:YOUR_PASSWORD@fest-cluster.xxxxx.mongodb.net/fest

# Select environments: Production, Preview, Development (all)

# Deploy
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add new variable:
   - **Name:** `MONGODB_URI`
   - **Value:** Your MongoDB connection string
   - **Environments:** Check all (Production, Preview, Development)
4. Click "Save"
5. Redeploy your project

---

## ✅ Verify Everything Works

### 1. Check Database in MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. You should see:
   - Database: `fest` (or `test`)
   - Collection: `members`
   - Documents: 5 default members

### 2. Test API Endpoints

```bash
# Set your Vercel URL
export API_URL=https://your-backend.vercel.app/api

# Get all members (should return 5 default members)
curl $API_URL/members

# Login as admin
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'

# Create a new member (use token from login)
curl -X POST $API_URL/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "name": "Test User",
    "role": "Tester",
    "bio": "Testing MongoDB",
    "joinYear": 2024,
    "email": "test@example.com"
  }'

# Check database again - you should see 6 members now!
```

---

## 🎯 What You Get with MongoDB

### ✅ Permanent Storage
- Data persists across server restarts
- Data survives redeployments
- No data loss

### ✅ Multi-Device Sync
- Same data across all devices
- Admin changes visible to everyone
- Real-time updates

### ✅ Scalability
- Handles thousands of members
- Auto-indexing for fast queries
- Built-in backups

### ✅ Professional Features
- Automatic timestamps (createdAt, updatedAt)
- Data validation
- Query optimization
- Atlas monitoring & alerts

---

## 📊 Database Schema

Your members are stored with this schema:

```javascript
{
  _id: ObjectId,                    // Auto-generated unique ID
  name: String (required),          // Member name
  role: String (required),          // Member role
  bio: String (required),           // Biography
  joinYear: Number (required),      // Year joined
  photo: String (optional),         // Photo URL
  email: String (optional),         // Email address
  phone: String (optional),         // Phone number
  responsibilities: [String],       // Array of responsibilities
  createdAt: Date,                  // Auto-generated
  updatedAt: Date,                  // Auto-updated
}
```

---

## 🔍 Managing Your Database

### View Data in Atlas

1. **MongoDB Atlas Dashboard** → Databases → Browse Collections
2. Select `fest` database → `members` collection
3. View, edit, or delete documents directly

### Using MongoDB Compass (Optional)

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect using your connection string
3. Visual interface for database management

### Backup & Restore

**Atlas automatically backs up your data:**
- Free tier: 1 day retention
- Paid tiers: Up to 7 days retention
- Manual backups available

---

## 🐛 Troubleshooting

### Connection Error: "MongooseServerSelectionError"

**Cause:** Can't connect to MongoDB

**Solutions:**
1. Check connection string is correct
2. Verify password doesn't have special characters (if it does, URL-encode them)
3. Ensure Network Access allows 0.0.0.0/0
4. Check database user exists and has correct permissions

### Error: "Authentication failed"

**Cause:** Wrong username or password

**Solutions:**
1. Double-check password in connection string
2. Recreate database user if needed
3. Ensure no extra spaces in `.env` file

### Data Not Persisting

**Cause:** Using local MongoDB instead of Atlas

**Solutions:**
1. Verify `MONGODB_URI` in `.env` starts with `mongodb+srv://`
2. Check environment variable in Vercel
3. Restart server after changing `.env`

### Vercel Deployment Fails

**Cause:** Missing environment variable

**Solutions:**
1. Add `MONGODB_URI` to Vercel environment variables
2. Redeploy after adding variables
3. Check Vercel logs for specific error

---

## 💡 Pro Tips

### 1. Monitor Your Database
- Atlas Dashboard → Metrics
- View queries, connections, storage usage
- Set up alerts for issues

### 2. Optimize Performance
- Add indexes for frequently queried fields
- Use `.lean()` for read-only queries
- Implement pagination for large datasets

### 3. Security Best Practices
- Rotate passwords regularly
- Use different passwords for dev/production
- Never commit `.env` to Git
- Use Vercel environment variables

### 4. Database Naming
Add database name to connection string:
```
mongodb+srv://user:pass@cluster.mongodb.net/fest?retryWrites=true
                                                 ^^^^
```

---

## 📈 Free Tier Limits

MongoDB Atlas Free Tier (M0):
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Unlimited read/write operations
- ✅ 100 max connections
- ✅ Perfect for small to medium projects

**Good for:**
- ~1,000-5,000 member records
- ~10,000+ API requests/day
- Development & testing
- Small production apps

---

## 🚀 Upgrade Path

When you need more:

**M2 Cluster** ($9/month):
- 2 GB storage
- 256 MB RAM
- Shared cluster

**M10 Cluster** ($57/month):
- 10 GB storage
- 2 GB RAM
- Dedicated cluster
- Automatic failover
- Advanced backups

---

## 🎓 Next Steps

1. ✅ Create MongoDB Atlas account
2. ✅ Get connection string
3. ✅ Update `.env` file
4. ✅ Test locally
5. ⬜ Add to Vercel environment variables
6. ⬜ Deploy to production
7. ⬜ Test live API
8. ⬜ Update frontend to use API

---

## 📞 Need Help?

- **MongoDB Docs:** https://www.mongodb.com/docs/atlas/
- **Mongoose Docs:** https://mongoosejs.com/docs/
- **Email:** santoshhiretanad292@gmail.com
- **Phone:** +91 9972433292

---

## ✨ Summary

You now have:
- ✅ MongoDB Atlas account (free)
- ✅ Permanent data storage
- ✅ Multi-device sync
- ✅ Scalable architecture
- ✅ Professional database
- ✅ Easy Vercel deployment

**Your data is now safe and persistent!** 🎉

Next: Add your MongoDB connection string to `.env` and deploy!
