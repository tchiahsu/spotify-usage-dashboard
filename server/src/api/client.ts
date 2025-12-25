import type { Request, Response } from "express";
import { refreshAccessToken } from "../utils/util.js";
import type { UserProfile } from "../types/user.js";

// --------------------------------------
// User Web API
// --------------------------------------

/**
 * GET /me
 * URL: https://api.spotify.com/v1/me
 * Info: display name, profile image, followers
 */
export async function getProfileSummary(req: Request, res: Response) {
  try {
    const accessToken = req.cookies.spotify_access_token as string | undefined;
    const refreshToken = req.cookies.spotify_refresh_token as string | undefined;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Access token not found."})
    }

    let data = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}`}
    })

    // Access token is invalid or expired
    if (!data || data.status === 401) {
      if (!refreshToken) {
        return res.status(401).json({ error: "Missing refresh token" });
      }

      const refreshed = await refreshAccessToken(refreshToken);
      if (!refreshed.ok) {
        res.clearCookie("spotify_access_token");
        res.clearCookie("spotify_refresh_token");
        return res.status(401).json({ error: "Session expired" });
      }

      const { access_token, expires_in } = refreshed.data;

      res.cookie("spotify_access_token", access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: expires_in * 1000
      });

      data = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${access_token}`}
      })
    }

    if (!data.ok) {
      return res.status(data.status).json({ error: "Failed to fetch profile" });
    }

    const userData = (await data.json()) as UserProfile;

    const profileSummary = {
      id: userData.id,
      displayName: userData.display_name,
      folowers: userData.followers.total,
      imageUrl: userData.images.url,
    };

    return res.json(profileSummary);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching user profile information" });
  }
}

/**
 * GET /me/top/artists?time_range=long_term&limit=50
 * URL: https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50
 * Info: top artists in the long term (50) - name, image, followers
 */
export async function getTopArtist(req: Request, res: Response) {

}

/**
 * GET me/top/tracks?time_range=long_term&limit-50
 * URL: https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50
 * Info: top tracks in the long term (50) - track name, image, album name, artist name
 */
export async function getTopTracks(req: Request, res: Response) {

}

// --------------------------------------
// Player Web API
// --------------------------------------

/**
 * GET me/player/recently-played?limit=50
 * URL: https://api.spotify.com/v1/me/player/recently-played?limit=50
 * Info: get recently played tracks (50)
 */
export async function getRecentlyPlayer(req: Request, res: Response) {

}

// --------------------------------------
// Artists Web API
// --------------------------------------

/**
 * GET /artists/{id}
 * URL: https://api.spotify.com/v1/artists/{id}
 * Info: name, image, followers, genres, popularity
 */
export async function getArtistDetails(req: Request, res: Response) {

}

// --------------------------------------
// Tracks Web API
// --------------------------------------

/**
 * GET /tracks/{id}
 * URL: https://api.spotify.com/v1/tracks/{id}
 * Info: track name, image, popularity, artist name, album_tracks, release_date, duration_ms
 */
export async function getTrackDetails(req: Request, res: Response) {

}

// --------------------------------------
// Playlist Web API
// --------------------------------------

/**
 * GET users/{username}/playlists
 * URL: https://api.spotify.com/v1/users/smedjan/playlists
 * Info: get playlists for the given user
 */
export async function getUserPlaylist(req: Request, res: Response) {

}

/**
 * GET /playlists/{playlist_id}
 * URL: https://api.spotify.com/v1/playlists/{id}
 * Info: description, images, name, owner name, total tracks, 
 */
export async function getPlaylistDetails(req: Request, res: Response) {

}

/**
 * GET /playlists/{playlist id}/tracks
 * URL: https://api.spotify.com/v1/playlists/{id}/tracks?limit=50
 * Info: track name, album_name, artist_name
 */
export async function getPlaylistTracks(req: Request, res: Response) {

}
