/*
Get Follower Count, Following Count, Playlist Count, Profile Picture, Name
Get Recebtly Played (Horizontal Scroll, show last 10, allow to see more)
Top Artists All Time (show top 10, allow to see more)
Top Tracks All Time (show top 10, allow to see more)
All See more is a link to a new page with full list
See Playlists (can click to see all songs in playlist, and get recommendations should show a small drop down)
*/
// authRoutes.ts
import express from 'express';
import crypto from "crypto";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!; // e.g. http://localhost:8888/auth/callback

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-top-read",
  "user-follow-read",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");


function generateRandomString(bytes: number) {
  return crypto.randomBytes(bytes).toString("hex");
}

app.get("/login", (req, res) => {
  const state = generateRandomString(16);

  res.cookie("spotify_auth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000 // 10 minutes
  });

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

app.get("/callback", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : null;
  const state = typeof req.query.state === "string" ? req.query.state : null;

  const storedState = req.cookies.spotify_auth_state;

  if (!state || !storedState || state !== storedState) {
    const errParams = new URLSearchParams({ error: "state_mismatch" });
    return res.redirect(`/#${errParams.toString()}`)
  }

  if (!code) {
    const errParams = new URLSearchParams({ error: "missing_code" });
    return res.redirect(`/#${errParams.toString()}`)
  }

  // Clear state cookie
  res.clearCookie("spotify_auth_state");

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
      const errParams = new URLSearchParams({ error: "token_exchange_failed" });
      return res.redirect(`/#${errParams.toString()}`);
    }

    const { access_token, refresh_token, expires_in } = tokenJson as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };

    // Access token
    res.cookie("spotify_access_token", access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in * 1000,
    });

    // Refresh token
    if (refresh_token) {
      res.cookie("spotify_refresh_token", refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    return res.redirect("/main");
  } catch {
      const errParams = new URLSearchParams({ error: "server_error" });
      return res.redirect(`/#${errParams.toString()}`);
  }
});