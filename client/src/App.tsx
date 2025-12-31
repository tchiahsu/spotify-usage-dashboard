import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/login";
import Menu from "./layout/menu";
import Profile from "./pages/profile";
import Artist from "./pages/artist";
import Track from "./pages/track";
import Recent from "./pages/recent";
import Playlist from "./pages/playlist";
import SinglePlaylist from "./pages/single_playlist";
import './App.css'

function AuthLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="sticky top-0 h-screen shrink-0">
        <Menu />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Login />} />

          {/* Private routes */}
          <Route element={<AuthLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/main" element={<Profile />} />
            <Route path="/top-artists" element={<Artist />} />
            <Route path="/top-tracks" element={<Track />} />
            <Route path="/recently-played" element={<Recent />} />
            <Route path="/playlists" element={<Playlist />} />
            <Route path="/playlists/:playlistId" element={<SinglePlaylist />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App