# Frontend Integration Guide

This guide shows you how to connect your React frontend to the deployed backend.

## Step 1: Environment Configuration

Create a `.env` file in your **frontend** directory:

```bash
# frontend/.env
VITE_API_URL=https://your-backend.vercel.app/api
```

For local development, create `.env.development`:

```bash
# frontend/.env.development
VITE_API_URL=http://localhost:3001/api
```

For production, create `.env.production`:

```bash
# frontend/.env.production
VITE_API_URL=https://your-backend.vercel.app/api
```

## Step 2: Create API Utility

Create `frontend/src/lib/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
  joinYear: number;
  photo?: string;
  email?: string;
  phone?: string;
  responsibilities?: string[];
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(password: string): Promise<{ success: boolean; token: string }> {
    const result = await this.request<{ success: boolean; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ password }),
      }
    );
    
    if (result.success && result.token) {
      this.token = result.token;
      localStorage.setItem('authToken', result.token);
    }
    
    return result;
  }

  async verify(): Promise<{ success: boolean; isAdmin: boolean }> {
    return this.request('/auth/verify');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Member methods
  async getMembers(): Promise<Member[]> {
    return this.request('/members');
  }

  async getMember(id: string): Promise<Member> {
    return this.request(`/members/${id}`);
  }

  async createMember(member: Partial<Member>): Promise<Member> {
    return this.request('/members', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }

  async updateMember(id: string, data: Partial<Member>): Promise<Member> {
    return this.request(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMember(id: string): Promise<{ success: boolean }> {
    return this.request(`/members/${id}`, {
      method: 'DELETE',
    });
  }

  async resetMembers(): Promise<{ success: boolean; count: number }> {
    return this.request('/members/reset', {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const api = new ApiClient(API_URL);
```

## Step 3: Update AuthContext

Update `frontend/src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await api.verify();
        setIsAdmin(result.isAdmin);
      } catch (error) {
        setIsAdmin(false);
        api.logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const result = await api.login(password);
      setIsAdmin(result.success);
      return result.success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    api.logout();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Step 4: Update Members Page

Update `frontend/src/pages/Members.tsx` to use the API:

```typescript
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
// ... other imports

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // ... other state

  // Load members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const data = await api.getMembers();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load members');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleSaveMember = async (memberData: Partial<Member>) => {
    try {
      if (editingMember) {
        const updated = await api.updateMember(editingMember.id, memberData);
        setMembers(members.map((m) => (m.id === updated.id ? updated : m)));
        toast.success("Member updated successfully!");
      } else {
        const newMember = await api.createMember(memberData);
        setMembers([...members, newMember]);
        toast.success("Member added successfully!");
      }
      setFormModalOpen(false);
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Failed to save member');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await api.deleteMember(memberId);
      setMembers(members.filter((m) => m.id !== memberId));
      toast.success("Member deleted successfully!");
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  const handleResetData = async () => {
    if (confirm('Are you sure you want to reset all member data to default?')) {
      try {
        await api.resetMembers();
        const data = await api.getMembers();
        setMembers(data);
        toast.success("Member data reset to default!");
      } catch (error) {
        console.error('Error resetting members:', error);
        toast.error('Failed to reset members');
      }
    }
  };

  // ... rest of the component
};
```

## Step 5: Update AdminLogin Page

Update `frontend/src/pages/AdminLogin.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
// ... other imports

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  if (isAdmin) {
    navigate('/members');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(password);
      
      if (success) {
        toast.success('Login successful!');
        navigate('/members');
      } else {
        toast.error('Invalid password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component
};
```

## Step 6: Test the Integration

1. **Start the backend** (if running locally):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test functionality**:
   - Visit frontend at `http://localhost:5173`
   - View members (should load from backend)
   - Login as admin
   - Create/edit/delete members
   - Check browser console for any errors

## Step 7: Deploy Both Frontend and Backend

### Backend First:
```bash
cd backend
vercel --prod
```

Note the production URL (e.g., `https://fest-backend.vercel.app`)

### Update Frontend Environment:
```bash
# frontend/.env.production
VITE_API_URL=https://fest-backend.vercel.app/api
```

### Deploy Frontend:
```bash
cd frontend
vercel --prod
```

## Common Issues & Solutions

### Issue: CORS Error

**Solution:** Ensure backend has CORS enabled (already done in `api/index.js`)

### Issue: 401 Unauthorized

**Solution:** Check that token is being sent in Authorization header

### Issue: Environment variables not working

**Solution:** 
- Restart dev server after changing `.env`
- In Vite, variables must start with `VITE_`
- Use `import.meta.env.VITE_API_URL`, not `process.env`

### Issue: Network request failed

**Solution:** 
- Check backend is running
- Verify API URL is correct
- Check browser console for details

## Testing Checklist

- [ ] Members load from backend
- [ ] Admin login works
- [ ] Create member works
- [ ] Edit member works
- [ ] Delete member works
- [ ] Reset members works
- [ ] Logout works
- [ ] Unauthorized access blocked
- [ ] Error messages display correctly
- [ ] Loading states work

## Next Steps

1. ✅ Test locally with backend
2. ⬜ Deploy backend to Vercel
3. ⬜ Update frontend environment variables
4. ⬜ Test frontend with deployed backend
5. ⬜ Deploy frontend to Vercel
6. ⬜ Test production deployment

Happy integrating! 🚀
