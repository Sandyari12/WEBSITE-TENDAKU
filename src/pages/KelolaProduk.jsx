import { useState, useEffect } from 'react';
import { Drawer, Button as AntButton, message, Modal } from 'antd';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../utils/api';

// Tambahkan mapping kategoriLabel di sini
const kategoriLabel = {
  "tent": "Tenda",
  "cooking": "Peralatan Masak",
  "sleeping-bag": "Sleeping Bag",
  "lighting": "Peralatan Penerangan",
  "hiking": "Peralatan Hiking",
  "backpack": "Ransel",
  "Tenda": "Tenda",
  "Peralatan Masak": "Peralatan Masak",
  "Sleeping Bag": "Sleeping Bag",
  "Peralatan Penerangan": "Peralatan Penerangan",
  "Peralatan Hiking": "Peralatan Hiking",
  "Ransel": "Ransel"
};

function KelolaProduk() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formProduct, setFormProduct] = useState({
    name: '', category: '', price: '', stock: '', image: '', description: '', additionalInfo: ''
  });
  const [editId, setEditId] = useState(null);

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

  const openAddDrawer = () => {
    setFormMode('add');
    setFormProduct({ name: '', category: '', price: '', stock: '', image: '', description: '', additionalInfo: '' });
    setEditId(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (product) => {
    setFormMode('edit');
    setFormProduct({ ...product });
    setEditId(product.id);
    setDrawerOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', formProduct.name);
      formData.append('category', formProduct.category);
      formData.append('price', formProduct.price);
      formData.append('stock', formProduct.stock);
      formData.append('image', formProduct.image);
      formData.append('description', formProduct.description);
      if (formMode === 'add') {
        await createProduct(formData);
        message.success('Produk berhasil ditambahkan!');
      } else {
        await updateProduct(editId, formData);
        message.success('Produk berhasil diubah!');
      }
      setDrawerOpen(false);
      setFormProduct({ name: '', category: '', price: '', stock: '', image: '', description: '', additionalInfo: '' });
      setEditId(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      message.error(formMode === 'add' ? 'Gagal menambah produk' : 'Gagal mengubah produk');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Konfirmasi Hapus Produk',
      conTenda: 'Yakin ingin menghapus produk ini?',
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
      <AntButton type="primary" className="mb-4" style={{ backgroundColor: '#2C3E50', borderColor: '#2C3E50' }} onClick={openAddDrawer}>
        Tambah Produk
      </AntButton>
      <Drawer
        title={<span style={{ color: '#2C3E50' }}>{formMode === 'add' ? 'Tambah Peralatan Baru' : 'Edit Peralatan'}</span>}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
      >
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nama Peralatan</label>
            <input type="text" name="name" required value={formProduct.name} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Kategori</label>
            <select name="category" required value={formProduct.category} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Kategori</option>
              <option value="Tenda">Tenda</option>
              <option value="Peralatan Masak">Peralatan Masak</option>
              <option value="Sleeping Bag">Sleeping Bag</option>
              <option value="Peralatan Penerangan">Peralatan Penerangan</option>
              <option value="Peralatan Hiking">Peralatan Hiking</option>
              <option value="Ransel">Ransel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Harga per Hari</label>
            <input type="number" name="price" required value={formProduct.price} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Stok</label>
            <input type="number" name="stock" required value={formProduct.stock} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">URL Gambar</label>
            <input type="url" name="image" required value={formProduct.image} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Deskripsi Produk</label>
            <textarea name="description" value={formProduct.description} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Deskripsi singkat produk" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Info Tambahan</label>
            <textarea name="additionalInfo" value={formProduct.additionalInfo} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Info tambahan (opsional)" />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              {formMode === 'add' ? 'Tambah Peralatan' : 'Simpan Perubahan'}
            </button>
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
                        <input name="name" value={formProduct.name} onChange={handleFormChange} className="w-full px-2 py-1 border rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <select name="category" value={formProduct.category} onChange={handleFormChange} className="w-full px-2 py-1 border rounded">
                          <option value="Tenda">Tenda</option>
                          <option value="Peralatan Masak">Peralatan Masak</option>
                          <option value="Sleeping Bag">Sleeping Bag</option>
                          <option value="Peralatan Penerangan">Peralatan Penerangan</option>
                          <option value="Peralatan Hiking">Peralatan Hiking</option>
                          <option value="Ransel">Ransel</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input name="price" type="number" value={formProduct.price} onChange={handleFormChange} className="w-full px-2 py-1 border rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <input name="stock" type="number" value={formProduct.stock} onChange={handleFormChange} className="w-full px-2 py-1 border rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={handleFormSubmit} className="text-green-600 hover:text-green-800 mr-2">Simpan</button>
                        <button onClick={() => setEditId(null)} className="text-gray-600 hover:text-gray-800">Batal</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{kategoriLabel[product.category] || product.category}</td>
                      <td className="py-3 px-4">Rp {product.price.toLocaleString()}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => openEditDrawer(product)} className="text-blue-600 hover:text-blue-700 mr-2">Edit</button>
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