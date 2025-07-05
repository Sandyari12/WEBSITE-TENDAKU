import { useState, useEffect } from 'react';
import { Drawer, Button as AntButton, message, Modal } from 'antd';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../utils/api';

function KelolaProduk() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', price: '', stock: '', image: '', description: '', additionalInfo: ''
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
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
  }, []);

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

  const handleEditClick = (product) => {
    setEditId(product.id);
    setEditData({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

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

  return (
    <div className="space-y-8">
      <AntButton type="primary" className="mb-4" style={{ backgroundColor: '#2C3E50', borderColor: '#2C3E50' }} onClick={() => setDrawerOpen(true)}>
        Tambah Produk
      </AntButton>
      <Drawer
        title={<span style={{ color: '#2C3E50' }}>Tambah Peralatan Baru</span>}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
      >
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nama Peralatan</label>
            <input type="text" required value={newProduct.name} onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Kategori</label>
            <select required value={newProduct.category} onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
            <label className="block text-sm text-gray-600 mb-1">Harga per Hari</label>
            <input type="number" required value={newProduct.price} onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Stok</label>
            <input type="number" required value={newProduct.stock} onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">URL Gambar</label>
            <input type="url" required value={newProduct.image} onChange={e => setNewProduct(prev => ({ ...prev, image: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Deskripsi Produk</label>
            <textarea value={newProduct.description} onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Deskripsi singkat produk" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Info Tambahan</label>
            <textarea value={newProduct.additionalInfo} onChange={e => setNewProduct(prev => ({ ...prev, additionalInfo: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Info tambahan (opsional)" />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Tambah Peralatan</button>
          </div>
        </form>
      </Drawer>
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
                        <input name="name" value={editData.name} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <select name="category" value={editData.category} onChange={handleEditChange} className="w-full px-2 py-1 border rounded">
                          <option value="tent">Tenda</option>
                          <option value="cooking">Peralatan Masak</option>
                          <option value="sleeping-bag">Sleeping Bag</option>
                          <option value="peralatan-penerangan">Peralatan Penerangan</option>
                          <option value="hiking">Peralatan Hiking</option>
                          <option value="backpack">Ransel</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input name="price" type="number" value={editData.price} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <input name="stock" type="number" value={editData.stock} onChange={handleEditChange} className="w-full px-2 py-1 border rounded" />
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
  );
}

export default KelolaProduk; 