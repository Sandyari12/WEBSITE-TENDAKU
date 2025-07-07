// ✅ Playlist.jsx (versi READ ONLY - sama seperti Products)
import { useEffect, useState } from "react";
import { Card, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import playlistHeader from '../assets/playlist_camp.jpeg';

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try {
      const res = await fetch("/api/v1/playlist");
      const data = await res.json();
      setPlaylists(data.datas || []);
    } catch (error) {
      message.error("Gagal mengambil data playlist");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const grouped = playlists.reduce((acc, p) => {
    const genre = p.play_genre || "Uncategorized";
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div
        className="w-full h-56 md:h-64 lg:h-72 flex items-center justify-center relative rounded-b-2xl overflow-hidden mb-8"
        style={{
          backgroundImage: `url(${playlistHeader})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg mb-2">
            PLAYLIST VIDEO TENDAKU
          </h1>
          <p className="text-white text-base md:text-lg mb-4 drop-shadow">
            Jelajahi Kumpulan Video Playlist Tips dan Trik untuk Pengalaman Camping Terbaikmu.
          </p>
          <span className="inline-block bg-white/80 text-[#2C3E50] font-semibold px-4 py-1 rounded-full text-sm shadow">
            {playlists.length} Video Tersedia
          </span>
        </div>
      </div>

      {/* Section Semua Playlist */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-2">Semua Playlist</h2>
      {Object.keys(grouped).map((genre) => (
        <div key={genre} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <PlayCircleOutlined className="text-blue-600" />
              <span className="text-xl font-semibold capitalize">{genre}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {grouped[genre].map((playlist) => (
                <div
                key={playlist.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group relative cursor-pointer"
                >
                  <a
                    href={playlist.play_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    title="Tonton di YouTube"
                  >
                    <div className="relative">
                      <img
                        alt={playlist.play_name}
                        src={playlist.play_thumbnail}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <PlayCircleOutlined style={{ fontSize: 48, color: 'white' }} />
                      </div>
                    </div>
                  </a>
                  <div className="px-3 pt-2 pb-3">
                    <div className="font-bold text-base text-gray-800">{playlist.play_name}</div>
                    <div className="text-gray-600 text-sm">{playlist.play_description}</div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Playlist;
