import React from 'react';
import { Button, Typography, Card } from 'antd';
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const OrderSuccess = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Title level={3}>Detail pesanan tidak ditemukan.</Title>
        <Paragraph>Silakan kembali ke <Link to="/">Beranda</Link> atau <Link to="/products">Produk</Link>.</Paragraph>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="text-center p-8 shadow-xl rounded-lg">
        <CheckCircleOutlined style={{ fontSize: '72px', color: '#52c41a', marginBottom: '24px' }} />
        <Title level={2} style={{ color: '#333', marginBottom: '12px' }}>Terima kasih atas pesanan Anda</Title>
        <Paragraph style={{ fontSize: '16px', color: '#555', marginBottom: '8px' }}>
          Pesanan Anda akan segera kami proses.
        </Paragraph>
        <Paragraph className="font-bold text-lg text-gray-800 mb-8">
          Kode Pesanan #{order.id}
        </Paragraph>

        {/* Tabel Ringkasan Produk */}
        <div className="w-full mb-8">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-sm text-gray-500 uppercase">PRODUK</th>
                <th className="py-2 text-sm text-gray-500 uppercase text-center">JUMLAH</th>
                <th className="py-2 text-sm text-gray-500 uppercase text-right">HARGA</th>
                <th className="py-2 text-sm text-gray-500 uppercase text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3 text-gray-800 font-medium">{item.name}</td>
                  <td className="py-3 text-gray-800 font-medium text-center">{item.quantity}</td>
                  <td className="py-3 text-gray-800 font-medium text-right">Rp {item.price.toLocaleString()}</td>
                  <td className="py-3 text-gray-800 font-medium text-right">Rp {(item.price * item.quantity * item.rentalDays).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ringkasan Pembayaran */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-md font-normal text-gray-700">Sub Total:</span>
            <span className="text-lg font-bold text-gray-800 text-right">Rp {order.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-md font-normal text-gray-700">Diskon:</span>
            <span className="text-lg font-bold text-gray-800 text-right">Rp 0</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-4">
            <span className="text-xl font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-blue-600 text-right">Rp {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Informasi Pengambilan */}
        <div className="mb-8">
          <div className="mb-4 text-center text-md font-semibold text-gray-800">
            Pembayaran dilakukan saat pengambilan barang.
          </div>
          <div className="flex flex-row flex-wrap justify-center gap-x-12 gap-y-4">
            <div className="flex items-center">
              <EnvironmentOutlined className="mr-2 text-blue-500" />
              <div className="text-gray-700 text-left">Lokasi Pengambilan: <strong className="text-gray-900">Jl. Dewi Sartika No. 123, Kota Singaraja</strong></div>
            </div>
            <div className="flex items-center">
              <HomeOutlined className="mr-2 text-blue-500" />
              <div className="text-gray-700 text-left">Waktu Operasional: <strong className="text-gray-900">Senin - Jumat, 09:00 - 17:00 WIB</strong></div>
            </div>
            <div className="flex items-center">
              <PhoneOutlined className="mr-2 text-blue-500" />
              <div className="text-gray-700 text-left">Nomor Kontak: <strong className="text-gray-900">+62 812-3456-7890</strong></div>
            </div>
          </div>
          <div className="text-sm text-red-600 mt-4 mb-2 text-center">
            *Pembayaran penuh sebesar <span className="font-bold">Rp {order.total.toLocaleString()}</span> dilakukan secara tunai/transfer saat pengambilan barang.
          </div>
          <div className="text-sm text-gray-600 text-center">
            Harap siapkan bukti pemesanan saat pengambilan.
          </div>
        </div>

        {/* Tombol Navigasi */}
        <div className="flex flex-col space-y-4">
          <Button type="primary" size="large" className="w-full py-3 text-lg font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 border-none">
            <Link to="/">ke Halaman Utama</Link>
          </Button>
          <Button type="default" size="large" className="w-full py-3 text-lg font-semibold rounded-lg border-gray-300 hover:border-blue-500 hover:text-blue-500">
            <Link to="/rental-history">Lihat Pesanan Anda</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;