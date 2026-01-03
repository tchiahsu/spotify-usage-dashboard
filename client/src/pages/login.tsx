import logo from "../assets/spotify_white.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://127.0.0.1:3000";

export default function Login() {
  return (
    <div className="h-screen flex flex-col items-center text-center px-5 overflow-y-hidden">
      <div className="flex flex-col items-center justify-center gap-3 flex-1">
        <img src={logo} alt="spotify_logo" className="h-16 w-auto mb-7"/>
        <p className="text-white font-bold text-6xl">
          Spotify Listening History
        </p>
        <p className="text-white max-w-xl">
          Log in to retrieve the songs, artists, and moments that define your music.
        </p>
        <a
          aria-label="Log in with Spotify"
          className="px-8 py-3 rounded-3xl bg-[#1DB954] text-[#121212] font-bold mt-5 hover:scale-105 active:scale-100"
          href={`${BACKEND_URL}/auth/login`}
        >
          Connect Spotify
        </a>
      </div>
      <p className="text-[#535353] text-xs mb-4">
        Built using the Spotify Web API | Not affiliated with Spotify. <br/>
        © 2026 Tony Hsu Tai & Mishell Cardenas Espinosa
      </p>
    </div>
  );
}