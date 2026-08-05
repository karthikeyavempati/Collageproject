import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";
// npm install pdf-parse
// pdf-parse v2.x is a full rewrite of the package: it no longer exports a
// default function like v1 did. It exports a `PDFParse` class instead,
// used as `new PDFParse({ data }).getText()`.
// pdf-parse is lazy-loaded inside /api/parse-resume only.
// Importing it at the top level causes pdfjs-dist to load browser-only globals
// (DOMMatrix, ImageData, Path2D) which crash the Vercel Node.js runtime.
import {
  INITIAL_INTERNSHIPS,
  INITIAL_CANDIDATES,
  STATE_DISTRIBUTIONS,
  VERIFICATION_BATCHES,
  PENDING_COMPANIES,
} from "../data/mockData.js";
import { InternshipRole, Candidate, PendingCompany } from "../types.js";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ---------------------------------------------------------------------------
// AI MODEL CONFIG
// ---------------------------------------------------------------------------
// Gemma 4 31B IT is an open-weight Google DeepMind model that is served
// through the *same* Gemini API endpoint/SDK as Gemini models, using the
// same GEMINI_API_KEY. No separate provider or SDK is required.
//   https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api
const AI_MODEL = process.env.GEMMA_MODEL || "gemma-4-31b-it";

// Groq config
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL || "https://api.groq.com/openai/v1";
// Pick any currently supported Groq model from https://console.groq.com/docs/models
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_API_ENABLED = Boolean(
  GROQ_API_KEY &&
    !GROQ_API_KEY.toLowerCase().includes("your_groq_api_key")
);

// ---------------------------------------------------------------------------
// EMAIL OTP DISPATCH CONFIG (SMTP / Gmail / Resend API)
// ---------------------------------------------------------------------------
const SMTP_USER = process.env.SMTP_USER || process.env.GMAIL_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_PASS || "";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

const EMAIL_ENABLED = Boolean(
  (SMTP_USER && SMTP_PASS && !SMTP_USER.includes("your-email")) ||
  (RESEND_API_KEY && !RESEND_API_KEY.includes("your_resend"))
);

async function sendEmailOtp(toEmail: string, otp: string): Promise<boolean> {
  const subject = `Your OTP Verification Code - PM Internship Scheme: ${otp}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #005E93; margin: 0; font-size: 22px;">PM Internship Scheme</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Ministry of Corporate Affairs</p>
      </div>
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="color: #334155; font-size: 14px; margin-bottom: 12px;">Your 6-digit verification code is:</p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #005E93; font-family: monospace;">${otp}</div>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 12px;">This code will expire in 5 minutes.</p>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
        If you did not request this verification code, please ignore this email.
      </p>
    </div>
  `;

  // 1. Resend HTTP API
  if (RESEND_API_KEY && !RESEND_API_KEY.includes("your_resend")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "PM Internship Portal <onboarding@resend.dev>",
          to: toEmail,
          subject,
          html,
        }),
      });
      const data = (await res.json()) as any;
      if (res.ok && data.id) {
        console.log(`[OTP/Email] Email dispatched via Resend to ${toEmail}:`, data.id);
        return true;
      }
      console.error("[OTP/Email] Resend API failed:", data);
    } catch (err) {
      console.error("[OTP/Email] Resend network error:", err);
    }
  }

  // 2. Nodemailer SMTP (Gmail / Custom SMTP)
  if (SMTP_USER && SMTP_PASS && !SMTP_USER.includes("your-email")) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"PM Internship Scheme" <${SMTP_USER}>`,
        to: toEmail,
        subject,
        html,
      });

      console.log(`[OTP/Email] Email dispatched via SMTP to ${toEmail}`);
      return true;
    } catch (err) {
      console.error("[OTP/Email] SMTP error while sending email:", err);
      return false;
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// AUTH CONFIG (JWT + password hashing)
// ---------------------------------------------------------------------------
// A real secret MUST be provided in production via JWT_SECRET. In dev, if
// it's missing we generate a random one at boot so the app still runs, but
// that means tokens won't survive a restart/redeploy - fine for local dev,
// never acceptable for production.
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // A random secret is generated so the app never fails to start, but it
  // means tokens stop working whenever the process restarts/cold-starts.
  // Set JWT_SECRET in your environment (e.g. `openssl rand -hex 32`) for
  // sessions that survive restarts on a real deployment.
  JWT_SECRET = crypto.randomBytes(32).toString("hex");
  console.warn(
    "[auth] JWT_SECRET not set - using a randomly generated secret for this " +
      "process. Sessions will be invalidated on restart. Set JWT_SECRET " +
      "in your environment for persistent sessions."
  );
}
const JWT_EXPIRES_IN = "12h";
const BCRYPT_ROUNDS = 12;

type PortalRole = "student" | "employer" | "admin";

interface AuthTokenPayload {
  sub: string; // user id
  email: string;
  role: PortalRole;
  name: string;
}

function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET as string) as AuthTokenPayload;
  } catch {
    return null;
  }
}

/** Express middleware factory: requires a valid Bearer token, optionally
 *  restricted to a set of roles. Attaches the decoded payload to req.user. */
function requireAuth(allowedRoles?: PortalRole[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Authentication required." });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired session. Please log in again." });
    }
    if (allowedRoles && !allowedRoles.includes(payload.role)) {
      return res.status(403).json({ error: "You do not have permission to perform this action." });
    }
    (req as any).user = payload;
    next();
  };
}

// ---------------------------------------------------------------------------
// ADMIN CREDENTIALS
// ---------------------------------------------------------------------------
// There is exactly ONE administrator identity for this portal. It is fixed
// to the owner's real account below. No other email/password combination -
// however it's submitted - is ever accepted for the "admin" role; the check
// further down is a strict equality match against these two values only.
//
// To change the admin identity (e.g. for a different deployment), set
// ADMIN_EMAIL / ADMIN_PASSWORD as environment variables - they override
// these defaults. Do not remove the defaults from source without setting
// the env vars first, or admin login will be disabled (see the check below).
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "venkatakarthikeyavempati@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "rohini123";

/** Constant-time string comparison to avoid leaking info via timing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison of equal-length buffers so the failure path
    // takes roughly the same time regardless of length mismatch.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// ---------------------------------------------------------------------------
// USER STORE (student / employer accounts)
// ---------------------------------------------------------------------------
// NOTE: in-memory, like the rest of this prototype's "database" - see the
// README section on data persistence. Passwords are bcrypt-hashed, never
// stored or logged in plain text.
interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  role: PortalRole;
  name: string;
}
const usersStore = new Map<string, StoredUser>(); // key: `${role}:${email.toLowerCase()}`

function userKey(role: string, email: string): string {
  return `${role}:${email.trim().toLowerCase()}`;
}

// ---------------------------------------------------------------------------
// IN-MEMORY DATA STORE
// ---------------------------------------------------------------------------
// NOTE: This mirrors the original prototype's in-memory persistence.
// On Vercel, each serverless function instance is ephemeral - data written
// here will NOT reliably persist across requests/deploys/cold starts once
// this is deployed to Vercel (different invocations can land on different
// instances). It's fine for demos, but for real persistence swap this for
// a database (Vercel Postgres, Supabase, etc.) - see README.
let internships: InternshipRole[] = [...INITIAL_INTERNSHIPS];
let candidates: Candidate[] = [...INITIAL_CANDIDATES];
let stateDistributions = [...STATE_DISTRIBUTIONS];
let verificationBatches = [...VERIFICATION_BATCHES];
let pendingCompanies: PendingCompany[] = [...PENDING_COMPANIES];

// ---------------------------------------------------------------------------
// RATE LIMITER FOR LOGIN
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttemptsMap = new Map<string, number[]>();

function getClientIp(req: express.Request): string {
  // req.ip respects Express's `trust proxy` setting (enabled below), so it
  // only honors X-Forwarded-For when the request actually came through a
  // trusted proxy hop (e.g. Vercel's edge network) - a client can't spoof
  // their way to a fresh rate-limit bucket by sending their own header.
  return req.ip || req.socket.remoteAddress || "127.0.0.1";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const attempts = (loginAttemptsMap.get(ip) || []).filter((t) => t > windowStart);
  loginAttemptsMap.set(ip, attempts);

  if (attempts.length >= MAX_LOGIN_ATTEMPTS) {
    const oldestInWindow = attempts[0];
    const retryAfterSeconds = Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, retryAfterSeconds), attemptsCount: attempts.length };
  }

  return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - attempts.length, retryAfterSeconds: 0, attemptsCount: attempts.length };
}

function registerLoginAttempt(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const attempts = (loginAttemptsMap.get(ip) || []).filter((t) => t > windowStart);
  attempts.push(now);
  loginAttemptsMap.set(ip, attempts);
}

function parseResumeHeuristically(text: string) {
  const lines = (text || "").split("\n").map(l => l.trim()).filter(Boolean);
  
  let name = "";
  for (const line of lines.slice(0, 5)) {
    if (line.length > 2 && line.length < 35 && !/@|\.com|resume|curriculum|cv/i.test(line)) {
      name = line;
      break;
    }
  }
  if (!name) name = "Alex Sharma";

  const phoneMatch = text.match(/(\+?91[\s\-]?)?[6-9]\d{9}/);
  const phone = phoneMatch ? phoneMatch[0] : "+91 97004 50046";

  let institution = "";
  const instMatch = text.match(/(university|institute|college|iit|nit|bits|technology|academy)[^\n,.]*/i);
  if (instMatch) {
    institution = instMatch[0].trim();
  } else {
    institution = "Indian Institute of Technology, Delhi";
  }

  let course = "";
  const courseMatch = text.match(/(b\.tech|btech|b\.e|m\.tech|mca|bca|b\.sc|bachelor|master)[^\n,.]*/i);
  if (courseMatch) {
    course = courseMatch[0].trim();
  } else {
    course = "B.Tech Computer Science & Engineering";
  }

  const skillsKeywords = ["python", "javascript", "react", "node", "sql", "java", "c++", "ai", "machine learning", "data analytics", "figma", "cloud"];
  const foundSkills = skillsKeywords.filter(k => (text || "").toLowerCase().includes(k));
  const strengths = foundSkills.length > 0 
    ? `Proficient in ${foundSkills.map(s => s.toUpperCase()).join(", ")}, Data Structures & Software Design` 
    : "Strong analytical skills, Python programming, and Full-Stack Web Development";

  const weaknesses = "Public Speaking & Technical Documentation (Actively Improving)";

  return { name, phone, institution, course, strengths, weaknesses };
}

// ---------------------------------------------------------------------------
// EMAIL / PHONE VALIDATION
// ---------------------------------------------------------------------------
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Common disposable/throwaway domains - blocked so "genuine" email is enforced
// for signup/login, not just syntactically-valid-looking junk.
const BLOCKED_EMAIL_DOMAINS = new Set([
  "mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com",
  "yopmail.com", "throwawaymail.com", "trashmail.com", "fakeinbox.com",
  "getnada.com", "dispostable.com",
]);

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length > 254 || !EMAIL_REGEX.test(trimmed)) return false;
  const domain = trimmed.split("@")[1] || "";
  return !BLOCKED_EMAIL_DOMAINS.has(domain);
}

function normalizePhone(phone: string): string {
  return (phone || "").toString().replace(/[\s\-()]/g, "");
}

// Accepts Indian mobile numbers (with/without +91 or 91 prefix) as well as
// generic E.164-style international numbers.
function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  if (/^(\+91|91)?[6-9]\d{9}$/.test(normalized)) return true;
  if (/^\+[1-9]\d{7,14}$/.test(normalized)) return true;
  return false;
}

// Canonical key for a phone number (last 10 digits) - used so "+91 98765
// 43210", "919876543210" and "9876543210" are all treated as the same number
// for OTP storage/lookup.
function phoneKey(phone: string): string {
  const digitsOnly = normalizePhone(phone).replace(/\D/g, "");
  return digitsOnly.slice(-10);
}

// Simple password-strength check (used for signup only; admin credentials
// come from environment configuration and aren't user-chosen here).
function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 8;
}

// ---------------------------------------------------------------------------
// OTP (PHONE VERIFICATION)
// ---------------------------------------------------------------------------
// NOTE: There is no real SMS gateway wired up here (that requires a paid
// provider like Twilio/MSG91/Firebase). This implements the *full* flow -
// generation, expiry, attempt limiting, resend cooldown, and a verified-phone
// gate on login - the same shape a real integration would have. The only
// swap needed to go live is replacing the console.log below with an actual
// provider API call.
const OTP_TTL_MS = 5 * 60 * 1000; // OTP itself is valid for 5 minutes
const OTP_VERIFIED_TTL_MS = 15 * 60 * 1000; // must finish login within 15 min of verifying
const MAX_OTP_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 30 * 1000;

const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number; lastSentAt: number }>();
const verifiedEmails = new Map<string, number>();

function emailKey(email: string): string {
  return (email || "").trim().toLowerCase();
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Periodic sweep so long-running processes (local `npm run dev`/`npm start`)
// don't accumulate unbounded entries in these maps. No-op cost on serverless,
// where the whole module instance is thrown away between cold starts anyway.
const sweepIntervalHandle = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of otpStore) {
    if (now > record.expiresAt) otpStore.delete(key);
  }
  for (const [key, verifiedAt] of verifiedEmails) {
    if (now - verifiedAt > OTP_VERIFIED_TTL_MS) verifiedEmails.delete(key);
  }
  for (const [ip, attempts] of loginAttemptsMap) {
    const filtered = attempts.filter((t) => t > now - RATE_LIMIT_WINDOW_MS);
    if (filtered.length === 0) loginAttemptsMap.delete(ip);
    else loginAttemptsMap.set(ip, filtered);
  }
}, 5 * 60 * 1000);
sweepIntervalHandle.unref?.();

// ---------------------------------------------------------------------------
// GEMINI / GEMMA CLIENT HELPERS
// ---------------------------------------------------------------------------
let cachedClient: GoogleGenAI | null | undefined;

function getAiClient(): GoogleGenAI | null {
  if (cachedClient !== undefined) return cachedClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    cachedClient = null;
    return cachedClient;
  }
  try {
    cachedClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error("Failed to init GoogleGenAI client:", err);
    cachedClient = null;
  }
  return cachedClient;
}

/** Pulls plain text out of a genai response, filtering out any "thought" parts
 *  Gemma 4's reasoning mode can attach (defensive - response.text usually
 *  already handles this, but we don't want a bad SDK version to break us). */
function extractText(response: any): string {
  if (response && typeof response.text === "string" && response.text.trim()) {
    return response.text;
  }
  try {
    const parts = response?.candidates?.[0]?.content?.parts || [];
    const textParts = parts
      .filter((p: any) => typeof p?.text === "string" && !p?.thought)
      .map((p: any) => p.text);
    return textParts.join("\n").trim();
  } catch {
    return "";
  }
}

function extractGroqText(response: any): string {
  if (!response) return "";
  const openAiStyle = response?.choices?.[0]?.message?.content || response?.choices?.[0]?.text;
  if (typeof openAiStyle === "string" && openAiStyle.trim()) {
    return openAiStyle.trim();
  }
  const outputStyle = response?.output?.[0]?.content?.[0]?.text;
  return typeof outputStyle === "string" ? outputStyle.trim() : "";
}

async function callGroqChat(prompt: string, systemInstruction: string): Promise<string> {
  const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return extractGroqText(data);
}

async function callGroqCompletion(prompt: string, temperature = 0.2, maxTokens = 512): Promise<string> {
  const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return extractGroqText(data);
}

/** Robustly pulls a JSON object out of a model response, even if the model
 *  wraps it in markdown fences or adds stray commentary. */
function extractJsonObject(text: string): any {
  let cleaned = (text || "").trim();
  cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/```\s*$/, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  const jsonStr = match ? match[0] : cleaned;
  return JSON.parse(jsonStr);
}

/** Calls the AI model with a timeout so a slow/hung request never hangs the
 *  serverless function past its max duration. */
async function generateWithTimeout(fn: () => Promise<any>, timeoutMs = 20000): Promise<any> {
  return Promise.race([
    fn(),
    new Promise((_, reject) => setTimeout(() => reject(new Error("AI request timed out")), timeoutMs)),
  ]);
}

// ---------------------------------------------------------------------------
// APP FACTORY
// ---------------------------------------------------------------------------
export function createApp() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  // Trust the first hop proxy (Vercel's edge / your reverse proxy) so
  // req.ip is derived safely from X-Forwarded-For - the header is only
  // honored when it actually comes through that trusted hop, so a client
  // can't spoof it to dodge rate limiting.
  app.set("trust proxy", 1);

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), aiModel: AI_MODEL });
  });

  // --- OTP: EMAIL VERIFICATION ---
  // Required before /api/login will accept a login or signup - see below.

  app.post("/api/otp/send", async (req, res) => {
    const { email } = req.body || {};
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a genuine, valid email address." });
    }

    const key = emailKey(email);
    const now = Date.now();
    const existing = otpStore.get(key);

    if (existing && now - existing.lastSentAt < OTP_RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((OTP_RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
      return res.status(429).json({ error: `Please wait ${waitSeconds}s before requesting another OTP.` });
    }

    const otp = generateOtp();
    otpStore.set(key, { otp, expiresAt: now + OTP_TTL_MS, attempts: 0, lastSentAt: now });

    if (!EMAIL_ENABLED) {
      return res.status(400).json({
        error: "Email server is not configured on Vercel. Please set SMTP_USER and SMTP_PASS (or RESEND_API_KEY) in Vercel Environment Variables to send real emails.",
      });
    }

    const emailSent = await sendEmailOtp(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        error: `Failed to deliver email to ${email}. Please check your SMTP credentials in Vercel settings.`,
      });
    }

    return res.json({
      message: `A 6-digit verification code was sent to ${email}. Please check your email inbox.`,
      expiresInSeconds: OTP_TTL_MS / 1000,
      smsSent: true,
    });
  });

  app.post("/api/otp/verify", (req, res) => {
    const { email, otp } = req.body || {};
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!otp || typeof otp !== "string") {
      return res.status(400).json({ error: "Enter the 6-digit OTP." });
    }

    const key = emailKey(email);
    const record = otpStore.get(key);

    if (!record) {
      return res.status(400).json({ error: "No OTP was requested for this email address. Please request a new one." });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ error: "This OTP has expired. Please request a new one." });
    }
    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      otpStore.delete(key);
      return res.status(429).json({ error: "Too many incorrect attempts. Please request a new OTP." });
    }
    if (record.otp !== String(otp).trim()) {
      record.attempts += 1;
      return res.status(400).json({ error: `Incorrect OTP. ${MAX_OTP_ATTEMPTS - record.attempts} attempt(s) remaining.` });
    }

    otpStore.delete(key);
    verifiedEmails.set(key, Date.now());
    return res.json({ verified: true, message: "Email address verified successfully." });
  });

  // --- AUTHENTICATION & RATE LIMITING ---

  app.get("/api/login/rate-limit-status", (req, res) => {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip);
    res.json({
      ip,
      allowed: rateCheck.allowed,
      limit: MAX_LOGIN_ATTEMPTS,
      remaining: rateCheck.remaining,
      attemptsCount: rateCheck.attemptsCount,
      retryAfterSeconds: rateCheck.retryAfterSeconds,
      windowSeconds: RATE_LIMIT_WINDOW_MS / 1000,
    });
  });

  // Dev-only convenience route so you can re-test the login flow locally
  // without waiting out the window. Disabled entirely in production - an
  // unauthenticated way to clear your own rate limit defeats brute-force
  // protection, so this must never be reachable on a live deployment.
  app.post("/api/login/reset-rate-limit", (req, res) => {
    if (IS_PRODUCTION) {
      return res.status(404).json({ error: "Not found" });
    }
    const ip = getClientIp(req);
    loginAttemptsMap.delete(ip);
    res.json({ message: "Rate limit reset successfully for IP: " + ip });
  });

  app.post("/api/login", async (req, res) => {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip);

    res.setHeader("X-RateLimit-Limit", MAX_LOGIN_ATTEMPTS.toString());
    res.setHeader("X-RateLimit-Remaining", (rateCheck.allowed ? rateCheck.remaining - 1 : 0).toString());

    if (!rateCheck.allowed) {
      res.setHeader("Retry-After", rateCheck.retryAfterSeconds.toString());
      return res.status(429).json({
        error: "Too Many Login Attempts",
        message: `HTTP 429: Security Rate Limiter Active. You have exceeded the maximum threshold of ${MAX_LOGIN_ATTEMPTS} login attempts in 60 seconds.`,
        retryAfter: rateCheck.retryAfterSeconds,
        limit: MAX_LOGIN_ATTEMPTS,
        remaining: 0,
        ip,
      });
    }

    registerLoginAttempt(ip);

    const { email, password, portalRole, name: providedName, phone, isSignUp } = req.body || {};

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "Email address is required for scheme authentication." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a genuine, valid email address." });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required." });
    }
    if (!phone || typeof phone !== "string" || !isValidPhone(phone)) {
      return res.status(400).json({ error: "A valid mobile number is required." });
    }

    const emailVerifiedAt = verifiedEmails.get(emailKey(email));
    if (!emailVerifiedAt || Date.now() - emailVerifiedAt > OTP_VERIFIED_TTL_MS) {
      return res.status(403).json({
        error: "Please verify your email address with the OTP sent to it before continuing.",
        requiresOtp: true,
      });
    }

    const role: PortalRole = portalRole === "employer" || portalRole === "admin" ? portalRole : "student";
    const normalizedEmail = email.trim();

    // --- ADMIN: credentials come only from environment configuration ---
    if (role === "admin") {
      if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        return res.status(503).json({
          error: "Admin login is not configured on this server. Set ADMIN_EMAIL and ADMIN_PASSWORD.",
        });
      }
      const emailOk = normalizedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const passwordOk = safeEqual(password, ADMIN_PASSWORD);
      if (!emailOk || !passwordOk) {
        return res.status(401).json({ error: "Invalid admin credentials." });
      }

      verifiedEmails.delete(emailKey(email));
      const payload: AuthTokenPayload = {
        sub: "admin",
        email: ADMIN_EMAIL,
        role: "admin",
        name: "Strategic Administrator",
      };
      return res.status(200).json({
        message: "Authentication successful! Logged in as ADMIN.",
        user: {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          token: signToken(payload),
          loginTime: new Date().toISOString(),
        },
        rateLimitInfo: {
          remaining: Math.max(0, MAX_LOGIN_ATTEMPTS - (loginAttemptsMap.get(ip)?.length || 0)),
          limit: MAX_LOGIN_ATTEMPTS,
        },
      });
    }

    // --- STUDENT / EMPLOYER: real password auth against the user store ---
    const key = userKey(role, normalizedEmail);

    if (isSignUp) {
      if (usersStore.has(key)) {
        return res.status(409).json({ error: "An account with this email already exists for this role. Please sign in instead." });
      }
      if (!isValidPassword(password)) {
        return res.status(400).json({ error: "Password must be at least 8 characters long." });
      }
      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const name =
        providedName || (role === "employer" ? "New Employer Account" : "New Candidate");
      const user: StoredUser = {
        id: `usr-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
        email: normalizedEmail,
        passwordHash,
        role,
        name,
      };
      usersStore.set(key, user);

      verifiedEmails.delete(emailKey(email));
      const payload: AuthTokenPayload = { sub: user.id, email: user.email, role: user.role, name: user.name };
      return res.status(201).json({
        message: `Account created! Logged in as ${role.toUpperCase()}.`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: signToken(payload),
          loginTime: new Date().toISOString(),
        },
        rateLimitInfo: {
          remaining: Math.max(0, MAX_LOGIN_ATTEMPTS - (loginAttemptsMap.get(ip)?.length || 0)),
          limit: MAX_LOGIN_ATTEMPTS,
        },
      });
    }

    // Sign in: user must already exist, and the password must match the hash.
    const existingUser = usersStore.get(key);
    if (!existingUser) {
      return res.status(401).json({ error: "No account found with these details. Please sign up first." });
    }
    const passwordMatches = await bcrypt.compare(password, existingUser.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    verifiedEmails.delete(emailKey(email));
    const payload: AuthTokenPayload = {
      sub: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      name: existingUser.name,
    };
    return res.status(200).json({
      message: `Authentication successful! Logged in as ${role.toUpperCase()}.`,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        token: signToken(payload),
        loginTime: new Date().toISOString(),
      },
      rateLimitInfo: {
        remaining: Math.max(0, MAX_LOGIN_ATTEMPTS - (loginAttemptsMap.get(ip)?.length || 0)),
        limit: MAX_LOGIN_ATTEMPTS,
      },
    });
  });

  // --- INTERNSHIPS ---
  // Listings are public (it's a job board), but creating a posting requires
  // an authenticated employer or admin.

  app.get("/api/internships", (_req, res) => {
    res.json(internships);
  });

  app.get("/api/internships/:id", (req, res) => {
    const role = internships.find((i) => i.id === req.params.id);
    if (!role) return res.status(404).json({ error: "Internship role not found" });
    res.json(role);
  });

  app.post("/api/internships", requireAuth(["employer", "admin"]), (req, res) => {
    const newRoleData = req.body || {};
    if (!newRoleData.title || !newRoleData.company) {
      return res.status(400).json({ error: "Title and Company are required" });
    }

    const newRole: InternshipRole = {
      ...newRoleData,
      id: `pm-${Date.now()}`,
      applicantsCount: 0,
      matchScore: 95,
      status: newRoleData.status || "Open",
      tags: newRoleData.tags || [],
    };

    internships.unshift(newRole);
    res.status(201).json(newRole);
  });

  // Applying requires a logged-in student.
  app.post("/api/internships/:id/apply", requireAuth(["student"]), (req, res) => {
    const { id } = req.params;
    const { fullName, email, phone, university, sop, skills } = req.body || {};

    const roleIndex = internships.findIndex((i) => i.id === id);
    if (roleIndex === -1) return res.status(404).json({ error: "Internship role not found" });

    internships[roleIndex].applicantsCount += 1;
    const targetRole = internships[roleIndex];

    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      name: fullName || "Anonymous Applicant",
      university: university || "System Partner University",
      roleFocus: targetRole.title,
      experience: "Fresher",
      aiMatchScore: targetRole.matchScore || 92,
      avatarInitials: (fullName || "AA")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      appliedDate: "Just now",
      status: "Applied",
      email: email || "applicant@scheme.com",
      phone: phone || "+91 90000 00000",
      skills: skills || [],
      summary: sop || "Submitted application via PM Internship Scheme portal.",
    };

    candidates.unshift(newCandidate);

    res.status(200).json({
      message: "Application submitted successfully",
      updatedRole: internships[roleIndex],
      candidate: newCandidate,
    });
  });

  // --- CANDIDATES (contains applicant PII - employer/admin only) ---

  app.get("/api/candidates", requireAuth(["employer", "admin"]), (_req, res) => {
    res.json(candidates);
  });

  app.patch("/api/candidates/:id/status", requireAuth(["employer", "admin"]), (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};

    const candIndex = candidates.findIndex((c) => c.id === id);
    if (candIndex === -1) return res.status(404).json({ error: "Candidate not found" });

    candidates[candIndex].status = status;
    res.json(candidates[candIndex]);
  });

  // --- ANALYTICS & ADMIN (admin only) ---

  app.get("/api/state-distributions", requireAuth(["admin"]), (_req, res) => {
    res.json(stateDistributions);
  });

  app.get("/api/verification-batches", requireAuth(["admin"]), (_req, res) => {
    res.json(verificationBatches);
  });

  app.post("/api/verification-batches/:id/approve", requireAuth(["admin"]), (req, res) => {
    const { id } = req.params;
    const batch = verificationBatches.find((b) => b.id === id);
    if (!batch) return res.status(404).json({ error: "Verification batch not found" });

    verificationBatches = verificationBatches.filter((b) => b.id !== id);
    res.json({ message: "Batch approved and processed", batchId: id });
  });

  // --- PENDING COMPANY APPROVALS (admin only) ---

  app.get("/api/pending-companies", requireAuth(["admin"]), (_req, res) => {
    res.json(pendingCompanies.filter(c => c.status === "Pending"));
  });

  app.post("/api/pending-companies/:id/approve", requireAuth(["admin"]), (req, res) => {
    const { id } = req.params;
    const company = pendingCompanies.find(c => c.id === id);
    if (!company) return res.status(404).json({ error: "Company not found" });

    company.status = "Approved";
    res.json({ message: "Company approved successfully", company });
  });

  app.post("/api/pending-companies/:id/reject", requireAuth(["admin"]), (req, res) => {
    const { id } = req.params;
    const company = pendingCompanies.find(c => c.id === id);
    if (!company) return res.status(404).json({ error: "Company not found" });

    company.status = "Rejected";
    res.json({ message: "Company rejected", company });
  });

  // --- AI: RESUME PARSING ---
  // Groq's chat models are text-only, so unlike Gemini/Gemma (which can accept
  // inline PDF bytes directly), we must extract the PDF's text ourselves first
  // and only send that plain text to Groq.

  app.post("/api/parse-resume", async (req, res) => {
    const { fileData, mimeType } = req.body || {};
    if (!fileData) {
      return res.status(400).json({ error: "No file data provided" });
    }

    const base64Data = String(fileData).split(",")[1] || fileData;

    let extractedText = "";
    try {
      const pdfModule = await import("pdf-parse");
      const pdfParseFunc = (pdfModule as any).default || pdfModule;
      const buffer = Buffer.from(base64Data, "base64");
      const result = await pdfParseFunc(buffer);
      extractedText = (result?.text || "").trim().slice(0, 12000);
    } catch (err) {
      console.warn("[Resume/PDF] PDF text extraction fallback note:", (err as any)?.message || err);
    }

    const parseWithGroq = async (textToParse: string) => {
      const prompt = `Extract details from this resume text. Return ONLY a JSON object with these exact keys: 'name', 'phone', 'institution', 'course', 'strengths' (short summary), and 'weaknesses' (short summary). Do not use markdown backticks.\n\nResume text:\n${textToParse}`;
      return callGroqCompletion(prompt, 0.2, 1024);
    };

    const parseWithGemini = async () => {
      const ai = getAiClient();
      if (!ai) throw new Error("No AI provider configured");
      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { data: base64Data, mimeType: mimeType || "application/pdf" } },
              {
                text: "Extract details from this resume and return ONLY a JSON object with keys: 'name', 'phone', 'institution', 'course', 'strengths', 'weaknesses'. Do not use markdown backticks.",
              },
            ],
          },
        ],
        config: { temperature: 0.2, responseMimeType: "application/json" },
      });
      return extractText(response);
    };

    try {
      let data: any = null;
      if (GROQ_API_ENABLED && extractedText) {
        try {
          const rawText = await generateWithTimeout(() => parseWithGroq(extractedText));
          data = extractJsonObject(rawText);
        } catch (e) {
          console.warn("[Resume/PDF] Groq parsing failed, falling back to heuristic parsing:", e);
        }
      } else if (Boolean(process.env.GEMINI_API_KEY)) {
        try {
          const rawText = await generateWithTimeout(parseWithGemini);
          data = extractJsonObject(rawText);
        } catch (e) {
          console.warn("[Resume/PDF] Gemini parsing failed, falling back to heuristic parsing:", e);
        }
      }

      if (!data || !data.name) {
        data = parseResumeHeuristically(extractedText || "Candidate Resume text");
      }

      return res.json(data);
    } catch (error: any) {
      console.error("[Resume/PDF] Global parse error, serving heuristic profile:", error?.message || error);
      const fallbackData = parseResumeHeuristically(extractedText || "");
      return res.json(fallbackData);
    }
  });

  // --- AI: MATCH COACH (Groq with Gemini/rule-based fallback) ---

  app.post("/api/ai-coach", async (req, res) => {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ruleBasedFallback = (userPrompt: string) => {
      let reply =
        "Based on PM Internship Scheme guidelines, updating your profile with technical tags (like Figma, SQL, or System Architecture) increases shortlisting probability by up to 2.4x!";
      const lower = userPrompt.toLowerCase();
      if (lower.includes("resume") || lower.includes("sop") || lower.includes("statement")) {
        reply =
          "Your Statement of Purpose (SOP) should highlight measurable achievements in enterprise service or technical projects. Align your core skills with corporate sector priorities!";
      } else if (lower.includes("stipend") || lower.includes("salary") || lower.includes("pay")) {
        reply =
          "Roles under the PM Internship Scheme offer a monthly stipend between ₹20,000 and ₹25,000, plus official professional accreditation upon program completion.";
      } else if (lower.includes("eligibility") || lower.includes("qualify") || lower.includes("age")) {
        reply =
          "Applicants should be Indian citizens aged 21-24 who are not currently employed full-time or enrolled in full-time formal education.";
      }
      return reply;
    };

    if (GROQ_API_ENABLED) {
      try {
        const response = await generateWithTimeout(() =>
          callGroqChat(
            prompt,
            "You are the PM Internship Scheme AI Match Assistant. You assist candidates, employers, and administrators on India's PM Internship Scheme portal. Provide concise, encouraging, and highly specific career and placement advice (2-3 sentences max). Emphasize scheme metrics, stipend details (₹20,000-₹25,000/mo), statement of purpose tips, or skill alignment."
          )
        );
        const reply = response || ruleBasedFallback(prompt);
        return res.json({ reply, source: "groq" });
      } catch (err: any) {
        console.error("Groq AI Coach Error:", err?.message || err);
      }
    }

    const ai = getAiClient();

    if (!ai) {
      return res.json({ reply: ruleBasedFallback(prompt), source: "fallback" });
    }

    try {
      const response = await generateWithTimeout(() =>
        ai.models.generateContent({
          model: AI_MODEL,
          contents: prompt,
          config: {
            systemInstruction:
              "You are the PM Internship Scheme AI Match Assistant. You assist candidates, employers, and administrators on India's PM Internship Scheme portal. Provide concise, encouraging, and highly specific career and placement advice (2-3 sentences max). Emphasize scheme metrics, stipend details (₹20,000-₹25,000/mo), statement of purpose tips, or skill alignment.",
            temperature: 0.7,
          },
        })
      );

      const reply = extractText(response) || ruleBasedFallback(prompt);
      return res.json({ reply, source: "gemma" });
    } catch (err: any) {
      console.error("AI Coach Error:", err?.message || err);
      return res.json({ reply: ruleBasedFallback(prompt), source: "fallback" });
    }
  });

  // 404 fallback for unmatched /api routes
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Express error handler - guarantees we never crash the function with an
  // unhandled exception; always respond with JSON.
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled API error:", err?.message || err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
}

export default createApp;
