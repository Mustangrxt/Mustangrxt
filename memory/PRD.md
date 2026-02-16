# The Granite Fast Protocol - Product Requirements Document

## Project Overview
**Name:** The Granite Fast Protocol
**Description:** A spiritual fasting/transmutation app that transforms the physical act of fasting into a spiritual journey through the 12 Laws of the Universe (The Pathfinder Codex).

## Original Problem Statement
Build a Fasting App called "The Granite Fast Protocol" with:
- Customizable Fasting Timer (Transmutation Timer)
- Time Travel feature to backdate start time
- Hero Ring that fills in real-time
- 12 Laws of the Universe milestone icons (The Pathfinder Codex)
- Law Modal with Organic Violet theme showing detailed biological & spiritual breakdown
- 100hr Golden Solar Flare permanent badge
- Google Social Login (Emergent-managed)
- AI Chatbot "Granite Coach" with two-tier responses (Flesh + Spirit)
- 5 prompts per 24hr limit
- Stripe subscription for Protocol Pro ($9.99/mo | $69.99/yr)

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

### Latest Update (Feb 16, 2026)
- [x] Changed ALL fonts to Google Sans across the entire app
- [x] Styled "Granite Protocol Pro" subscription tier on Landing page with matching title style
- [x] Applied cyan glow to "GRANITE", white for "PROTOCOL", and gold glow to "PRO"
- [x] Verified consistent styling exists on Profile page

### Backend
- Complete FastAPI server with all endpoints
- MongoDB models for all collections
- Emergent Google OAuth integration
- Gemini 3 Flash AI integration for Granite Coach
- Two-tier response format (Flesh + Spirit)
- 5 prompts/24hr rate limiting
- Stripe subscription integration (monthly/yearly)
- 12 Laws with updated phase ranges and detailed breakdowns

### Frontend
- Landing page with "The Granite Fast Protocol" branding
- The Pathfinder Codex preview on landing page
- Dashboard with Hero Ring timer
- 12 Laws milestone icons with click-to-open modal
- **Law Modal** with Organic Violet theme showing:
  - Law number and name
  - Fasting phase range
  - "The Breakdown" title
  - Full biological & spiritual description
  - Activated/Locked status
- Time Travel modal for backdating
- Granite Coach chat interface
- Profile page with subscription options
- Authentication flow with session handling
- Golden particles for 100hr achievement
- Rotating Flower of Life sacred geometry background

### The Pathfinder Codex - 12 Laws of Transmutation
| Law | Name | Phase | Title |
|-----|------|-------|-------|
| 1 | Divine Oneness | 0-8h | The Connection |
| 2 | Vibration | 9-16h | The Shift |
| 3 | Action | 17-24h | The Sacrifice |
| 4 | Correspondence | 25-32h | The Mirror |
| 5 | Cause & Effect | 33-40h | The Harvest |
| 6 | Compensation | 41-48h | The Reward |
| 7 | Attraction | 49-56h | The Magnet |
| 8 | Perpetual Transmutation | 57-64h | The Alchemy |
| 9 | Relativity | 65-72h | The Perspective |
| 10 | Polarity | 73-80h | The Duality |
| 11 | Rhythm | 81-90h | The Pulse |
| 12 | Gender (Creation) | 91-100h+ | The Birth |

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
REACT_APP_BACKEND_URL=https://granite-fast-1.preview.emergentagent.com
```

## Next Steps
1. Add push notifications for milestone achievements
2. Implement email reminders
3. Add data export functionality
4. Consider community/social features
