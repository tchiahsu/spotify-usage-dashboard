import logo from "../assets/spotify_white.png";

export default function Login() {
  return (
    <div className="h-screen flex flex-col items-center text-center px-5 overflow-y-h">
      <div className="flex flex-col items-center justify-center gap-3 flex-1">
        <img src={logo} alt="spotify_logo" className="h-17 w-auto mb-7"/>
        <p className="text-white font-bold text-5xl">
          Spotify Listening History
        </p>
        <p className="text-white max-w-xl">
          Log in to retrieve the songs, artists, and moments that defined your music.
        </p>
        <a
          className="px-20 py-2 rounded-3xl bg-[#1DB954] text-[#121212] font-semibold mt-3"
          href="/auth/login"
        >
          Log In
        </a>
      </div>
      <p className="text-[#535353] text-sm h-15">
        Built using the Spotify Web API | Not affiliated with Spotify. <br/>
        © 2026 Tony Hsu Tai & Mishell Cardenas Espinosa
      </p>
    </div>
  );
}