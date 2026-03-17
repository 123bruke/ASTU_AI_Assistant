import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import mongoldb
import dotenv from 'dotenv';
import { handleChat } from './controllers/chatController';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
const mongol = 

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGO_URI = process.env.MONGO_URI;

// Health route
app.get('/health', (_req, res) => res.json({ ok: true }));

// Chat route
app.post('/api/chat', handleChat);

async function start() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not set. Set it in backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Backend server listening on http://localhost:${PORT}`);
  });
}

start();