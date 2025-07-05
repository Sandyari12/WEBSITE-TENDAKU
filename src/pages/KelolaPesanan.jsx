import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { getRentals, updateRental, deleteRental, getRentalItemsByRentalId } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function KelolaPesanan() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getRentals();
        setOrders(data);
      } catch (err) {
        message.error('Gagal mengambil data pesanan');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => (o.id || o.id_rental) === orderId);
      const formData = new FormData();
      formData.append('name', order.name);
      formData.append('email', order.email);
      formData.append('phone', order.phone);
      formData.append('address', order.address);
      formData.append('status', newStatus);
      formData.append('total', order.total || 0);
      await updateRental(orderId, formData);
      message.success('Status pesanan berhasil diubah!');
      const data = await getRentals();
      setOrders(data);
    } catch (err) {
      message.error('Gagal mengubah status pesanan');
    }
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

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Daftar Pesanan</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">Nama</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Telepon</th>
              <th className="text-left py-3 px-4">Alamat</th>
              <th className="text-left py-3 px-4">Tanggal</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Total</th>
              <th className="text-left py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id || order.id_rental} className="border-b">
                <td className="py-3 px-4">#{order.id || order.id_rental}</td>
                <td className="py-3 px-4">{order.name}</td>
                <td className="py-3 px-4">{order.email}</td>
                <td className="py-3 px-4">{order.phone}</td>
                <td className="py-3 px-4">{order.address}</td>
                <td className="py-3 px-4">{order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '-'}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status || 'menunggu'}
                    onChange={e => handleUpdateOrderStatus(order.id || order.id_rental, e.target.value)}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="menunggu">Menunggu</option>
                    <option value="selesai">Selesai</option>
                    <option value="dibatalkan">Dibatalkan</option>
                  </select>
                </td>
                <td className="py-3 px-4">Rp {order.total ? Number(order.total).toLocaleString() : 0}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={async () => {
                      const rentalId = order.id || order.id_rental;
                      let items = [];
                      try {
                        items = await getRentalItemsByRentalId(rentalId);
                      } catch (e) {}
                      navigate('/order-success', { state: { order: { ...order, items } } });
                    }}
                    className="text-blue-600 hover:text-blue-700 mr-2"
                  >
                    Detail
                  </button>
                  <button onClick={() => handleDeleteOrder(order.id || order.id_rental)} className="text-red-600 hover:text-red-700">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default KelolaPesanan; 