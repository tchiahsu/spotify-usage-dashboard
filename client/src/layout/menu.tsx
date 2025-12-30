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
    <div className="absolute top-0 inset-0 shadow-xl overflow-y-hidden">
      <div className="bg-[#121212] text-white h-full w-27 my-5 flex flex-col justify-between items-center">
        {/* Spotify Logo */}
        <img src={logo} alt="spotify_logo" className="flex justify-center items-center h-13 w-auto cursor-pointer"/>

        {/* Navigation Bar */}
        <nav className="w-full">
          <ul className="flex flex-col">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    "flex flex-col gap-1 h-20 justify-center items-center border-l-6 transition-all duration-200",
                    isActive ? "opacity-100 border-[#1DB954] bg-[#212121]" : "opacity-80 border-[#121212] hover:opacity-100 hover:border-[#1DB954] hover:bg-[#212121]"
                  )
                }
              >
                <Icon className="text-3xl" />
                <div className="text-xs">{label}</div>
              </NavLink>
            ))}
          </ul>
        </nav>
        
        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="mb-15 opacity-60 hover:opacity-100 hover:scale-105 active:scale-100 transition"
        >
          <IoExitOutline className="text-3xl"/>
        </button>

      </div>
    </div>
  )
}