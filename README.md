# Signal - Engagement & Relationship Insight Tool

A web application for tracking and managing professional relationships with engagement signals, interaction history, and **cloud synchronization across devices**.

## 🎯 Overview

Signal helps you track professional relationships, monitor engagement levels, and maintain detailed interaction histories. The app provides visual signals to help you identify which relationships need attention and which are thriving. **Now with user authentication and cloud sync** - access your data from anywhere!

## ✨ Features

### 1. **User Authentication & Cloud Sync** 🆕
- Secure user registration and login
- JWT-based authentication
- Cloud data storage with MongoDB
- Automatic sync across devices
- Access your data from anywhere
- Secure password hashing

### 2. **Relationships Management**
- Create, edit, and delete relationships
- Track key information: name, organization, industry, region, owner
- Add detailed notes for each relationship
- Filter by stage, industry, and search across all fields
- View relationships in an organized card grid
- **Auto-sync with cloud on all changes**

### 3. **Interaction Tracking**
- Log interactions with type (Call, Email, Meeting)
- Record outcome (Positive, Neutral, No Response)
- Capture tone (Energizing, Neutral, Draining)
- Add reflection notes for each interaction
- View chronological interaction timeline
- **Cloud backup of all interactions**

### 4. **Signal Board**
- Visual dashboard showing engagement strength
- Automatic signal calculation based on:
  - Interaction frequency (last 30 days)
  - Tone of interactions
  - Recency of last contact
- Four signal categories:
  - 💚 **Strong Signals** (Score 70+)
  - 💛 **Moderate Signals** (Score 40-69)
  - ❤️ **Weak Signals** (Score 0-39) - Needs attention
  - ⚪ **No Data** - No interactions yet

### 5. **Data Persistence**
- **Cloud storage** with MongoDB (primary)
- localStorage for offline access
- Automatic cloud sync
- Schema versioning for future upgrades
- Resilient to missing data

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or MongoDB Atlas account)

### Installation

#### 1. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Configure environment
cp .env.example .env

# Start frontend development server
npm run dev
```

The app will be available at `http://localhost:5173`

#### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Configure backend environment
cp .env.example .env
# Edit .env and set your MongoDB connection string and JWT secret

# Start MongoDB (if running locally)
brew services start mongodb-community

# Start backend server
npm run dev
```

The API will be available at `http://localhost:3001`

### Quick Start (Full Stack)

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

**Terminal 3 - MongoDB (if local):**
```bash
mongod
```

Then open `http://localhost:5173` and register an account!

## 📊 Data Models

### Relationship
```typescript
{
  id: string;
  name: string;
  organization: string;
  industry: string;
  region: string;
  stage: 'Exploring' | 'Active' | 'At Risk' | 'Completed';
  owner: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
}
```

### Interaction
```typescript
{
  id: string;
  relationshipId: string;
  type: 'Call' | 'Email' | 'Meeting';
  date: string;
  outcome: 'Positive' | 'Neutral' | 'No Response';
  tone: 'Energizing' | 'Neutral' | 'Draining';
  reflection: string;
}
```

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **CSS3** - Styling (no external UI libraries)

**Backend:**
- **Node.js** + **Express** - REST API server
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Project Structure
```
/
├── src/                     # Frontend source
│   ├── api/
│   │   └── client.ts       # API client for backend
│   ├── components/
│   │   ├── Auth.tsx        # Login/Register 🆕
│   │   ├── RelationshipsList.tsx
│   │   ├── RelationshipDetail.tsx
│   │   ├── AddEditRelationshipModal.tsx
│   │   ├── InteractionsList.tsx
│   │   ├── AddEditInteractionModal.tsx
│   │   ├── SignalBoard.tsx
│   │   └── *.css
│   ├── context/
│   │   └── AuthContext.tsx  # Auth state management 🆕
│   ├── services/
│   │   └── sync.ts          # Cloud sync service 🆕
│   ├── types.ts
│   ├── storage.ts           # localStorage (fallback)
│   ├── utils.ts
│   ├── App.tsx
│   └── main.tsx
│
└── server/                  # Backend source 🆕
    ├── src/
    │   ├── models/
    │   │   ├── User.ts      # User model
    │   │   ├── Relationship.ts
    │   │   └── Interaction.ts
    │   ├── routes/
    │   │   ├── auth.ts      # Auth endpoints
    │   │   ├── relationships.ts
    │   │   └── interactions.ts
    │   ├── middleware/
    │   │   └── auth.ts      # JWT auth middleware
    │   └── server.ts        # Express app
    ├── package.json
    └── .env
```

## 🎨 Design Principles

- **Clean & Professional UI** - Modern gradient header, card-based layout
- **Secure Authentication** - JWT-based login with encrypted passwords 🆕
- **Responsive Design** - Works on desktop and tablet
- **Intuitive Navigation** - Clear tab structure with visual feedback
- **Empty States** - Helpful messages when no data exists
- **Visual Hierarchy** - Clear information architecture
- **Accessible Forms** - Proper labels and validation
- **Real-time Sync** - Automatic cloud synchronization 🆕

## 💾 Data Persistence & Cloud Sync 🆕

The app now uses a **hybrid storage approach**:

**Primary Storage (Cloud):**
- MongoDB database for persistent, cross-device data
- Automatic sync on all create/update/delete operations
- JWT-authenticated API calls
- User data isolation (each user only sees their own data)

**Secondary Storage (Local):**
- localStorage for offline access and caching
- Syncs with cloud on app load
- Manual sync button available
- Fallback if cloud is unavailable

**Sync Features:**
- **Automatic sync** - All changes immediately sync to cloud
- **On-demand sync** - Manual sync button to refresh data
- **Login sync** - Full data download when logging in
- **Schema versioning** - Version field for future migrations
- **Safe defaults** - Handles missing or corrupted data gracefully

## 🔐 Security Features 🆕

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure, expiring tokens (7 day expiry)
- **Protected Routes** - All API endpoints require authentication
- **Data Isolation** - Users can only access their own data
- **CORS Enabled** - Configured for frontend-backend communication
- **Input Validation** - Server-side validation with express-validator

## 🔮 Signal Calculation

The engagement signal score (0-100) is calculated based on:

1. **Frequency (40 points max)** - Number of interactions in last 30 days (10 points each)
2. **Tone (30 points)** - Energizing interactions (+10 each), Draining interactions (-5 each)
3. **Recency (30 points)** - Days since last contact (decreases with time)

Signals are categorized:
- **Strong**: 70-100 points
- **Moderate**: 40-69 points
- **Weak**: 0-39 points
- **No Data**: No interactions recorded

## 📝 Usage Tips

1. **Register an Account** - Create your account to start using cloud sync 🆕
2. **Start with Relationships** - Add your key professional relationships first
3. **Log Interactions Regularly** - Keep the interaction history up to date
4. **Use the Signal Board** - Identify relationships that need attention
5. **Add Rich Notes** - Use notes fields to capture context and details
6. **Update Stages** - Keep relationship stages current as they evolve
7. **Sync Across Devices** - Login from any device to access your data 🆕
8. **Manual Sync** - Use the sync button to refresh data when needed 🆕

## 🔒 Privacy & Data

**With Cloud Sync:**
- Data is securely stored in MongoDB with user authentication
- Each user can only access their own data
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days for security
- HTTPS recommended for production deployment

**Local Fallback:**
- Data is also cached in browser localStorage
- Works offline with local cache
- Syncs when connection is restored

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Set environment variable:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend Deployment (Heroku/Railway/Render)

1. Push the `server` directory to your hosting service

2. Set environment variables:
```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secure-random-secret
NODE_ENV=production
```

3. Ensure MongoDB Atlas is configured with proper IP whitelist

## 🐛 Troubleshooting

**"Authentication required" error:**
- Clear browser localStorage and login again
- Check that backend server is running on port 3001
- Verify `.env` files are configured correctly

**Data not syncing:**
- Check browser console for errors
- Verify MongoDB is running
- Click the sync button to manually refresh
- Check network tab for failed API calls

**Cannot connect to MongoDB:**
- If using local MongoDB: `brew services start mongodb-community`
- If using MongoDB Atlas: Check connection string and IP whitelist
- Verify `MONGODB_URI` in `server/.env`

**Backend won't start:**
- Check MongoDB is accessible
- Verify all dependencies are installed: `cd server && npm install`
- Check port 3001 is not in use: `lsof -ti:3001 | xargs kill`

## 📄 License

This is a resume/portfolio project - free to use and modify.

---

Built with ❤️ as a professional resume project demonstrating full-stack development with React, TypeScript, Node.js, Express, MongoDB, and JWT authentication.
