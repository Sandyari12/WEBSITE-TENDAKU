import { useState, useEffect } from 'react';
import { Drawer, Button as AntButton, message, Modal } from 'antd';
import { getPlaylists, createPlaylist, deletePlaylist, updatePlaylist } from '../utils/api';

function KelolaPlaylist() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    play_name: '', play_url: '', play_thumbnail: '', play_genre: '', play_description: ''
  });
  const [editPlaylistId, setEditPlaylistId] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const data = await getPlaylists();
        setPlaylists(data);
      } catch (err) {
        message.error('Gagal mengambil data playlist');
      }
      setLoading(false);
    };
    fetchPlaylists();
  }, []);

  const handleAddPlaylist = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('play_name', newPlaylist.play_name);
      formData.append('play_url', newPlaylist.play_url);
      formData.append('play_thumbnail', newPlaylist.play_thumbnail);
      formData.append('play_genre', newPlaylist.play_genre);
      formData.append('play_description', newPlaylist.play_description);
      await createPlaylist(formData);
      message.success('Playlist berhasil ditambahkan!');
      setDrawerOpen(false);
      setNewPlaylist({ play_name: '', play_url: '', play_thumbnail: '', play_genre: '', play_description: '' });
      const data = await getPlaylists();
      setPlaylists(data);
    } catch (err) {
      message.error('Gagal menambah playlist');
    }
  };

  const handleEditPlaylist = (playlist) => {
    setEditPlaylistId(playlist.id);
    setNewPlaylist({
      play_name: playlist.play_name || '',
      play_url: playlist.play_url || '',
      play_thumbnail: playlist.play_thumbnail || '',
      play_genre: playlist.play_genre || '',
      play_description: playlist.play_description || '',
    });
    setDrawerOpen(true);
  };

  const handleEditPlaylistSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('play_name', newPlaylist.play_name);
      formData.append('play_url', newPlaylist.play_url);
      formData.append('play_thumbnail', newPlaylist.play_thumbnail);
      formData.append('play_genre', newPlaylist.play_genre);
      formData.append('play_description', newPlaylist.play_description);
      await updatePlaylist(editPlaylistId, formData);
      message.success('Playlist berhasil diupdate!');
      setDrawerOpen(false);
      setEditPlaylistId(null);
      setNewPlaylist({ play_name: '', play_url: '', play_thumbnail: '', play_genre: '', play_description: '' });
      const data = await getPlaylists();
      setPlaylists(data);
    } catch (err) {
      message.error('Gagal mengupdate playlist');
    }
  };

  const handleDeletePlaylist = (id) => {
    Modal.confirm({
      title: 'Konfirmasi Hapus Playlist',
      content: 'Yakin ingin menghapus playlist ini?',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      async onOk() {
        try {
          await deletePlaylist(id);
          message.success('Playlist berhasil dihapus!');
          const data = await getPlaylists();
          setPlaylists(data);
        } catch (err) {
          message.error('Gagal menghapus playlist');
        }
      },
    });
  };

  return (
    <div className="space-y-8">
      <AntButton type="primary" className="mb-4" style={{ backgroundColor: '#2C3E50', borderColor: '#2C3E50' }} onClick={() => { setDrawerOpen(true); setEditPlaylistId(null); setNewPlaylist({ play_name: '', play_url: '', play_thumbnail: '', play_genre: '', play_description: '' }); }}>
        Tambah Playlist
      </AntButton>
      <Drawer
        title={<span style={{ color: '#2C3E50' }}>{editPlaylistId ? 'Edit Playlist' : 'Tambah Playlist Baru'}</span>}
        placement="right"
        onClose={() => { setDrawerOpen(false); setEditPlaylistId(null); setNewPlaylist({ play_name: '', play_url: '', play_thumbnail: '', play_genre: '', play_description: '' }); }}
        open={drawerOpen}
        width={400}
      >
        <form onSubmit={editPlaylistId ? handleEditPlaylistSubmit : handleAddPlaylist} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Judul Playlist</label>
            <input type="text" required value={newPlaylist.play_name} onChange={e => setNewPlaylist(prev => ({ ...prev, play_name: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">URL Video</label>
            <input type="url" required value={newPlaylist.play_url} onChange={e => setNewPlaylist(prev => ({ ...prev, play_url: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">URL Thumbnail</label>
            <input type="url" required value={newPlaylist.play_thumbnail} onChange={e => setNewPlaylist(prev => ({ ...prev, play_thumbnail: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Genre</label>
            <select required value={newPlaylist.play_genre} onChange={e => setNewPlaylist(prev => ({ ...prev, play_genre: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Genre</option>
              <option value="music">Music</option>
              <option value="song">Song</option>
              <option value="education">Education</option>
              <option value="movie">Movie</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Deskripsi</label>
            <textarea required value={newPlaylist.play_description} onChange={e => setNewPlaylist(prev => ({ ...prev, play_description: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">{editPlaylistId ? 'Update Playlist' : 'Tambah Playlist'}</button>
          </div>
        </form>
      </Drawer>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Daftar Playlist</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Judul</th>
                <th className="text-left py-3 px-4">Genre</th>
                <th className="text-left py-3 px-4">URL Video</th>
                <th className="text-left py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {playlists.map(playlist => (
                <tr key={playlist.id} className="border-b">
                  <td className="py-3 px-4">{playlist.play_name}</td>
                  <td className="py-3 px-4">{playlist.play_genre}</td>
                  <td className="py-3 px-4">
                    <a href={playlist.play_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Lihat Video</a>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => handleEditPlaylist(playlist)} className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDeletePlaylist(playlist.id)} className="text-red-600 hover:text-red-700">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default KelolaPlaylist; 