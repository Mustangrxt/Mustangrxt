# Pathfinder DSM - Product Requirements Document

## Project Overview
**Name:** Pathfinder DSM - Transmutation Tracker
**Description:** A spiritual fasting/transmutation app that transforms the physical act of fasting into a spiritual journey through the 12 Laws of the Universe.

## Original Problem Statement
Build a Fasting App called "Pathfinder DSM" with:
- Customizable Fasting Timer (Transmutation Timer)
- Time Travel feature to backdate start time
- Hero Ring that fills in real-time
- 12 Laws of the Universe milestone icons
- 100hr Golden Solar Flare permanent badge
- Google Social Login (Emergent-managed)
- AI Chatbot "Granite Coach" with two-tier responses (Flesh + Spirit)
- 5 prompts per 24hr limit
- Stripe subscription for Pathfinder Pro ($9.99/mo | $69.99/yr)

## User Personas
1. **Spiritual Seekers** - Users looking to combine physical fasting with spiritual growth
2. **Biohackers** - Users interested in tracking autophagy, ketosis, and cellular regeneration
3. **Fasting Enthusiasts** - Experienced practitioners wanting advanced tracking and insights

## Core Requirements
### Must Have (P0)
- [x] Transmutation Timer with real-time Hero Ring visualization
- [x] 12 Laws of the Universe milestone icons that ignite as time passes
- [x] Time Travel feature to backdate start time
- [x] 100hr Golden Solar Flare permanent badge
- [x] Google OAuth authentication
- [x] AI Granite Coach with Flesh + Spirit responses
- [x] 5 prompts per 24hr rolling window (free tier)
- [x] Stripe subscription integration

### Should Have (P1)
- [x] Transmutation history and statistics
- [x] Color progression (Cyan → Violet → Gold)
- [x] Deep Space Black theme with sacred geometry
- [x] User profile with subscription management

### Nice to Have (P2)
- [ ] Notifications/reminders
- [ ] Social sharing
- [ ] Community features
- [ ] Advanced analytics dashboard

## Architecture

### Tech Stack
- **Frontend:** React 19, Tailwind CSS, Framer Motion, TSParticles
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Auth:** Emergent-managed Google OAuth
- **AI:** Gemini 3 Flash via Emergent LLM Key
- **Payments:** Stripe via Emergent Integrations

### Database Collections
- `users` - User profiles with subscription status
- `user_sessions` - Authentication sessions
- `transmutations` - Fasting/transmutation sessions
- `chat_messages` - Granite Coach conversation history
- `payment_transactions` - Stripe payment records

### API Endpoints
- `POST /api/auth/session` - Exchange session_id for token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/laws` - Get 12 Laws of the Universe
- `POST /api/transmutations` - Start transmutation
- `GET /api/transmutations/active` - Get active session
- `PATCH /api/transmutations/{id}` - Update (Time Travel)
- `POST /api/transmutations/{id}/end` - End session
- `GET /api/transmutations/history` - Get history
- `GET /api/transmutations/stats` - Get statistics
- `POST /api/coach/chat` - Chat with Granite Coach
- `GET /api/coach/prompts-remaining` - Check prompt limit
- `POST /api/subscription/checkout` - Create Stripe session
- `GET /api/subscription/status/{id}` - Check payment status

## What's Been Implemented (Feb 16, 2026)

### Backend
- Complete FastAPI server with all endpoints
- MongoDB models for all collections
- Emergent Google OAuth integration
- Gemini 3 Flash AI integration for Granite Coach
- Two-tier response format (Flesh + Spirit)
- 5 prompts/24hr rate limiting
- Stripe subscription integration (monthly/yearly)
- 12 Laws of the Universe with unlock hours

### Frontend
- Landing page with Pathfinder DSM branding
- Dashboard with Hero Ring timer
- 12 Laws milestone icons with tooltips
- Time Travel modal for backdating
- Granite Coach chat interface
- Profile page with subscription options
- Authentication flow with session handling
- Golden particles for 100hr achievement
- Rotating Flower of Life sacred geometry background

### Design
- Deep Space Black (#000000) theme
- Color progression: Cyan (0-24h) → Violet (24-72h) → Gold (72-100h+)
- Orbitron font for headings
- Glassmorphism cards
- Neon glow effects

## Prioritized Backlog

### P0 - Completed
All P0 features implemented

### P1 - Next Phase
- [ ] Push notifications for milestone achievements
- [ ] Email reminders for inactive users
- [ ] Export transmutation data

### P2 - Future
- [ ] Social sharing of achievements
- [ ] Leaderboard/community features
- [ ] Guided meditation integration
- [ ] Apple Watch / wearable integration

## Testing Status
- Backend: 95% passing (1 minor status code issue - non-breaking)
- Frontend: 100% passing
- Authentication: 100% working
- AI Integration: 100% working
- Payments: 100% working

## Environment Variables
```
# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
EMERGENT_LLM_KEY=sk-emergent-***
STRIPE_API_KEY=sk_test_emergent

# Frontend (.env)
REACT_APP_BACKEND_URL=https://fast-life.preview.emergentagent.com
```

## Next Steps
1. Add push notifications for milestone achievements
2. Implement email reminders
3. Add data export functionality
4. Consider community/social features
