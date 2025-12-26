import type { Request, Response } from "express";
import { refreshAccessToken } from "../utils/util.js";
import type { UserProfile, TopArtist, TopTrack, RecentTracks } from "../types/user.js";
import type { ArtistDetails } from "../types/artist.js";
import type { TrackDetails } from "../types/track.js";
import type { UserPlaylists, PlaylistDetails, PlaylistTracks } from "../types/playlist.js";


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
  try {
    const accessToken = req.cookies.spotify_access_token as string | undefined;
    const refreshToken = req.cookies.spotify_refresh_token as string | undefined;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Access token not found."})
    }

    let data = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50", {
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

      data = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50", {
        headers: { Authorization: `Bearer ${access_token}`}
      })
    }

    if (!data.ok) {
      return res.status(data.status).json({ error: "Failed to fetch profile" });
    }

    const userData = (await data.json()) as TopArtist;

    const topArtistSummary = userData.items.map((a) => ({
      artist_id: a.id,
      artist_follower_total: a.followers.total,
      artist_name: a.name,
      artist_images: a.images[0]?.url ?? null
    }));

    return res.json(topArtistSummary);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching top 50 artists" });
  }
}

/**
 * GET me/top/tracks?time_range=long_term&limit=50
 * URL: https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50
 * Info: top tracks in the long term (50) - track name, image, album name, artist name
 */
export async function getTopTracks(req: Request, res: Response) {
  try {
    const accessToken = req.cookies.spotify_access_token as string | undefined;
    const refreshToken = req.cookies.spotify_refresh_token as string | undefined;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Access token not found."})
    }

    let data = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50", {
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

      data = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50", {
        headers: { Authorization: `Bearer ${access_token}`}
      })
    }

    if (!data.ok) {
      return res.status(data.status).json({ error: "Failed to fetch profile" });
    }

    const userData = (await data.json()) as TopTrack;

    const topTrackSummary = userData.items.map((t) => ({
      track_id: t.id,
      track_name: t.name,
      track_duration: t.duration_ms,
      album_id: t.album.id,
      album_name: t.album.name,
      album_image: t.album.images[0]?.url ?? null,
      artist_name: t.artists.map(a => a.name).join(", ")
    }));

    return res.json(topTrackSummary);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching top 50 tracks" });
  }
}

// --------------------------------------
// Player Web API
// --------------------------------------

/**
 * GET me/player/recently-played?limit=50
 * URL: https://api.spotify.com/v1/me/player/recently-played?limit=50
 * Info: get recently played tracks (50) - id, image, name, album, artist, duration
 */
export async function getRecentlyPlayer(req: Request, res: Response) {
  try {
    const accessToken = req.cookies.spotify_access_token as string | undefined;
    const refreshToken = req.cookies.spotify_refresh_token as string | undefined;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Access token not found."})
    }

    let data = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
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

      data = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
        headers: { Authorization: `Bearer ${access_token}`}
      })
    }

    if (!data.ok) {
      return res.status(data.status).json({ error: "Failed to fetch profile" });
    }

    const userData = (await data.json()) as RecentTracks;

    const RecentTrackSummary = userData.items.map((t) => ({
      track_id: t.track.id,
      track_name: t.track.name,
      track_duration: t.track.duration_ms,
      album_name: t.track.album.name,
      album_image: t.track.album.images[0]?.url ?? null,
      artist_name: t.track.artists.map((a) => a.name).join(", ")
    }));

    return res.json(RecentTrackSummary);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching most recent tracks" });
  }
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
  try {
    const accessToken = req.cookies.spotify_access_token as string | undefined;
    const refreshToken = req.cookies.spotify_refresh_token as string | undefined;
    const id = req.params.id

    if (!id) {
      return res.status(401).json({ error: "Artist ID not found." })
    }

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Access token not found."})
    }

    let data = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
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

      data = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        headers: { Authorization: `Bearer ${access_token}`}
      })
    }

    if (!data.ok) {
      return res.status(data.status).json({ error: "Failed to fetch artist information" });
    }

    const userData = (await data.json()) as ArtistDetails;

    const ArtistSummary = {
      artist_id: userData.id,
      artist_name: userData.name,
      artist_popularity: userData.popularity,
      artist_followers: userData.followers.total,
      artist_genres: userData.genres,
      artist_image: userData.images[0]?.url ?? null
    }

    return res.json(ArtistSummary);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching artist details" });
  }
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
  try {
    const accessToken = req.cookies.spotify_access_token as string | undefined;
    const refreshToken = req.cookies.spotify_refresh_token as string | undefined;
    const id = req.params.id

    if (!id) {
      return res.status(401).json({ error: "Track ID not found." })
    }

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Access token not found."})
    }

    let data = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
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

      data = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: { Authorization: `Bearer ${access_token}`}
      })
    }

    if (!data.ok) {
      return res.status(data.status).json({ error: "Failed to fetch artist information" });
    }

    const userData = (await data.json()) as TrackDetails;

    const TrackSummary = {
      track_id: userData.id,
      track_name: userData.name,
      track_popularity: userData.popularity,
      track_duration: userData.duration_ms,
      artist_names: userData.artists.map((a) => a.name).join(", "),
      album_id: userData.album.id,
      album_name: userData.album.name,
      album_image: userData.album.images[0]?.url ?? null
    }

    return res.json(TrackSummary);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching track details" });
  }
}

// --------------------------------------
// Playlist Web API
// --------------------------------------

/**
 * GET /me/playlists
 * URL: https://api.spotify.com/v1/me/playlists
 * Info: get playlists for the given user
 */
export async function getUserPlaylist(req: Request, res: Response) {
  try {
    const accessToken = req.cookies.spotify_access_token as string | undefined;
    const refreshToken = req.cookies.spotify_refresh_token as string | undefined;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Access token. not found." });
    }

    let data = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
      headers: { Authorization: `Bearer ${accessToken}`}
    })
    
    // Access token expired
    if (data.status === 401) {
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
        maxAge: expires_in * 1000,
      });

      data = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        headers: { Authorization: `Bearer ${access_token}`}
      }); 
    }

    if (!data.ok) {
      return res.status(data.status).json({ error: "Failed to fetch playlists" });
    }

    const userData = (await data.json()) as UserPlaylists;

    const playlistSummary = userData.items.map((p) => ({
      playlist_id: p.id,
      playlist_name: p.name,
      playlist_description: p.description,
      playlist_image: p.images[0]?.url ?? null,
      owner_name: p.owner.display_name,
      total_tracks: p.tracks.total,
      is_public: p.public      
    }));

    return res.json(playlistSummary)
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching user playlists" });
  }
}

/**
 * GET /playlists/{playlist_id}
 * URL: https://api.spotify.com/v1/playlists/{id}
 * Info: description, images, name, owner name, total tracks, 
 */
export async function getPlaylistDetails(req: Request, res: Response) {
  try {
    const accessToken = req.cookies.spotify_access_token as string | undefined;
    const refreshToken = req.cookies.spotify_refresh_token as string | undefined;
    const id = req.params.id

    if (!id) {
      return res.status(401).json({ error: "Playlist ID not found." })
    }

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Access token not found."})
    }

    let data = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
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

      data = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: { Authorization: `Bearer ${access_token}`}
      })
    }

    if (!data.ok) {
      return res.status(data.status).json({ error: "Failed to fetch playlist information" });
    }

    const userData = (await data.json()) as PlaylistDetails;

    const PlaylistSummary = {
      playlist_id: userData.id,
      playlist_name: userData.name,
      playlist_description: userData.description,
      is_public: userData.public,
      playlist_image: userData.images[0]?.url ?? null,
      playlist_owner: userData.owner.display_name,
      playlist_num_track: userData.tracks.total
    }

    return res.json(PlaylistSummary);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching playlist details" });
  }
}

/**
 * GET /playlists/{playlist id}/tracks
 * URL: https://api.spotify.com/v1/playlists/{id}/tracks?limit=50
 * Info: track name, album_name, artist_name
 */
export async function getPlaylistTracks(req: Request, res: Response) {
  try {
    const accessToken = req.cookies.spotify_access_token as string | undefined;
    const refreshToken = req.cookies.spotify_refresh_token as string | undefined;
    const id = req.params.id;
    const limit = Math.min(Number(req.query.limit ?? 50), 100);
    const offset = Math.max(Number(req.query.offset ?? 0), 0);

    if (!id) {
      return res.status(401).json({ error: "Playlist ID not found"})
    }

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Access token not found." });
    }

    let data = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=${limit}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${accessToken}`}
    })
    
    // Access token expired
    if (data.status === 401) {
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
        maxAge: expires_in * 1000,
      });

      data = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=${limit}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${access_token}`}
      }); 
    }

    if (!data.ok) {
      return res.status(data.status).json({ error: "Failed to fetch playlists" });
    }

    const userData = (await data.json()) as PlaylistTracks;

    const playlistTrackSummary = userData.items.filter((i) => i.track).map((p) => ({
      track_id: p.track!.id,
      track_name: p.track!.name,
      track_album: p.track!.album.name,
      artist_name: p.track!.artists.map((a) => a.name).join(", "),
    }));

    return res.json({
      total: userData.total,
      limit: userData.limit,
      offset: userData.offset,
      items: playlistTrackSummary
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error fetching user playlists" });
  }
}
