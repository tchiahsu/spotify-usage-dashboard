import { Router } from "express";
import {
  getProfileSummary,
  getTopArtist,
  getTopTracks,
  getRecentlyPlayer,
  getArtistDetails,
  getTrackDetails,
  getUserPlaylist,
  getPlaylistDetails,
  getPlaylistTracks
} from "./client.js"

export const router = Router();

// --------------------------------------
// User Web API
// --------------------------------------

/**
 * GET /profile/summary
 * Info: display name, profile image, followers
 */
router.get("/profile/summary", getProfileSummary)

/**
 * GET /artist/top-50
 * Info: top artists in the long term (50) - name, image, followers
 */
router.get("/artist/50", getTopArtist)

/**
 * GET /track/top-50
 * Info: top tracks in the long term (50) - track name, image, album name, artist name
 */
router.get("/track/50", getTopTracks)

// --------------------------------------
// Player Web API
// --------------------------------------

/**
 * GET me/player/recently-played?limit=50
 * Info: get recently played tracks (50)
 */
router.get("/profile/recent/50", getRecentlyPlayer)

// --------------------------------------
// Artists Web API
// --------------------------------------

/**
 * GET /artists/{id}
 * Info: name, image, followers, genres, popularity
 */
router.get("/artist/summary", getArtistDetails)

// --------------------------------------
// Tracks Web API
// --------------------------------------

/**
 * GET /tracks/{id}
 * Info: track name, image, popularity, artist name, album_tracks, release_date, duration_ms
 */
router.get("/track/summary", getTrackDetails)

// --------------------------------------
// Playlist Web API
// --------------------------------------

/**
 * GET users/{username}/playlists
 * Info: get playlists for the given user
 */
router.get("/profile/playlist", getUserPlaylist)

/**
 * GET /playlists/{playlist_id}
 * Info: description, images, name, owner name, total tracks, 
 */
router.get("/playlist/summary", getPlaylistDetails)

/**
 * GET /playlists/{playlist id}/tracks
 * Info: track name, album_name, artist_name
 */
router.get("/playlist/tracks", getPlaylistTracks)


export default router;