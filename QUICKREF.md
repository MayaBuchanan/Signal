# Quick Reference - Signal App Commands

## 🚀 Development

### Start Everything (3 terminals)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - MongoDB (if local):**
```bash
brew services start mongodb-community
```

### Build for Production

**Frontend:**
```bash
npm run build
# Output: dist/
```

**Backend:**
```bash
cd server
npm run build
# Output: server/dist/
```

## 🗄️ MongoDB Commands

```bash
# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# Check status
brew services list | grep mongodb

# Connect to MongoDB shell
mongosh

# View databases
mongosh --eval "show dbs"

# Drop Signal database (CAUTION!)
mongosh signal-db --eval "db.dropDatabase()"
```

## 🔑 Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🧹 Clean & Reinstall

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd server
rm -rf node_modules package-lock.json
npm install
```

## 🐛 Debug Commands

```bash
# Check ports in use
lsof -i :3001  # Backend
lsof -i :5173  # Frontend
lsof -i :27017 # MongoDB

# Kill process on port
lsof -ti:3001 | xargs kill

# View backend logs with MongoDB
cd server && npm run dev 2>&1 | tee app.log

# Test backend health
curl http://localhost:3001/health

# Test backend auth
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

## 📦 Package Management

```bash
# Update dependencies
npm update
cd server && npm update

# Check for outdated packages
npm outdated
cd server && npm outdated

# Audit security
npm audit
npm audit fix
```

## 🔍 Useful Aliases (Add to ~/.zshrc)

```bash
# Add these to your ~/.zshrc
alias signal-dev="cd ~/Desktop/Signal && npm run dev"
alias signal-server="cd ~/Desktop/Signal/server && npm run dev"
alias signal-mongo="brew services start mongodb-community"
alias signal-clean="cd ~/Desktop/Signal && rm -rf node_modules && cd server && rm -rf node_modules && cd .."
```

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/health
- **MongoDB:** mongodb://localhost:27017/signal-db

## 📁 Important Files

### Configuration
- `/.env` - Frontend environment variables
- `/server/.env` - Backend environment variables
- `/tsconfig.json` - Frontend TypeScript config
- `/server/tsconfig.json` - Backend TypeScript config

### Entry Points
- `/src/main.tsx` - Frontend entry
- `/server/src/server.ts` - Backend entry
- `/index.html` - HTML entry

## 🔐 API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Relationships
- `GET /api/relationships` - List all
- `GET /api/relationships/:id` - Get one
- `POST /api/relationships` - Create
- `PUT /api/relationships/:id` - Update
- `DELETE /api/relationships/:id` - Delete

### Interactions
- `GET /api/interactions` - List all
- `GET /api/interactions/relationship/:id` - List by relationship
- `POST /api/interactions` - Create
- `PUT /api/interactions/:id` - Update
- `DELETE /api/interactions/:id` - Delete

## ⚡ Hot Tips

1. **Auto-restart backend:** Already enabled with `tsx watch`
2. **Auto-reload frontend:** Already enabled with Vite HMR
3. **View logs:** All console.log() in backend shows in terminal
4. **Debug frontend:** Open browser DevTools (Cmd+Option+I)
5. **MongoDB GUI:** Use [MongoDB Compass](https://www.mongodb.com/products/compass)

## 🎯 Common Tasks

### Reset All Data
```bash
mongosh signal-db --eval "db.dropDatabase()"
# Then refresh browser and re-register
```

### Test with cURL
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login (save the token)
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Create relationship
curl -X POST http://localhost:3001/api/relationships \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"John Doe","organization":"Acme Corp","stage":"Active"}'
```

### Environment Setup
```bash
# Copy example files
cp .env.example .env
cp server/.env.example server/.env

# Edit with your values
nano .env
nano server/.env
```

---

**Quick Start:** `cd server && npm run dev` + `npm run dev` in separate terminals + MongoDB running
