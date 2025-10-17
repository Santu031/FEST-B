import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection - Optimized for Vercel Serverless
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fest';

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = db;
    console.log('✅ Connected to MongoDB');
    
    // Initialize database after connection
    await initializeDatabase();
    
    return db;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

// Member Schema
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  joinYear: { type: Number, required: true },
  photo: String,
  email: String,
  phone: String,
  responsibilities: [String],
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  category: { type: String, required: true },
  uploadedBy: { type: String, required: true }, // Admin who uploaded
  uploadedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

// Default members data for initialization
const defaultMembers = [
  {
    name: "Rajesh Kumar",
    role: "Coordinator",
    bio: "Leading the festival organization for over 10 years with dedication and devotion to Lord Ganesha.",
    joinYear: 2014,
    photo: "/images/DSC_0770.jpg",
    email: "rajesh@balagha.org",
    phone: "+91 98765 43210",
    responsibilities: [
      "Overall festival coordination and planning",
      "Managing volunteer teams",
      "Liaison with local authorities and sponsors",
      "Budget oversight and resource allocation",
    ],
  },
  {
    name: "Priya Sharma",
    role: "Cultural Organizer",
    bio: "Passionate about preserving traditional arts and organizing cultural programs for the community.",
    joinYear: 2016,
    email: "priya@balagha.org",
    phone: "+91 98765 43211",
    responsibilities: [
      "Planning cultural events and performances",
      "Coordinating with artists and performers",
      "Managing stage setup and decorations",
      "Organizing traditional rituals and ceremonies",
    ],
  },
  {
    name: "Amit Patel",
    role: "Sound Lead",
    bio: "Expert in audio systems and ensuring perfect sound quality for all devotional programs.",
    joinYear: 2018,
    email: "amit@balagha.org",
    phone: "+91 98765 43212",
    responsibilities: [
      "Sound system setup and maintenance",
      "Managing audio for all events",
      "Coordinating with technical vendors",
      "Ensuring quality of devotional music playback",
    ],
  },
  {
    name: "Sneha Desai",
    role: "Volunteer",
    bio: "Dedicated volunteer helping with daily operations and community engagement activities.",
    joinYear: 2020,
    email: "sneha@balagha.org",
    phone: "+91 98765 43213",
    responsibilities: [
      "Assisting in daily festival operations",
      "Managing volunteer schedules",
      "Helping with crowd management",
      "Supporting decoration and setup teams",
    ],
  },
  {
    name: "Vikram Singh",
    role: "Logistics Manager",
    bio: "Ensuring smooth operations by managing supplies, vendors, and logistical arrangements.",
    joinYear: 2017,
    email: "vikram@balagha.org",
    phone: "+91 98765 43214",
    responsibilities: [
      "Managing supplies and inventory",
      "Coordinating with vendors and suppliers",
      "Transportation and delivery logistics",
      "Ensuring timely availability of resources",
    ],
  },
];

// Initialize database with default members if empty
const initializeDatabase = async () => {
  try {
    const count = await Member.countDocuments();
    if (count === 0) {
      await Member.insertMany(defaultMembers);
      console.log('✅ Database initialized with default members');
    } else {
      console.log(`📊 Database already has ${count} members`);
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  }
};

// Admin password (in production, use environment variables and proper authentication)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware to check admin authentication
const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const password = authHeader.substring(7);
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  next();
};

// Routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ status: 'ok', message: 'Backend is running', db: 'connected' });
  } catch (error) {
    res.json({ status: 'ok', message: 'Backend is running', db: 'disconnected' });
  }
});

// Auth - Login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  
  if (password === ADMIN_PASSWORD) {
    return res.json({ 
      success: true, 
      token: password, // In production, generate a proper JWT token
      message: 'Login successful' 
    });
  }
  
  return res.status(401).json({ error: 'Invalid password' });
});

// Auth - Verify
app.get('/api/auth/verify', isAdmin, (req, res) => {
  res.json({ success: true, isAdmin: true });
});

// Members - Get all
app.get('/api/members', async (req, res) => {
  try {
    await connectDB();
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members', details: error.message });
  }
});

// Members - Get by ID
app.get('/api/members/:id', async (req, res) => {
  try {
    await connectDB();
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Members - Create (Admin only)
app.post('/api/members', isAdmin, async (req, res) => {
  try {
    await connectDB();
    // Validate required fields
    if (!req.body.name || !req.body.role || !req.body.joinYear) {
      return res.status(400).json({ 
        error: 'Name, role, and joinYear are required' 
      });
    }
    
    const newMember = new Member(req.body);
    await newMember.save();
    
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// Members - Update (Admin only)
app.put('/api/members/:id', isAdmin, async (req, res) => {
  try {
    await connectDB();
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedMember) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// Members - Delete (Admin only)
app.delete('/api/members/:id', isAdmin, async (req, res) => {
  try {
    await connectDB();
    const deleted = await Member.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json({ success: true, deleted });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

// Members - Reset to default (Admin only)
app.post('/api/members/reset', isAdmin, async (req, res) => {
  try {
    await connectDB();
    // Delete all existing members
    await Member.deleteMany({});
    
    // Insert default members
    const newMembers = await Member.insertMany(defaultMembers);
    
    res.json({ 
      success: true, 
      message: 'Members reset to default', 
      count: newMembers.length 
    });
  } catch (error) {
    console.error('Error resetting members:', error);
    res.status(500).json({ error: 'Failed to reset members' });
  }
});

// Gallery - Get all
app.get('/api/gallery', async (req, res) => {
  try {
    await connectDB();
    const photos = await Gallery.find().sort({ uploadedAt: -1 });
    res.json(photos);
  } catch (error) {
    console.error('Error fetching gallery photos:', error);
    res.status(500).json({ error: 'Failed to fetch gallery photos' });
  }
});

// Gallery - Upload (Admin only)
app.post('/api/gallery', isAdmin, async (req, res) => {
  try {
    await connectDB();
    const { src, alt, category } = req.body;
    
    // Validate required fields
    if (!src || !alt || !category) {
      return res.status(400).json({ 
        error: 'src, alt, and category are required' 
      });
    }
    
    const newPhoto = new Gallery({
      src,
      alt,
      category,
      uploadedBy: 'admin' // In a real app, this would be the admin's ID or name
    });
    
    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Gallery - Delete (Admin only)
app.delete('/api/gallery/:id', isAdmin, async (req, res) => {
  try {
    await connectDB();
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    res.json({ success: true, deleted });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// For Vercel serverless function
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}