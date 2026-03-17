import fetch from 'node-fetch';
import { Request, Response } from 'express';
import { Message } from '../models/Message';

// Using the Generative Language REST endpoint for text-bison-001.
........................
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate';
gen_code = "

type GenAiResponse = any;

export async function handleChat(req: Request, res: Response) {
  try {
    const { text, userId } = req.body ?? {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing "text" in request body' });
    }

    const uid = userId || 'anonymous';

    // Persist user message
    await Message.create({
      userId: uid,
      role: 'user',
      content: text,
      timestamp: Date.now()
    });

    // Build request payload for Generative Language API
    const payload = {
      prompt: {
        text
      },
      temperature: 0.2,
      maxOutputTokens: 512,
      candidateCount: 1
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfiguration: GEMINI_API_KEY not set' });
    }

    // Send request to Gemini (Generative Language REST API). Key is added as query param.
    const r = await fetch(GEMINI_ENDPOINT + `?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const textErr = await r.text();
      console.error('Gemini API error:', r.status, textErr);
      return res.status(502).json({ error: 'Upstream Gemini API error', status: r.status, body: textErr });
    }

    const data: GenAiResponse = await r.json();

    // Robust extraction of assistant text across possible response shapes
    const assistantText =
      data?.candidates?.[0]?.content ||
      data?.output?.[0]?.content ||
      data?.response?.content ||
      (typeof data === 'string' ? data : JSON.stringify(data));

    await Message.create({
      userId: uid,
      role: 'assistant',
      content: assistantText,
      timestamp: Date.now()
    });

    // Return assistant text and raw response for debugging
    return res.json({ assistant: assistantText, raw: data });
  } catch (err) {
    console.error('handleChat error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}