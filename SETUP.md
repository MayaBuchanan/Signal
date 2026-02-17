# Signal - Setup Guide

Complete setup instructions for the Signal app with cloud sync.

## 🚀 Quick Start (Fastest)

If you just want to get the app running ASAP:

```bash
# Terminal 1: Start Backend
cd server
npm install
npm run dev

# Terminal 2: Start Frontend  
npm install
npm run dev
```

Then open http://localhost:5173 and register!

**Note:** This uses a temporary in-memory MongoDB. For persistent data, follow the full setup below.

## 📋 Full Setup (Recommended)

### Step 1: Install MongoDB

#### Option A: Local MongoDB (macOS)
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb
```

#### Option B: MongoDB Atlas (Cloud - Recommended for production)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Add your IP to the whitelist (or use 0.0.0.0/0 for development)

### Step 2: Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

Update `.env` with your values:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/signal-db  # or your MongoDB Atlas URI
JWT_SECRET=your-super-secret-random-string-here-change-this
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a secure random string!

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the backend:
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 3001
```

### Step 3: Frontend Setup

```bash
# From the root directory
npm install

# Copy environment template
cp .env.example .env

# Edit .env if needed (default should work)
nano .env
```

The default `.env` should work:
```env
VITE_API_URL=http://localhost:3001/api
```

Start the frontend:
```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
```

### Step 4: Open the App

1. Open http://localhost:5173
2. Click "Register" tab
3. Create your account:
   - Name: Your Name
   - Email: your@email.com
   - Password: (at least 6 characters)
4. Start adding relationships!

## ✅ Verification Checklist

- [ ] MongoDB is running (check `brew services list` or MongoDB Atlas dashboard)
- [ ] Backend server is running on port 3001
- [ ] Frontend is running on port 5173
- [ ] You can register a new account
- [ ] You can login with your account
- [ ] You can add a relationship
- [ ] Data persists after refresh
- [ ] Sync button works

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error:** "MongoDB connection error"

**Solutions:**
- **Local MongoDB:** Run `brew services start mongodb-community`
- **Check if running:** `brew services list | grep mongodb`
- **MongoDB Atlas:** Verify connection string and IP whitelist
- **Port conflict:** Check if port 27017 is in use

### Backend Won't Start

**Error:** "Port 3001 already in use"

**Solution:**
```bash
# Find and kill the process using port 3001
lsof -ti:3001 | xargs kill

# Or use a different port in server/.env
PORT=3002
```

### Frontend Can't Connect to Backend

**Error:** Network error or 404

**Solutions:**
- Verify backend is running on port 3001
- Check `VITE_API_URL` in `.env`
- Open http://localhost:3001/health in browser (should show `{"status":"ok"}`)
- Check browser console for errors

### Authentication Errors

**Error:** "Invalid authentication token"

**Solutions:**
- Clear browser localStorage: Open DevTools → Application → Local Storage → Delete all
- Logout and login again
- Verify `JWT_SECRET` is set in `server/.env`
- Check that you're logged in

### Data Not Syncing

**Solutions:**
- Click the "Sync" button manually
- Check network tab for failed API calls
- Verify you're logged in
- Check backend logs for errors

### TypeScript Errors

**Solution:**
```bash
# Frontend
npm run build

# Backend
cd server
npm run build
```

## 🎯 Next Steps

Once everything is running:

1. **Add Test Data:**
   - Create 3-5 relationships
   - Add interactions to each
   - Check the Signal Board

2. **Test Cloud Sync:**
   - Add data
   - Logout
   - Login again
   - Verify data is still there

3. **Test Multi-Device (Optional):**
   - Login from another browser/device
   - Verify your data appears
   - Add data from second device
   - Click sync on first device

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 🆘 Still Having Issues?

Check the logs:

**Backend logs:** Look at the terminal where `npm run dev` is running

**Frontend logs:** Open browser DevTools → Console

**MongoDB logs:** 
```bash
# macOS
tail -f /usr/local/var/log/mongodb/mongo.log
```

---

Need help? The app is designed to be robust, but if you encounter issues, check the console logs first!
