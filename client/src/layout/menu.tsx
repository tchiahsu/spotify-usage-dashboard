import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { IoMusicalNotes } from "react-icons/io5";
import { BsFillPersonFill } from "react-icons/bs";
import { PiPlaylist } from "react-icons/pi";
import { MdReplay } from "react-icons/md";
import { BiAlbum } from "react-icons/bi";
import { IoExitOutline } from "react-icons/io5";

import clsx from "clsx";
import logo from "../assets/spotify_green.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://localhost:3000";

const navItems = [
  { to: "/profile", label: "Profile", icon: BsFillPersonFill },
  { to: "/top-artists", label: "Top Artists", icon: IoMusicalNotes },
  { to: "/top-tracks", label: "Top Tracks", icon: BiAlbum },
  { to: "/recently-played", label: "Recent", icon: MdReplay },
  { to: "/playlists", label: "Playlists", icon: PiPlaylist },
]

export default function Menu() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      navigate("/");
    }
  }

  return (
    <div
      className={clsx(
        "bg-[#121212] text-white shadow-xl z-50",
        "fixed bottom-0 left-0 right-0 h-16 w-full",
        "flex gap-2 items-center justify-between px-3",
        "md:static md:h-screen md:w-22 md:flex-col md:justify-between md:items-center md:py-6 md:px-0"
      )}
    >
      {/* Spotify Logo */}
      <a href="/profile" className="hidden md:block">
        <img src={logo} alt="spotify_logo" className="flex justify-center items-center h-10 w-auto cursor-pointer"/>
      </a>

      {/* Navigation Bar */}
      <nav className="w-full">
        <ul className="flex w-full justify-around md:flex-col md:justify-start">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col gap-1 justify-center items-center transition-all duration-200 h-16 w-1/5 border-b-4",
                  "md:w-auto md:border-b-0 md:border-l-6 md:rounded-none md:px-0",
                  isActive ? "opacity-100 border-[#1DB954] bg-[#212121]" : "opacity-80 border-[#121212] hover:opacity-100 hover:border-[#1DB954] hover:bg-[#212121]"
                )
              }
            >
              <Icon className="text-2xl" />
              <div className="text-[10px]">{label}</div>
            </NavLink>
          ))}
        </ul>
      </nav>
      
      <button
        onClick={handleLogout}
        aria-label="Log out"
        className="flex flex-col items-center w-1/6 border-l-2 border-[#212121] px-2 md:border-none md:w-auto md:mb-5 md:opacity-60 md:hover:opacity-100 md:hover:scale-105 md:active:scale-100 md:transition"
      >
        <IoExitOutline className="text-2xl rotate-180"/>
        <div className="md:hidden text-[10px]">Sign Out</div>
      </button>

    </div>
  )
}