import { useState } from "react";
import ContactForm from "../components/ContactForm";
import logo from "../assets/spotify_white.png";
import demo from "../assets/spotify_demo.mp4";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://127.0.0.1:3000";

export default function Login() {
  const [requestAccess, setRequestAccess] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col items-center px-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] py-10 w-full items-center justify-center gap-3 flex-1">
        <div className="flex flex-col gap-5 mx-4 items-center">
          <img src={logo} alt="spotify_logo" className="h-12 w-12"/>
          <p className="flex justify-center text-5xl text-white font-bold mb-5">
            Spotify Stats
          </p>
          <div className="flex flex-col w-full items-start gap-5">
            <p className="text-white text-md">
              Due to recent Spotify Web API policy changes, only whitelisted account can log in
              to this application. If you'd like to explore your personal listening stats, you can
              request access below and I'll add you as soon as possible.
            </p>
            <p className="text-[#1DB954] text-md font-semibold">
              Already whitelisted? Connect your Spotify account below.
            </p>
            <p className="text-white text-md font-bold">
              To skip the hassle, check out the demo video on the on the screen to see the app in action.
            </p>
          </div>
          <div className="flex flex-row gap-5 sm:mt-5 mb-5 lg:mb-0 text-center">
            <a
              aria-label="Log in with Spotify"
              className="px-8 py-3 rounded-3xl bg-[#1DB954] text-[#121212] font-bold mt-5 hover:scale-105 active:scale-100"
              href={`${BACKEND_URL}/auth/login`}
            >
              Connect Spotify
            </a>
            <button
              aria-label="Log in with Spotify"
              className="px-8 py-3 rounded-3xl bg-[#000000] text-white font-bold mt-5 hover:scale-105 active:scale-100 cursor-pointer"
              onClick={() => setRequestAccess(true)}
            >
              Request Access
            </button>
          </div>
          {requestAccess && <ContactForm />}
        </div>
        <div className="relative w-full overflow-hidden rounded-xl aspect-video bg-[#121212]">
          <video
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full p-1 rounded-xl object-cover"
          >
            <source src={demo} type="video/mp4" />
          </video>
        </div>
      </div>
      <p className="text-[#535353] text-xs mb-4 text-center">
        Built using the Spotify Web API | Not affiliated with Spotify. <br/>
        © 2026 Tony Hsu Tai & Mishell Cardenas Espinosa
      </p>
    </div>
  );
}