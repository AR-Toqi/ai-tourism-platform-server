# PRD — AI-Powered Smart Tourism Platform
**Version:** MVP v1.2  
**Status:** Active Development  
**Last Updated:** 2026-05-07  
**Author:** Senior Engineering Team

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Tech Stack](#4-tech-stack)
5. [User Roles & Permissions](#5-user-roles--permissions)
6. [Authentication System](#6-authentication-system)
7. [Feature Specifications](#7-feature-specifications)
8. [AI Feature Layer](#8-ai-feature-layer)
9. [Database Architecture](#9-database-architecture)
10. [API Architecture](#10-api-architecture)
11. [Dashboard System](#11-dashboard-system)
12. [Advanced Engineering Requirements](#12-advanced-engineering-requirements)
13. [UI/UX Requirements](#13-uiux-requirements)
14. [Security Requirements](#14-security-requirements)
15. [Performance Requirements](#15-performance-requirements)
16. [Analytics System](#16-analytics-system)
17. [Environment & DevOps](#17-environment--devops)
18. [Future Scope](#18-future-scope)

---

## 1. Product Overview

### Vision

An AI-powered travel intelligence platform that generates fully personalized travel experiences based on user intent, behavior, budget, and real-world context. This is **not** a static listing platform — it is an intelligent travel system.

### Unique Value Proposition

> Traditional platforms list destinations. This platform **understands travelers** and builds entire experiences around them.

### Core Differentiators

- Real AI responses — no mock data, no hardcoded suggestions
- Context-aware itinerary generation with day-by-day breakdowns
- Conversational travel assistant with session memory
- Role-based platform supporting Travelers, Admins, and Content Managers
- Production-grade, scalable fullstack architecture

---

## 2. Problem Statement

### Current Pain Points

**For Travelers:**
- Static destination listings with no personalization
- No help with real trip planning or budgeting
- Generic recommendations not tailored to travel style
- Disjointed experience across research, planning, and booking

**For Platform Operators:**
- No insight into user behavior or AI usage
- Difficult content management workflows
- No structured analytics to improve the product

### How We Solve It

| Problem | Solution |
|---|---|
| Static listings | AI-driven destination recommendations |
| No itinerary help | AI Trip Planner with day-wise breakdown |
| Generic advice | Context-aware chat assistant with memory |
| No budgeting | Budget-aware itinerary generation |
| Poor content workflow | Content Manager dashboard with AI-assisted writing |

---

## 3. Goals & Success Metrics

### Primary Goals

- Build a production-ready AI-powered tourism system
- Implement real AI features (OpenAI/Gemini — no mocks)
- Create scalable, maintainable fullstack architecture
- Deliver strong, responsive UX across all devices
- Support role-based dashboards for 3 user types

### Success Metrics

| Metric | Target |
|---|---|
| AI itinerary generation reliability | > 95% success rate |
| Auth system (Better Auth) | Fully functional (email + Google OAuth) |
| Page load time (LCP) | < 2.5s |
| Mobile responsiveness | All pages fully responsive |
| Role-based access | Zero privilege escalation |
| Real AI responses | 100% (no hardcoded fallbacks) |
| Destination search response time | < 500ms |

---

## 4. Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 14+ (App Router) | React framework, SSR, routing |
| TypeScript | Type safety across all layers |
| Tailwind CSS | Utility-first styling |
| ShadCN UI | Accessible, composable component library |
| React Hook Form | Performant form management |
| Zod | Schema validation (shared with backend) |
| TanStack Query | Server state, caching, optimistic updates |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express.js | HTTP server and REST API |
| TypeScript | Type safety |
| PostgreSQL | Primary relational database |
| Prisma ORM | Database access layer and migrations |
| Redis (optional MVP+) | Caching layer |
| BullMQ (optional MVP+) | Background job queue |
| Pino / Winston | Structured logging |

### Authentication

| Technology | Purpose |
|---|---|
| Better Auth | Primary auth provider |
| Google OAuth | Social login |
| Session-based auth | Secure session management |
| RBAC | Role-based access control |

### AI Layer

| Technology | Purpose |
|---|---|
| OpenAI API (GPT-4o) | Itinerary generation, chat assistant |
| Gemini API (fallback) | Alternative AI provider |
| Structured JSON outputs | Reliable, parseable AI responses |
| Prompt engineering layer | Consistent, context-rich prompts |

---

## 5. User Roles & Permissions

### Role Matrix

| Feature | User (Traveler) | Content Manager | Admin |
|---|---|---|---|
| Browse destinations | ✅ | ✅ | ✅ |
| Search & filter | ✅ | ✅ | ✅ |
| Generate AI itinerary | ✅ | ✅ | ✅ |
| Use AI chat assistant | ✅ | ✅ | ✅ |
| Save destinations/itineraries | ✅ | ✅ | ✅ |
| Write reviews | ✅ | ✅ | ✅ |
| Create destinations | ❌ | ✅ | ✅ |
| Edit destination data | ❌ | ✅ | ✅ |
| Publish/unpublish destinations | ❌ | ✅ | ✅ |
| AI-assisted content improvement | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| View analytics dashboard | ❌ | ❌ | ✅ |
| Monitor AI usage logs | ❌ | ❌ | ✅ |
| Moderate reviews | ❌ | ❌ | ✅ |
| View system logs | ❌ | ❌ | ✅ |

### 5.1 User (Traveler)

The primary end-user of the platform.

**Capabilities:**
- Register/login via email-password or Google OAuth
- Explore and search destination listings
- View full destination detail pages
- Generate personalized AI itineraries
- Chat with AI travel assistant (context-aware, with memory)
- Save favorite destinations and generated itineraries
- Write and manage reviews
- Manage their own profile

### 5.2 Admin

The platform owner and system manager.

**Capabilities:**
- Full user management (view, block, monitor activity)
- Full destination management
- View aggregated analytics dashboard
- Monitor AI usage logs and system logs
- Moderate user reviews

### 5.3 Content Manager

Responsible for destination content quality and publishing.

**Capabilities:**
- Create and edit destination entries
- Upload and manage destination images
- Improve SEO content
- Publish and unpublish destinations
- Use AI to auto-generate or improve destination summaries and travel tips

---

## 6. Authentication System

**Provider:** Better Auth (primary — not negotiable)

### Features

- Email/password registration and login
- Google OAuth login
- Email verification
- Secure session management (sessions stored in DB)
- Account linking (Google + email)
- Role-based access control (User / ContentManager / Admin)

### Auth Flow

```
User → Login / Register
        ↓
Better Auth processes credentials / OAuth callback
        ↓
Session created and stored in PostgreSQL
        ↓
Session cookie set on client
        ↓
API requests authenticated via session middleware
        ↓
RBAC middleware checks role before processing route
```

### Session Strategy

- Sessions stored in `sessions` table (managed by Better Auth)
- HTTP-only cookies for session tokens
- Session expiry configurable (default: 7 days)
- Refresh handled transparently by Better Auth

---

## 7. Feature Specifications

### 7.1 Home Page

**Navbar:**

| State | Navigation Items |
|---|---|
| Logged Out | Home, Explore, About, Blogs, Contact |
| Logged In | Dashboard, Explore, AI Planner, AI Assistant, Saved Trips, Profile |

Navbar requirements: sticky, responsive, profile dropdown, mobile hamburger menu.

**Hero Section:**
- AI-focused primary CTA ("Plan My Trip with AI")
- Animated or interactive UI element
- Smooth scroll to next section
- Clear value proposition in 1–2 lines

**Required Page Sections (minimum 8):**

| # | Section |
|---|---|
| 1 | Hero with CTA |
| 2 | Popular Destinations (dynamic) |
| 3 | AI Features Showcase |
| 4 | Travel Categories |
| 5 | Testimonials |
| 6 | Platform Statistics |
| 7 | Blog Preview |
| 8 | FAQ (accordion) |
| 9 | Newsletter Signup |
| 10 | Final CTA Banner |

### 7.2 Destination Listing Page

**Features:**
- Debounced search input (300ms delay)
- Filter by minimum 2 fields (e.g., category, budget range, region)
- Sort options (popularity, rating, alphabetical)
- Pagination OR infinite scroll
- Skeleton loading states
- Responsive grid layout (4 columns desktop, 2 tablet, 1 mobile)
- No placeholder or dummy content

### 7.3 Destination Detail Page

**Sections:**
- Image gallery (multiple images, lightbox support)
- Overview (description, highlights, tags)
- Travel information (best season, duration, budget estimate)
- Reviews & ratings (aggregate + individual reviews)
- Related destinations (AI-powered suggestions)

### 7.4 AI Trip Planner *(Core Feature)*

**Input Form Fields:**

| Field | Type | Required |
|---|---|---|
| Destination | Text / Select | ✅ |
| Travel Duration | Number (days) | ✅ |
| Budget (USD) | Range / Number | ✅ |
| Travel Style | Select (Adventure / Relaxed / Cultural / Family) | ✅ |
| Traveler Count | Number | ✅ |
| Preferences / Notes | Textarea | Optional |

**Output Structure (Structured JSON from AI):**
```json
{
  "destination": "string",
  "duration": "number",
  "total_budget_estimate": "string",
  "days": [
    {
      "day": 1,
      "theme": "string",
      "activities": [
        {
          "time": "string",
          "activity": "string",
          "location": "string",
          "estimated_cost": "string",
          "notes": "string"
        }
      ]
    }
  ],
  "budget_breakdown": {
    "accommodation": "string",
    "food": "string",
    "transport": "string",
    "activities": "string"
  },
  "tips": ["string"],
  "best_time_to_visit": "string"
}
```

**UI Behavior:**
- Streaming output (token-by-token display via SSE or chunked response)
- Loading skeleton while generating
- Ability to save generated itinerary
- Option to regenerate with tweaked inputs

### 7.5 AI Travel Assistant (Chat)

**Features:**
- Context-aware multi-turn conversation
- Session memory (previous messages sent in context window)
- Supports travel Q&A, recommendations, packing tips, visa info
- Streaming response (typewriter effect)
- Chat history saved to DB per user
- Clear conversation option

**Context Sent to AI per Request:**
- Full conversation history (last N messages)
- User profile hints (budget preference, travel style if available)
- System prompt defining assistant persona and guardrails

### 7.6 Saved System

**Features:**
- Save / unsave destinations (toggle)
- Save generated itineraries with a custom name
- View all saved items in dashboard
- Delete saved items

### 7.7 Reviews System

**Features:**
- Star rating (1–5)
- Text comment (min 20 chars)
- One review per user per destination
- Edit and delete own review
- Admin can moderate (hide/delete) any review
- Aggregate rating displayed on destination card and detail page

---

## 8. AI Feature Layer

All AI features must use real API calls. No mock responses permitted.

### 8.1 AI Itinerary Generator

**Trigger:** User submits Trip Planner form  
**Model:** GPT-4o / Gemini 1.5 Pro  
**Output:** Structured JSON (see schema in 7.4)  
**Prompt Layer:** Injects user inputs + system context + output schema instructions  
**Stored in:** `itineraries` + `itinerary_days` + `itinerary_activities` tables

### 8.2 AI Smart Recommendation Engine

**Trigger:** Homepage, destination detail page, post-itinerary generation  
**Logic:** Based on user's travel style, budget, saved destinations, and behavior  
**Output:** Ranked list of destination IDs with reasoning  
**Prompt input:** User profile summary + browsing history summary + available destinations

### 8.3 AI Travel Chat Assistant

**Trigger:** AI Assistant page — per message  
**Model:** GPT-4o  
**Output:** Streamed text  
**Memory:** Last 20 messages sent as context  
**Stored in:** `ai_chats` + `ai_messages` tables

### 8.4 AI Destination Insight Generator

**Trigger:** Content Manager triggers for a destination  
**Output:** Auto-generated description, top travel tips, best time to visit, SEO meta description  
**Stored in:** Destination record fields  
**Also usable by:** Traveler-facing "AI Summary" tab on destination detail page

---

## 9. Database Architecture

### Auth Layer (Managed by Better Auth)

```sql
users           -- id, email, name, role, createdAt, updatedAt
sessions        -- id, userId, token, expiresAt, createdAt
accounts        -- id, userId, provider, providerAccountId
verifications   -- id, identifier, value, expiresAt
```

### Application Layer

```sql
destinations
  id, slug, name, description, country, region, category,
  budget_min, budget_max, best_season, duration_days,
  cover_image, is_published, avg_rating, review_count,
  created_by (FK users), createdAt, updatedAt

destination_images
  id, destination_id (FK), url, alt_text, order, createdAt

destination_reviews
  id, destination_id (FK), user_id (FK), rating (1-5),
  comment, is_hidden, createdAt, updatedAt

itineraries
  id, user_id (FK), destination_id (FK), title,
  duration_days, budget, travel_style, total_cost_estimate,
  budget_breakdown (JSON), tips (JSON), raw_ai_response (TEXT),
  createdAt, updatedAt

itinerary_days
  id, itinerary_id (FK), day_number, theme

itinerary_activities
  id, day_id (FK), time, activity, location,
  estimated_cost, notes, order

ai_chats
  id, user_id (FK), title, createdAt, updatedAt

ai_messages
  id, chat_id (FK), role (user|assistant), content (TEXT),
  token_count, createdAt

ai_recommendation_logs
  id, user_id (FK), input_context (JSON), output (JSON),
  model_used, latency_ms, createdAt

saved_destinations
  id, user_id (FK), destination_id (FK), createdAt
  UNIQUE(user_id, destination_id)

saved_itineraries
  id, user_id (FK), itinerary_id (FK), createdAt

analytics_events
  id, user_id (FK nullable), event_type, payload (JSON),
  ip_hash, user_agent, createdAt

system_logs
  id, level, message, context (JSON), createdAt
```

---

## 10. API Architecture

### Base URL

```
/api/v1
```

### Route Groups

```
/api/v1/auth/**             → Handled by Better Auth
/api/v1/destinations        → CRUD for destinations
/api/v1/reviews             → Review management
/api/v1/ai/itinerary        → AI itinerary generation
/api/v1/ai/chat             → AI chat (streaming)
/api/v1/ai/recommend        → Recommendations
/api/v1/ai/insight          → Destination insight generation
/api/v1/saved               → Save/unsave destinations & itineraries
/api/v1/itineraries         → User itinerary management
/api/v1/users               → User profile management
/api/v1/admin/**            → Admin-only endpoints
/api/v1/content-manager/**  → Content manager endpoints
/api/v1/analytics           → Analytics ingestion
```

### Middleware Stack (per request)

```
Request
  → CORS
  → Rate Limiter
  → Request Logger (Pino)
  → Body Parser
  → Better Auth Session Middleware
  → RBAC Middleware (role check)
  → Route Handler
  → Error Handler Middleware
  → Response Logger
```

### Error Response Schema

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### Success Response Schema

```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "total": 100,
    "limit": 20
  }
}
```

---

## 11. Dashboard System

### 11.1 User Dashboard

| Section | Content |
|---|---|
| Saved Trips | Grid of saved destinations and itineraries |
| My Itineraries | List of generated itineraries with detail view |
| AI Chat History | List of past conversations |
| My Reviews | Reviews the user has written |
| Profile Settings | Name, avatar, travel preferences, password change |

### 11.2 Admin Dashboard

| Section | Content |
|---|---|
| Overview | KPI cards: total users, destinations, AI calls, reviews |
| User Management | Table with search, filter by role, block/unblock |
| Destination Management | Table with publish/unpublish, delete |
| AI Usage Analytics | Charts: calls/day, token usage, error rate |
| Review Moderation | Flagged reviews queue |
| System Logs | Filterable log viewer |

### 11.3 Content Manager Dashboard

| Section | Content |
|---|---|
| Destination List | All destinations with status (published/draft) |
| Create Destination | Full form with AI insight generation button |
| Edit Destination | Same form pre-populated |
| Media Manager | Upload/delete/reorder images per destination |
| SEO Panel | AI-generated meta title, description, keywords |

---

## 12. Advanced Engineering Requirements

### Frontend (implement minimum 3)

- **React Server Components** — use RSC for data-heavy pages (destination listing, destination detail)
- **Streaming UI** — AI chat and itinerary generation use streaming responses with typewriter effect
- **Optimistic UI** — save/unsave destinations update instantly before API confirmation
- **Suspense Boundaries** — wrap async data fetching with proper fallback skeletons
- **Lazy Loading** — images use `next/image` with lazy loading; heavy components dynamically imported

### Backend (implement minimum 3)

- **Rate Limiting** — per-IP and per-user limits on AI endpoints (e.g., 10 AI requests/min per user)
- **Structured Logging** — Pino with request ID correlation across all log entries
- **Error Handling Middleware** — centralized error handler with typed error classes
- **Input Validation** — Zod schemas for all request bodies and query params
- **Caching** — Cache destination listings and popular searches (in-memory or Redis)

---

## 13. UI/UX Requirements

### Design System

- Maximum 3 primary colors in the palette
- Full light mode and dark mode support (system-preference aware)
- Consistent card component system across all listing pages
- Typography scale: defined heading/body/caption sizes
- Spacing system: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64px)

### Component Requirements

- Skeleton loaders for all async content — no spinners
- Empty states for all zero-data scenarios
- Error states with retry options
- Toast notifications for async actions (save, delete, generate)
- Mobile-first responsive design (320px minimum)
- No placeholder text (Lorem Ipsum) in any shipped component

### Accessibility

- WCAG 2.1 AA contrast minimum
- All interactive elements keyboard navigable
- ARIA labels on icon-only buttons
- Focus ring visible in keyboard navigation

---

## 14. Security Requirements

| Requirement | Implementation |
|---|---|
| Authentication | Better Auth with secure session cookies (HTTP-only, SameSite) |
| Authorization | RBAC middleware checks role on every protected route |
| Input Validation | Zod on all API request bodies and query strings |
| Rate Limiting | express-rate-limit on all routes; stricter limits on AI routes |
| Environment Secrets | API keys stored in `.env`, never committed, validated at startup |
| SQL Injection | Prevented by Prisma parameterized queries |
| XSS | Next.js default escaping + ShadCN sanitized inputs |
| CORS | Whitelist allowed origins in Express config |
| AI Prompt Injection | Sanitize and validate user inputs before injecting into prompts |

---

## 15. Performance Requirements

| Area | Requirement |
|---|---|
| Images | `next/image` with WebP conversion, lazy loading, proper sizing |
| Code Splitting | Dynamic imports for heavy components (charts, map embeds) |
| Pagination | Cursor-based or offset pagination on all list endpoints |
| Database Queries | Indexed columns: `destination.slug`, `review.destination_id`, `saved.user_id` |
| AI Responses | Streaming enabled — first token visible within 1–2s |
| API Response (non-AI) | Target < 200ms for cached routes, < 500ms for DB queries |

---

## 16. Analytics System

### Events to Track

| Event Type | Trigger |
|---|---|
| `page_view` | Any page navigation |
| `destination_view` | Destination detail page opened |
| `search_query` | Search submitted |
| `filter_applied` | Filter changed |
| `itinerary_generated` | AI itinerary generation completed |
| `chat_message_sent` | User sends chat message |
| `destination_saved` | Save button clicked |
| `review_submitted` | Review form submitted |
| `recommendation_clicked` | AI recommendation item clicked |

### Analytics Storage

Events are stored in `analytics_events` table with user_id (nullable for logged-out), event_type, JSON payload, IP hash (privacy-safe), and timestamp.

---

## 17. Environment & DevOps

### Required Environment Variables

```env
# Server
NODE_ENV=development|production
PORT=4000

# Database
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:4000

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# AI
OPENAI_API_KEY=...
GEMINI_API_KEY=...

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

### Project Structure (Monorepo Recommended)

```
/
├── apps/
│   ├── web/          ← Next.js frontend
│   └── api/          ← Express backend
├── packages/
│   └── shared/       ← Shared Zod schemas, types
├── prisma/
│   └── schema.prisma
└── docker-compose.yml
```

---

## 18. Future Scope

These features are explicitly out of MVP scope but architected for:

- Real-time booking system + Payment integration (Stripe)
- Google Maps API integration for destination maps
- AI voice assistant (Web Speech API)
- Multi-language support (i18n)
- Social trip sharing
- Mobile app (React Native)
- Travel video generation (AI)
- Collaborative trip planning (real-time, Liveblocks)

---

*This PRD is the single source of truth for the MVP. Any feature not listed here is out of scope unless formally added via a PRD amendment.*