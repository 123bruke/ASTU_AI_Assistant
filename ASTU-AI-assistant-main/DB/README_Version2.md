## Backend (server) - MongoDB + Gemini

A Node.js + TypeScript backend has been added at `backend/`. It exposes `/api/chat` that the frontend calls. The backend calls the Google Generative Language API (Gemini equivalent) server-side and saves messages to MongoDB.

Steps to run backend:

1. cd backend
2. npm install
3. copy `.env.example` to `.env` and set:
   - GEMINI_API_KEY (your server-side Gemini API key)
   - MONGO_URI (your MongoDB connection string)
   - PORT (optional, defaults to 4000)
4. npm run dev

Frontend dev server (root) proxies `/api` to the backend automatically (see `vite.config.ts`), so you can run the frontend with:

1. cd (repo root)
2. npm install
3. npm run dev

Notes and recommendations:

- Keep GEMINI_API_KEY and MONGO_URI out of version control. Use environment variables or secret stores in production.
- To create a free MongoDB Atlas cluster:
  1. Go to https://www.mongodb.com/cloud/atlas and sign up.
  2. Create a cluster, create a database user, and add your current IP or 0.0.0.0/0 (for development) to IP whitelist.
  3. Copy the connection string (mongodb+srv://...) and place it into `backend/.env` as `MONGO_URI`.
- In production, add rate limiting, authentication, logging, and proper error monitoring.
- If you'd like SDK-based calls (official @google/genai SDK) instead of the REST endpoint, I can provide that version as well.