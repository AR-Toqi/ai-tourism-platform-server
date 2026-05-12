# Wanderlust AI — Intelligent Tourism & Experience Platform

Wanderlust AI is a cutting-edge, AI-powered travel intelligence platform designed to transform how travelers discover, plan, and experience the world. Unlike traditional listing sites, Wanderlust AI understands user intent, preferences, and budget to build fully personalized, day-by-day itineraries and provide real-time travel assistance.

---

## 🚀 Core Features

### 🌍 Smart Destination Discovery
- **AI-Driven Search**: Natural language search to find destinations that match your mood, budget, and style.
- **Dynamic Filtering**: Advanced filters for categories (Beach, Mountain, Cultural, etc.), budget ranges, and ratings.
- **Rich Media**: High-quality galleries with lightbox support for an immersive visual experience.

### 🤖 AI Itinerary Generator
- **Personalized Planning**: Generates complete day-by-day travel plans based on duration, budget, and traveler count.
- **Structured Outputs**: Every plan includes specific activities, timing, location hints, and budget breakdowns.
- **Persistence**: Save generated itineraries to your profile to access them anytime.

### 💬 AI Travel Assistant (Concierge)
- **Context-Aware Chat**: A multi-turn conversational AI that remembers your previous questions and preferences.
- **Real-time Advice**: Get instant help with packing lists, visa requirements, local etiquette, and hidden gems.
- **Streaming UI**: Fast, token-by-token responses for a fluid, human-like interaction.

### 👥 Multi-Role Ecosystem
- **Traveler Dashboard**: Manage saved destinations, generated itineraries, chat history, and personal profile.
- **Content Manager Dashboard**: Full suite for managing destination listings, uploading galleries, and using AI to improve SEO and descriptions.
- **Admin Command Center**: Global oversight of users, platform analytics, AI usage monitoring, and review moderation.

### 🔐 Secure Foundation
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Travelers, Content Managers, and Admins.
- **Robust Auth**: Secure session-based authentication via Better Auth using HTTP-only cookies and social login support.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [ShadCN UI](https://ui.shadcn.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Language**: TypeScript
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **AI Integration**: [OpenAI GPT-4o](https://openai.com/) & [Google Gemini Pro](https://deepmind.google/technologies/gemini/)

---

## 🏗️ Architectural Challenges

Building a platform that feels "alive" and intelligent presented several technical hurdles:

### 1. Architecting the AI Logic
The biggest challenge was moving beyond "simple prompts." We implemented a **Context-Aware Memory System** for the chat assistant, ensuring it doesn't just answer one-off questions but understands the trajectory of a traveler's planning process.

### 2. Reliable Structured Data
LLMs can be unpredictable. We architected a robust validation layer using **Zod and JSON Schemas** to ensure the AI's itinerary outputs always match our frontend's day-by-day UI components without crashing or showing malformed data.

### 3. User-Friendly Complexity
To keep the UI clean while providing deep functionality, we used an **Atomic Component Design**. Complex business logic (like budget calculations and role-based redirects) is abstracted into custom React Hooks and Middleware, keeping the presentation layer lightweight and fast.

### 4. Performance & Streaming
Waiting for an AI to think can be frustrating. We implemented **Streaming Responses (Server-Sent Events)** so users see results immediately, significantly improving perceived performance and the overall user experience.

### 5. Role-Based Business Logic
Designing a permission system that is both strict and seamless required careful middleware architecture. Each route is guarded by layered RBAC middleware — ensuring Content Managers can never touch user management, while Admins retain full platform control, all without code duplication.

---

## 🔮 Future Roadmap

We are continuously evolving. Our upcoming features include:

- **💳 Integrated Booking & Payments**: Direct hotel and activity bookings powered by Stripe.
- **🗺️ Interactive Map Integration**: Google Maps API for real-time navigation and destination pins.
- **🎙️ AI Voice Assistant**: Hands-free travel planning via Web Speech API.
- **🌐 Global Reach**: Multi-language support (i18n) and localized content for international travelers.
- **👥 Collaborative Planning**: Real-time "Trip Rooms" where friends can plan itineraries together.
- **📱 Mobile Experience**: Dedicated iOS and Android apps built with React Native.
- **📊 Advanced Analytics**: AI-powered insights into user behavior and destination trends.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- OpenAI / Gemini API Keys

### Installation
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables (see `.env.example`)
4. Run migrations: `npx prisma migrate dev`
5. Start development servers:
   - Server: `cd server && pnpm dev`
   - Client: `cd client && pnpm dev`

---

## 👤 Developer

**Abdullah Ragib Toqi**
Full-Stack Developer & AI Enthusiast

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/abdullah-ragib-toqi/)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/ar_toqi)

