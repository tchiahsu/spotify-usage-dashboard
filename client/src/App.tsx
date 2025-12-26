import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./layout/Menu";
import Profile from "./pages/profile";
import Artist from "./pages/artist";
import Track from "./pages/track";
import Recent from "./pages/recent";
import Playlist from "./pages/playlist";
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        {/* Navigation Bar */}
        <Menu />

        {/* Page Content */}
        <main>
          <Routes>
            <Route path="/" element={<Profile />}  />
            <Route path="/top-artists" element={<Artist />} />
            <Route path="/top-tracks" element={<Track />} />
            <Route path="/recently-played" element={<Recent />} />
            <Route path="/playlists" element={<Playlist />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
