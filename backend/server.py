from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class UserResponse(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    is_pro: bool = False
    golden_badge: bool = False
    created_at: str

class TransmutationCreate(BaseModel):
    goal_hours: float
    start_time: Optional[str] = None  # ISO format, for time travel feature

class TransmutationUpdate(BaseModel):
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    is_active: Optional[bool] = None

class TransmutationResponse(BaseModel):
    transmutation_id: str
    user_id: str
    goal_hours: float
    start_time: str
    end_time: Optional[str] = None
    is_active: bool
    total_hours: float
    laws_unlocked: List[str]
    created_at: str

class ChatMessage(BaseModel):
    role: str
    content: str
    flesh_response: Optional[str] = None
    spirit_response: Optional[str] = None
    timestamp: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    flesh: str
    spirit: str
    prompts_remaining: int

class SubscriptionRequest(BaseModel):
    plan: str  # 'monthly' or 'yearly'
    origin_url: str

class PaymentStatusResponse(BaseModel):
    status: str
    payment_status: str
    is_pro: bool

class UserGoalUpdate(BaseModel):
    intent: str  # shred, clarity, heal, rebirth
    
class HydrationLog(BaseModel):
    amount_ml: int = 250  # default glass size
    has_electrolytes: bool = False

class UserStatsResponse(BaseModel):
    total_transmutations: int
    total_hours: float
    current_streak: int
    longest_streak: int
    intent: Optional[str] = None
    hydration_today: int
    hydration_goal: int
    last_hydration: Optional[str] = None

# ==================== THE PATHFINDER CODEX: 12 LAWS OF TRANSMUTATION ====================

TWELVE_LAWS = [
    {
        "law_number": 1,
        "name": "Divine Oneness",
        "phase": "0-8 Hours",
        "hours_start": 0,
        "hours_end": 8,
        "title": "The Connection",
        "breakdown": "Your body is not separate from your mind. As your blood sugar stabilizes, you realize that every choice you make ripples through your entire existence."
    },
    {
        "law_number": 2,
        "name": "Vibration",
        "phase": "9-16 Hours",
        "hours_start": 9,
        "hours_end": 16,
        "title": "The Shift",
        "breakdown": "Everything is in motion. Your body is shifting its frequency from 'sugar-burning' to 'fat-burning,' elevating your metabolic vibration."
    },
    {
        "law_number": 3,
        "name": "Action",
        "phase": "17-24 Hours",
        "hours_start": 17,
        "hours_end": 24,
        "title": "The Sacrifice",
        "breakdown": "Growth requires movement. Autophagy begins here; you are actively destroying the old to make room for the new."
    },
    {
        "law_number": 4,
        "name": "Correspondence",
        "phase": "25-32 Hours",
        "hours_start": 25,
        "hours_end": 32,
        "title": "The Mirror",
        "breakdown": "'As within, so without.' Your internal cellular repair is a direct reflection of your external discipline and Will."
    },
    {
        "law_number": 5,
        "name": "Cause & Effect",
        "phase": "33-40 Hours",
        "hours_start": 33,
        "hours_end": 40,
        "title": "The Harvest",
        "breakdown": "Every hour of hunger is a 'cause' that produces the 'effect' of massive Growth Hormone surges. You reap what you sow."
    },
    {
        "law_number": 6,
        "name": "Compensation",
        "phase": "41-48 Hours",
        "hours_start": 41,
        "hours_end": 48,
        "title": "The Reward",
        "breakdown": "The Universe rewards sacrifice. As the brain creates BDNF, you are compensated with elite mental clarity and focus."
    },
    {
        "law_number": 7,
        "name": "Attraction",
        "phase": "49-56 Hours",
        "hours_start": 49,
        "hours_end": 56,
        "title": "The Magnet",
        "breakdown": "Peak Autophagy. As you purge toxins, your vessel becomes clean, attracting higher thoughts and creative energy."
    },
    {
        "law_number": 8,
        "name": "Perpetual Transmutation",
        "phase": "57-64 Hours",
        "hours_start": 57,
        "hours_end": 64,
        "title": "The Alchemy",
        "breakdown": "Energy cannot be destroyed. You are transmuting physical hunger into raw, usable spiritual power."
    },
    {
        "law_number": 9,
        "name": "Relativity",
        "phase": "65-72 Hours",
        "hours_start": 65,
        "hours_end": 72,
        "title": "The Perspective",
        "breakdown": "Your 'struggle' is relative. Compared to the strength of your Spirit, the body's temporary hunger is an illusion."
    },
    {
        "law_number": 10,
        "name": "Polarity",
        "phase": "73-80 Hours",
        "hours_start": 73,
        "hours_end": 80,
        "title": "The Duality",
        "breakdown": "Hunger and Fullness are two sides of one coin. You cannot know true Abundance until you have mastered the Void."
    },
    {
        "law_number": 11,
        "name": "Rhythm",
        "phase": "81-90 Hours",
        "hours_start": 81,
        "hours_end": 90,
        "title": "The Pulse",
        "breakdown": "You have exited the chaos of modern eating and entered the natural rhythm of the Earth. You are in sync with the All."
    },
    {
        "law_number": 12,
        "name": "Gender (Creation)",
        "phase": "91-100+ Hours",
        "hours_start": 91,
        "hours_end": 100,
        "title": "The Birth",
        "breakdown": "Stem Cell Regeneration. You have birthed a new biological version of yourself. You are the Creator of your own Vessel."
    },
]

def get_unlocked_laws(hours: float) -> List[str]:
    return [law["name"] for law in TWELVE_LAWS if hours >= law["hours_start"]]

def get_current_law(hours: float) -> dict:
    """Get the current law based on hours elapsed"""
    for law in reversed(TWELVE_LAWS):
        if hours >= law["hours_start"]:
            return law
    return TWELVE_LAWS[0]

# ==================== AUTH HELPERS ====================

async def get_current_user(request: Request) -> dict:
    # Check cookie first, then Authorization header
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = session_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user_doc

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange session_id from Emergent Auth for a session token"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth to get user data
    async with httpx.AsyncClient() as client_http:
        auth_response = await client_http.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session_id")
        
        user_data = auth_response.json()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data["email"]}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        # Update user data
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": user_data["name"],
                "picture": user_data.get("picture"),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": user_data["email"],
            "name": user_data["name"],
            "picture": user_data.get("picture"),
            "is_pro": False,
            "golden_badge": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    # Create session
    session_token = user_data.get("session_token", f"session_{uuid.uuid4().hex}")
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    # Get full user data
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return user_doc

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current authenticated user"""
    user = await get_current_user(request)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout and clear session"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# ==================== TRANSMUTATION ROUTES ====================

@api_router.post("/transmutations", response_model=TransmutationResponse)
async def start_transmutation(data: TransmutationCreate, request: Request):
    """Start a new transmutation session"""
    user = await get_current_user(request)
    
    # Check for active transmutation
    active = await db.transmutations.find_one(
        {"user_id": user["user_id"], "is_active": True},
        {"_id": 0}
    )
    if active:
        raise HTTPException(status_code=400, detail="Already have an active transmutation")
    
    # Use provided start time or now (Time Travel feature)
    if data.start_time:
        start_time = data.start_time
    else:
        start_time = datetime.now(timezone.utc).isoformat()
    
    transmutation_id = f"trans_{uuid.uuid4().hex[:12]}"
    transmutation = {
        "transmutation_id": transmutation_id,
        "user_id": user["user_id"],
        "goal_hours": data.goal_hours,
        "start_time": start_time,
        "end_time": None,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.transmutations.insert_one(transmutation)
    
    # Calculate current progress
    start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
    if start_dt.tzinfo is None:
        start_dt = start_dt.replace(tzinfo=timezone.utc)
    hours_elapsed = (datetime.now(timezone.utc) - start_dt).total_seconds() / 3600
    
    return {
        **transmutation,
        "total_hours": max(0, hours_elapsed),
        "laws_unlocked": get_unlocked_laws(max(0, hours_elapsed))
    }

@api_router.get("/transmutations/active", response_model=Optional[TransmutationResponse])
async def get_active_transmutation(request: Request):
    """Get the active transmutation session"""
    user = await get_current_user(request)
    
    transmutation = await db.transmutations.find_one(
        {"user_id": user["user_id"], "is_active": True},
        {"_id": 0}
    )
    
    if not transmutation:
        return None
    
    # Calculate current progress
    start_dt = datetime.fromisoformat(transmutation["start_time"].replace('Z', '+00:00'))
    if start_dt.tzinfo is None:
        start_dt = start_dt.replace(tzinfo=timezone.utc)
    hours_elapsed = (datetime.now(timezone.utc) - start_dt).total_seconds() / 3600
    
    # Check for 100hr golden badge
    if hours_elapsed >= 100 and not user.get("golden_badge"):
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"golden_badge": True}}
        )
    
    return {
        **transmutation,
        "total_hours": max(0, hours_elapsed),
        "laws_unlocked": get_unlocked_laws(max(0, hours_elapsed))
    }

@api_router.patch("/transmutations/{transmutation_id}")
async def update_transmutation(transmutation_id: str, data: TransmutationUpdate, request: Request):
    """Update transmutation (Time Travel feature)"""
    user = await get_current_user(request)
    
    transmutation = await db.transmutations.find_one(
        {"transmutation_id": transmutation_id, "user_id": user["user_id"]},
        {"_id": 0}
    )
    
    if not transmutation:
        raise HTTPException(status_code=404, detail="Transmutation not found")
    
    update_data = {}
    if data.start_time is not None:
        update_data["start_time"] = data.start_time
    if data.end_time is not None:
        update_data["end_time"] = data.end_time
    if data.is_active is not None:
        update_data["is_active"] = data.is_active
    
    if update_data:
        await db.transmutations.update_one(
            {"transmutation_id": transmutation_id},
            {"$set": update_data}
        )
    
    # Get updated transmutation
    updated = await db.transmutations.find_one(
        {"transmutation_id": transmutation_id},
        {"_id": 0}
    )
    
    start_dt = datetime.fromisoformat(updated["start_time"].replace('Z', '+00:00'))
    if start_dt.tzinfo is None:
        start_dt = start_dt.replace(tzinfo=timezone.utc)
    
    if updated["end_time"]:
        end_dt = datetime.fromisoformat(updated["end_time"].replace('Z', '+00:00'))
        if end_dt.tzinfo is None:
            end_dt = end_dt.replace(tzinfo=timezone.utc)
        hours_elapsed = (end_dt - start_dt).total_seconds() / 3600
    else:
        hours_elapsed = (datetime.now(timezone.utc) - start_dt).total_seconds() / 3600
    
    return {
        **updated,
        "total_hours": max(0, hours_elapsed),
        "laws_unlocked": get_unlocked_laws(max(0, hours_elapsed))
    }

@api_router.post("/transmutations/{transmutation_id}/end")
async def end_transmutation(transmutation_id: str, request: Request):
    """End a transmutation session"""
    user = await get_current_user(request)
    
    transmutation = await db.transmutations.find_one(
        {"transmutation_id": transmutation_id, "user_id": user["user_id"]},
        {"_id": 0}
    )
    
    if not transmutation:
        raise HTTPException(status_code=404, detail="Transmutation not found")
    
    end_time = datetime.now(timezone.utc).isoformat()
    
    await db.transmutations.update_one(
        {"transmutation_id": transmutation_id},
        {"$set": {"is_active": False, "end_time": end_time}}
    )
    
    # Calculate total hours
    start_dt = datetime.fromisoformat(transmutation["start_time"].replace('Z', '+00:00'))
    if start_dt.tzinfo is None:
        start_dt = start_dt.replace(tzinfo=timezone.utc)
    end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
    if end_dt.tzinfo is None:
        end_dt = end_dt.replace(tzinfo=timezone.utc)
    hours_elapsed = (end_dt - start_dt).total_seconds() / 3600
    
    # Check for 100hr golden badge
    if hours_elapsed >= 100 and not user.get("golden_badge"):
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"golden_badge": True}}
        )
    
    return {
        **transmutation,
        "end_time": end_time,
        "is_active": False,
        "total_hours": max(0, hours_elapsed),
        "laws_unlocked": get_unlocked_laws(max(0, hours_elapsed))
    }

@api_router.get("/transmutations/history")
async def get_transmutation_history(request: Request):
    """Get all past transmutation sessions"""
    user = await get_current_user(request)
    
    transmutations = await db.transmutations.find(
        {"user_id": user["user_id"], "is_active": False},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    result = []
    for t in transmutations:
        start_dt = datetime.fromisoformat(t["start_time"].replace('Z', '+00:00'))
        if start_dt.tzinfo is None:
            start_dt = start_dt.replace(tzinfo=timezone.utc)
        
        if t.get("end_time"):
            end_dt = datetime.fromisoformat(t["end_time"].replace('Z', '+00:00'))
            if end_dt.tzinfo is None:
                end_dt = end_dt.replace(tzinfo=timezone.utc)
            hours_elapsed = (end_dt - start_dt).total_seconds() / 3600
        else:
            hours_elapsed = 0
        
        result.append({
            **t,
            "total_hours": max(0, hours_elapsed),
            "laws_unlocked": get_unlocked_laws(max(0, hours_elapsed))
        })
    
    return result

@api_router.get("/transmutations/stats")
async def get_transmutation_stats(request: Request):
    """Get transmutation statistics"""
    user = await get_current_user(request)
    
    transmutations = await db.transmutations.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).to_list(1000)
    
    total_hours = 0
    completed_count = 0
    longest_session = 0
    
    for t in transmutations:
        start_dt = datetime.fromisoformat(t["start_time"].replace('Z', '+00:00'))
        if start_dt.tzinfo is None:
            start_dt = start_dt.replace(tzinfo=timezone.utc)
        
        if t.get("end_time"):
            end_dt = datetime.fromisoformat(t["end_time"].replace('Z', '+00:00'))
            if end_dt.tzinfo is None:
                end_dt = end_dt.replace(tzinfo=timezone.utc)
            hours = (end_dt - start_dt).total_seconds() / 3600
            completed_count += 1
        elif t.get("is_active"):
            hours = (datetime.now(timezone.utc) - start_dt).total_seconds() / 3600
        else:
            hours = 0
        
        total_hours += max(0, hours)
        longest_session = max(longest_session, hours)
    
    return {
        "total_transmutations": len(transmutations),
        "completed_transmutations": completed_count,
        "total_hours": round(total_hours, 2),
        "longest_session_hours": round(longest_session, 2),
        "golden_badge": user.get("golden_badge", False)
    }

# ==================== GRANITE COACH (AI) ROUTES ====================

@api_router.post("/coach/chat", response_model=ChatResponse)
async def chat_with_coach(data: ChatRequest, request: Request):
    """Chat with the Granite Coach AI"""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    user = await get_current_user(request)
    
    # Check 5 prompts per 24hr limit
    twenty_four_hours_ago = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    recent_messages = await db.chat_messages.count_documents({
        "user_id": user["user_id"],
        "role": "user",
        "timestamp": {"$gte": twenty_four_hours_ago}
    })
    
    if recent_messages >= 5 and not user.get("is_pro"):
        raise HTTPException(
            status_code=429, 
            detail="Prompt limit reached. Upgrade to Pathfinder Pro for unlimited access."
        )
    
    prompts_remaining = max(0, 5 - recent_messages - 1) if not user.get("is_pro") else 999
    
    # Get user's current transmutation state for context
    active_trans = await db.transmutations.find_one(
        {"user_id": user["user_id"], "is_active": True},
        {"_id": 0}
    )
    
    context = ""
    if active_trans:
        start_dt = datetime.fromisoformat(active_trans["start_time"].replace('Z', '+00:00'))
        if start_dt.tzinfo is None:
            start_dt = start_dt.replace(tzinfo=timezone.utc)
        hours = (datetime.now(timezone.utc) - start_dt).total_seconds() / 3600
        context = f"The user is currently {hours:.1f} hours into their transmutation journey."
    
    system_message = f"""You are the Granite Coach, a wise and spiritual guide for the Pathfinder DSM transmutation app.
You provide two-tier responses to every query:

THE FLESH: Biological data about what's happening in the body during fasting/transmutation. Be scientific and specific about cellular processes, hormones, autophagy, ketosis, etc.

THE SPIRIT: Connect the physical transformation to one of the 12 Laws of the Universe that applies to this moment:
1. Divine Oneness - All is connected
2. Vibration - Everything has a frequency  
3. Action - Movement creates change
4. Correspondence - As above, so below
5. Cause and Effect - Every action has reaction
6. Compensation - You receive what you give
7. Attraction - Like attracts like
8. Transmutation - Energy transforms
9. Relativity - All is relative
10. Polarity - Opposites are identical in nature
11. Rhythm - Everything flows
12. Gender - Balance of masculine and feminine energy

{context}

Keep responses concise but profound. Speak with authority and wisdom. Never use emojis."""

    # Initialize Gemini chat
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=api_key,
        session_id=f"coach_{user['user_id']}_{datetime.now().timestamp()}",
        system_message=system_message
    ).with_model("gemini", "gemini-3-flash-preview")
    
    # Format prompt
    prompt = f"""User question: {data.message}

Respond in exactly this format:
THE FLESH:
[Your biological/scientific response here]

THE SPIRIT:
[Your spiritual response connecting to one of the 12 Laws here]"""
    
    user_message = UserMessage(text=prompt)
    response_text = await chat.send_message(user_message)
    
    # Parse response
    flesh = ""
    spirit = ""
    
    if "THE FLESH:" in response_text and "THE SPIRIT:" in response_text:
        parts = response_text.split("THE SPIRIT:")
        flesh = parts[0].replace("THE FLESH:", "").strip()
        spirit = parts[1].strip() if len(parts) > 1 else ""
    else:
        flesh = response_text
        spirit = "The universe speaks through all things."
    
    # Save user message
    await db.chat_messages.insert_one({
        "message_id": f"msg_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "role": "user",
        "content": data.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    
    # Save AI response
    await db.chat_messages.insert_one({
        "message_id": f"msg_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "role": "assistant",
        "content": response_text,
        "flesh_response": flesh,
        "spirit_response": spirit,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "flesh": flesh,
        "spirit": spirit,
        "prompts_remaining": prompts_remaining
    }

@api_router.get("/coach/history")
async def get_chat_history(request: Request):
    """Get chat history with the Granite Coach"""
    user = await get_current_user(request)
    
    messages = await db.chat_messages.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(100)
    
    return messages

@api_router.get("/coach/prompts-remaining")
async def get_prompts_remaining(request: Request):
    """Get remaining prompts for the day"""
    user = await get_current_user(request)
    
    if user.get("is_pro"):
        return {"prompts_remaining": 999, "is_pro": True}
    
    twenty_four_hours_ago = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    recent_messages = await db.chat_messages.count_documents({
        "user_id": user["user_id"],
        "role": "user",
        "timestamp": {"$gte": twenty_four_hours_ago}
    })
    
    return {"prompts_remaining": max(0, 5 - recent_messages), "is_pro": False}

# ==================== STRIPE SUBSCRIPTION ROUTES ====================

@api_router.post("/subscription/checkout")
async def create_checkout_session(data: SubscriptionRequest, request: Request):
    """Create Stripe checkout session for Pro subscription"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
    
    user = await get_current_user(request)
    
    # Define fixed packages
    PACKAGES = {
        "monthly": 9.99,
        "yearly": 69.99
    }
    
    if data.plan not in PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    amount = PACKAGES[data.plan]
    
    # Initialize Stripe
    api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    # Create checkout session
    success_url = f"{data.origin_url}/profile?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{data.origin_url}/profile"
    
    checkout_request = CheckoutSessionRequest(
        amount=float(amount),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": user["user_id"],
            "plan": data.plan,
            "email": user["email"]
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    await db.payment_transactions.insert_one({
        "transaction_id": f"txn_{uuid.uuid4().hex[:12]}",
        "session_id": session.session_id,
        "user_id": user["user_id"],
        "email": user["email"],
        "amount": amount,
        "currency": "usd",
        "plan": data.plan,
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/subscription/status/{session_id}")
async def check_payment_status(session_id: str, request: Request):
    """Check payment status and update user subscription"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    user = await get_current_user(request)
    
    # Check if already processed
    transaction = await db.payment_transactions.find_one(
        {"session_id": session_id},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction.get("payment_status") == "paid":
        return {
            "status": "complete",
            "payment_status": "paid",
            "is_pro": True
        }
    
    # Check with Stripe
    api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    status = await stripe_checkout.get_checkout_status(session_id)
    
    if status.payment_status == "paid":
        # Update transaction
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": "paid",
                "status": status.status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Update user to Pro
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": {
                "is_pro": True,
                "pro_plan": transaction.get("plan"),
                "pro_since": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        return {
            "status": status.status,
            "payment_status": "paid",
            "is_pro": True
        }
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "is_pro": False
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    try:
        event = await stripe_checkout.handle_webhook(body, signature)
        
        if event.payment_status == "paid":
            # Update transaction
            await db.payment_transactions.update_one(
                {"session_id": event.session_id},
                {"$set": {
                    "payment_status": "paid",
                    "event_id": event.event_id,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            
            # Get user_id from metadata
            user_id = event.metadata.get("user_id")
            if user_id:
                await db.users.update_one(
                    {"user_id": user_id},
                    {"$set": {
                        "is_pro": True,
                        "pro_plan": event.metadata.get("plan"),
                        "pro_since": datetime.now(timezone.utc).isoformat()
                    }}
                )
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}

# ==================== UTILITY ROUTES ====================

@api_router.get("/laws")
async def get_twelve_laws():
    """Get the 12 Laws of the Universe with unlock hours"""
    return TWELVE_LAWS

@api_router.get("/")
async def root():
    return {"message": "The Granite Fast Protocol API - Transmutation Tracker"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
