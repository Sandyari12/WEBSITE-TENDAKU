import { useState, useEffect } from 'react'
import { Drawer, Button as AntButton, message, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getRentals,
  updateRental,
  deleteRental,
} from '../utils/api'

function Admin() {
  const [activeTab, setActiveTab] = useState('products')
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    additionalInfo: '',
  })

  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      play_name: 'Cara Setup Tenda Dome',
      play_url: 'https://www.youtube.com/watch?v=example1',
      play_thumbnail: 'https://example.com/thumbnail1.jpg',
      play_genre: 'education',
      play_description: 'Video tutorial lengkap cara setup tenda dome dengan mudah'
    },
    {
      id: 2,
      play_name: 'Tips Camping Aman',
      play_url: 'https://www.youtube.com/watch?v=example2',
      play_thumbnail: 'https://example.com/thumbnail2.jpg',
      play_genre: 'education',
      play_description: 'Panduan keamanan saat camping di alam terbuka'
    }
  ])

  const [newPlaylist, setNewPlaylist] = useState({
    play_name: '',
    play_url: '',
    play_thumbnail: '',
    play_genre: '',
    play_description: ''
  })

  useEffect(() => {
    if (!isAdmin) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        message.error('Gagal mengambil data produk');
      }
      setLoading(false);
    };
    fetchProducts();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await getRentals();
        setOrders(data);
      } catch (err) {
        message.error('Gagal mengambil data pesanan');
      }
      setLoadingOrders(false);
    };
    fetchOrders();
  }, [isAdmin]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      formData.append('image', newProduct.image);
      formData.append('description', newProduct.description);
      await createProduct(formData);
      message.success('Produk berhasil ditambahkan!');
      setDrawerOpen(false);
      setNewProduct({ name: '', category: '', price: '', stock: '', image: '', description: '', additionalInfo: '' });
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      message.error('Gagal menambah produk');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      await updateRental(orderId, formData);
      message.success('Status pesanan berhasil diubah!');
      const data = await getRentals();
      setOrders(data);
    } catch (err) {
      message.error('Gagal mengubah status pesanan');
    }
  };

  const handleEditClick = (product) => {
    setEditId(product.id);
    setEditData({ ...product });
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('category', editData.category);
      formData.append('price', editData.price);
      formData.append('stock', editData.stock);
      formData.append('image', editData.image);
      formData.append('description', editData.description);
      await updateProduct(editId, formData);
      message.success('Produk berhasil diubah!');
      setEditId(null);
      setEditData({});
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      message.error('Gagal mengubah produk');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Konfirmasi Hapus Produk',
      content: 'Yakin ingin menghapus produk ini?',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      async onOk() {
        try {
          await deleteProduct(id);
        message.success('Produk berhasil dihapus!');
          const data = await getProducts();
          setProducts(data);
        } catch (err) {
          message.error('Gagal menghapus produk');
        }
      },
    });
  };

  const handleAddPlaylist = (e) => {
    e.preventDefault();
    const playlist = {
      id: playlists.length > 0 ? Math.max(...playlists.map(p => p.id)) + 1 : 1,
      ...newPlaylist,
    };
    setPlaylists([...playlists, playlist]);
    setNewPlaylist({
      play_name: '',
      play_url: '',
      play_thumbnail: '',
      play_genre: '',
      play_description: ''
    });
    message.success('Playlist berhasil ditambahkan!');
  };

  const handleDeletePlaylist = (id) => {
    Modal.confirm({
      title: 'Konfirmasi Hapus Playlist',
      content: 'Yakin ingin menghapus playlist ini?',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk() {
        setPlaylists(playlists.filter(p => p.id !== id));
        message.success('Playlist berhasil dihapus!');
      },
    });
  };

  const handleDeleteOrder = (orderId) => {
    Modal.confirm({
      title: 'Konfirmasi Hapus Pesanan',
      content: 'Yakin ingin menghapus pesanan ini?',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      async onOk() {
        try {
          await deleteRental(orderId);
          message.success('Pesanan berhasil dihapus!');
          const data = await getRentals();
          setOrders(data);
        } catch (err) {
          message.error('Gagal menghapus pesanan');
        }
      },
    });
  };

  // Dummy statistics for cards
  const stats = [
    { label: 'Total Produk', value: products.length, color: 'text-blue-600' },
    { label: 'Pesanan Selesai', value: orders.filter(o => o.status === 'completed').length, color: 'text-green-600' },
    { label: 'Pesanan Menunggu', value: orders.filter(o => o.status === 'pending').length, color: 'text-yellow-600' },
    { label: 'Pesanan Dibatalkan', value: 0, color: 'text-red-600' },
  ];

  // Render hanya jika admin
  if (!isAdmin) {
    return <div className="text-center mt-12">Anda tidak memiliki akses ke halaman ini.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tombol Kembali ke Beranda */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 mb-4 hover:bg-gray-100 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span>Kembali ke Beranda</span>
      </button>
      {/* Admin Header */}
      <div className="bg-[#2C3E50] rounded-xl p-6 mb-8 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-100 mt-1">Kelola produk & pesanan dengan mudah</p>
        </div>
        <div className="bg-white rounded-full p-3 shadow">
          <svg className="w-8 h-8 text-[#2C3E50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19c-4.418 0-8-1.79-8-4V7a4 4 0 014-4h8a4 4 0 014 4v8c0 2.21-3.582 4-8 4z" />
          </svg>
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 shadow border border-[#2C3E50] flex flex-col items-center">
            <span className="text-2xl font-bold text-[#2C3E50]">{stat.value}</span>
            <span className="text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'products'
              ? 'bg-[#2C3E50] text-white shadow'
              : 'bg-gray-100 text-[#2C3E50] hover:bg-blue-100'
          }`}
          onClick={() => setActiveTab('products')}
        >
          Kelola Peralatan
        </button>
        <button
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'playlists'
              ? 'bg-[#2C3E50] text-white shadow'
              : 'bg-gray-100 text-[#2C3E50] hover:bg-blue-100'
          }`}
          onClick={() => setActiveTab('playlists')}
        >
          Kelola Playlist
        </button>
        <button
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'orders'
              ? 'bg-[#2C3E50] text-white shadow'
              : 'bg-gray-100 text-[#2C3E50] hover:bg-blue-100'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Kelola Pesanan
        </button>
      </div>

      {/* Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          {/* Add Product Button */}
          <AntButton type="primary" className="mb-4" style={{ backgroundColor: '#2C3E50', borderColor: '#2C3E50' }} onClick={() => setDrawerOpen(true)}>
            Tambah Peralatan
          </AntButton>
          {/* Drawer for Add Product Form */}
          <Drawer
            title={<span style={{ color: '#2C3E50' }}>Tambah Peralatan Baru</span>}
            placement="right"
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            width={400}
          >
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nama Peralatan
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Kategori
                </label>
                <select
                  required
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="tent">Tenda</option>
                  <option value="cooking">Peralatan Masak</option>
                  <option value="sleeping-bag">Sleeping Bag</option>
                  <option value="peralatan-penerangan">Peralatan Penerangan</option>
                  <option value="hiking">Peralatan Hiking</option>
                  <option value="backpack">Ransel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Harga per Hari
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Stok
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  URL Gambar
                </label>
                <input
                  type="url"
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Deskripsi singkat produk"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Info Tambahan
                </label>
                <textarea
                  value={newProduct.additionalInfo}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Info tambahan (opsional)"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Tambah Peralatan
                </button>
              </div>
            </form>
          </Drawer>
          {/* Products List */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Daftar Peralatan</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nama</th>
                    <th className="text-left py-3 px-4">Kategori</th>
                    <th className="text-left py-3 px-4">Harga</th>
                    <th className="text-left py-3 px-4">Stok</th>
                    <th className="text-left py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b">
                      {editId === product.id ? (
                        <>
                          <td className="py-3 px-4">
                            <input
                              name="name"
                              value={editData.name}
                              onChange={handleEditChange}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <select
                              name="category"
                              value={editData.category}
                              onChange={handleEditChange}
                              className="w-full px-2 py-1 border rounded"
                            >
                              <option value="tent">Tenda</option>
                              <option value="cooking">Peralatan Masak</option>
                              <option value="sleeping-bag">Sleeping Bag</option>
                              <option value="peralatan-penerangan">Peralatan Penerangan</option>
                              <option value="hiking">Peralatan Hiking</option>
                              <option value="backpack">Ransel</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              name="price"
                              type="number"
                              value={editData.price}
                              onChange={handleEditChange}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              name="stock"
                              type="number"
                              value={editData.stock}
                              onChange={handleEditChange}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button onClick={handleEditSubmit} className="text-green-600 hover:text-green-800 mr-2">Simpan</button>
                            <button onClick={() => setEditId(null)} className="text-gray-600 hover:text-gray-800">Batal</button>
                          </td>
                        </>
                      ) : (
                        <>
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">Rp {product.price.toLocaleString()}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">
                            <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:text-blue-700 mr-2">Edit</button>
                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-700">Hapus</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Playlists Management */}
      {activeTab === 'playlists' && (
        <div className="space-y-8">
          {/* Add Playlist Button */}
          <AntButton type="primary" className="mb-4" style={{ backgroundColor: '#2C3E50', borderColor: '#2C3E50' }} onClick={() => setDrawerOpen(true)}>
            Tambah Playlist
          </AntButton>
          {/* Drawer for Add Playlist Form */}
          <Drawer
            title={<span style={{ color: '#2C3E50' }}>Tambah Playlist Baru</span>}
            placement="right"
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            width={400}
          >
            <form onSubmit={handleAddPlaylist} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Judul Playlist
                </label>
                <input
                  type="text"
                  required
                  value={newPlaylist.play_name}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, play_name: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  URL Video
                </label>
                <input
                  type="url"
                  required
                  value={newPlaylist.play_url}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, play_url: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  URL Thumbnail
                </label>
                <input
                  type="url"
                  required
                  value={newPlaylist.play_thumbnail}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, play_thumbnail: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Genre
                </label>
                <select
                  required
                  value={newPlaylist.play_genre}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, play_genre: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Genre</option>
                  <option value="music">Music</option>
                  <option value="song">Song</option>
                  <option value="education">Education</option>
                  <option value="movie">Movie</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Deskripsi
                </label>
                <textarea
                  required
                  value={newPlaylist.play_description}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, play_description: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Tambah Playlist
                        </button>
              </div>
            </form>
          </Drawer>
          {/* Playlists List */}
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
                        <a href={playlist.play_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          Lihat Video
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDeletePlaylist(playlist.id)} className="text-red-600 hover:text-red-700">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Daftar Pesanan</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Pelanggan</th>
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Tanggal</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 px-4">#{order.id}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">{order.items.join(', ')}</td>
                    <td className="py-3 px-4">Rp {order.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' ? 'Selesai' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="pending">Menunggu</option>
                        <option value="completed">Selesai</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="mt-12 text-center text-[#2C3E50] text-sm">
        &copy; {new Date().getFullYear()} TendaKu Admin. All rights reserved.
      </footer>
    </div>
  )
}

export default Admin