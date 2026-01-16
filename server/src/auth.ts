import { Router } from "express";
import crypto from "crypto";

const router = Router();

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://127.0.0.1:5173";
const isHttps = FRONTEND_ORIGIN.startsWith("https://");

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-top-read",
  "user-follow-read",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

const stateStore = new Map<string, number>();

// Remove expires states each minutes
setInterval(() => {
  const now = Date.now();
  for (const [state, createdAt] of stateStore) {
    if (now - createdAt > 10 * 60 * 1000) {
      stateStore.delete(state);
    }
  }
}, 60 * 1000);

function generateRandomString(bytes: number) {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * GET /auth/login
 * Redirect user to Spotfiy authorization page
 */
router.get("/login", (req, res) => {
  const state = generateRandomString(16);
  stateStore.set(state, Date.now());

  console.log("=== Login Debug ===");
  console.log("Generated state:", state);
  console.log("Store size:", stateStore.size);
  console.log("===================");

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state,
    show_dialog: "true",
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

/**
 * GET /auth/callback
 * Exchange authorization code for access tokens
 */
router.get("/callback", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : null;
  const state = typeof req.query.state === "string" ? req.query.state : null;

  // Debug logging
  console.log("=== Callback Debug ===");
  console.log("State from URL:", state);
  console.log("States in store:", [...stateStore.keys()]);
  console.log("State exists in store:", state ? stateStore.has(state) : false);
  console.log("Cookies received:", req.cookies);
  console.log("====================");

  if (!state || !stateStore.has(state)) {
    return res.redirect(`${FRONTEND_ORIGIN}/?error=state_mismatch`);
  }
  stateStore.delete(state);

  if (!code) {
    return res.redirect(`${FRONTEND_ORIGIN}/?error=missing_code`);
  }

  // Clear state cookie
  res.clearCookie("spotify_auth_state", { path: "/" });

  // Token exchange
  try {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const body = new URLSearchParams({
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code"
    });

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: body.toString(),
    });

    const tokenJson = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.redirect(`${FRONTEND_ORIGIN}/?error=token_exchange_failed`);
    }

    const { access_token, refresh_token, expires_in } = tokenJson as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };

    // Access token
    res.cookie("spotify_access_token", access_token, {
      httpOnly: true,
      sameSite: isHttps ? "none" : "lax",
      secure: isHttps,
      maxAge: expires_in * 1000,
      path: "/",
    });

    // Refresh toke
    if (refresh_token) {
      res.cookie("spotify_refresh_token", refresh_token, {
        httpOnly: true,
        sameSite: isHttps ? "none" : "lax",
        secure: isHttps,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });
    }

    return res.redirect(`${FRONTEND_ORIGIN}/profile`);
  } catch {
    return res.redirect(`${FRONTEND_ORIGIN}/?error=server_error`);
  }
});

/**
 * POST /auth/logout
 * Clear auth cookies
 */
router.post("/logout", (_, res) => {

  const clearOpts = {
    path: "/",
    sameSite: isHttps ? "none" as const : "lax" as const,
    secure: isHttps,
  };

  res.clearCookie("spotify_auth_state", clearOpts);
  res.clearCookie("spotify_access_token", clearOpts);
  res.clearCookie("spotify_refresh_token", clearOpts);

  res.json({ ok: true });
})

export default router;