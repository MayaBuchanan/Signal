# Signal Server - Cloud Sync Backend

Backend API for Signal app with user authentication and cloud data synchronization.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (running locally or cloud instance)

### Setup

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` and update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT tokens
- `PORT` - Server port (default: 3001)

3. **Start MongoDB:**

If using local MongoDB:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod --config /usr/local/etc/mongod.conf
```

For cloud MongoDB (MongoDB Atlas), update `MONGODB_URI` in `.env` with your connection string.

4. **Run the server:**
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Authentication

**POST /api/auth/register**
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**POST /api/auth/login**
Login existing user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**GET /api/auth/me**
Get current user (requires auth token)

### Relationships

**GET /api/relationships**
Get all relationships for authenticated user

**GET /api/relationships/:id**
Get single relationship

**POST /api/relationships**
Create new relationship
```json
{
  "name": "Jane Smith",
  "organization": "Acme Corp",
  "industry": "Technology",
  "region": "North America",
  "stage": "Active",
  "owner": "John Doe",
  "notes": "Important client"
}
```

**PUT /api/relationships/:id**
Update relationship

**DELETE /api/relationships/:id**
Delete relationship (also deletes associated interactions)

### Interactions

**GET /api/interactions**
Get all interactions for authenticated user

**GET /api/interactions/relationship/:relationshipId**
Get interactions for specific relationship

**POST /api/interactions**
Create new interaction
```json
{
  "relationshipId": "abc123",
  "type": "Meeting",
  "date": "2024-02-16T10:00:00Z",
  "outcome": "Positive",
  "tone": "Energizing",
  "reflection": "Great conversation about next steps"
}
```

**PUT /api/interactions/:id**
Update interaction

**DELETE /api/interactions/:id**
Delete interaction

## 🔐 Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

## 🗄️ Database Schema

### User
- email (unique, required)
- password (hashed, required)
- name (required)
- timestamps

### Relationship
- userId (ref to User, indexed)
- name, organization (required)
- industry, region, stage, owner, notes
- timestamps

### Interaction
- userId (ref to User, indexed)
- relationshipId (ref to Relationship, indexed)
- type, date, outcome, tone (required)
- reflection
- timestamps

## 🛠️ Development

```bash
# Run in dev mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run built version
npm start
```

## 📦 Tech Stack

- **Express** - Web framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **TypeScript** - Type safety
- **express-validator** - Request validation

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT tokens with expiration
- Request validation
- User data isolation (users can only access their own data)
- CORS enabled for frontend

## 🐛 Troubleshooting

**MongoDB connection failed:**
- Ensure MongoDB is running: `brew services list | grep mongodb`
- Check connection string in `.env`
- For MongoDB Atlas, check IP whitelist and credentials

**Port already in use:**
- Change `PORT` in `.env`
- Kill process using port: `lsof -ti:3001 | xargs kill`

**Authentication errors:**
- Clear localStorage and re-login
- Check `JWT_SECRET` is set in `.env`
- Verify token is being sent in Authorization header

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/signal-db |
| `JWT_SECRET` | Secret for JWT signing | (required) |
| `NODE_ENV` | Environment | development |

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Use MongoDB Atlas or managed MongoDB
4. Enable HTTPS
5. Add rate limiting
6. Set up monitoring

---

**Note:** This is part of the Signal app ecosystem. See main README for full application documentation.
