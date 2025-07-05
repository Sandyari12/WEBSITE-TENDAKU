import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, InputNumber, Form, Input, message } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, setCart, removeFromCart, updateQuantity, updateRentalDays, getTotalPrice } = useCart();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.username) {
      form.setFieldsValue({ email: user.username });
    }
  }, [user, form]);

  const columns = [
    {
      title: 'Produk',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Harga per Hari',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => `Rp ${price.toLocaleString()}`,
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity || 1}
          onChange={(value) => updateQuantity(record.id, value)}
        />
      ),
    },
    {
      title: 'Jumlah Hari',
      dataIndex: 'rentalDays',
      key: 'rentalDays',
      align: 'center',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.rentalDays || 1}
          onChange={(value) => updateRentalDays(record.id, value)}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      align: 'right',
      render: (_, record) => {
        const subtotal = record.price * (record.quantity || 1) * (record.rentalDays || 1);
        return `Rp ${subtotal.toLocaleString()}`;
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
        />
      ),
    },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 1. Create rental
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('address', values.address);
      formData.append('status', 'menunggu');
      formData.append('total', getTotalPrice());
      
      const res = await fetch('/api/v1/rental/create', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal membuat pesanan');
      }
      const data = await res.json();
      const rentalId = data.id;
      // 2. Create rental_item untuk setiap item di cart
      for (const item of cart) {
        const itemForm = new FormData();
        itemForm.append('rental_id', rentalId);
        itemForm.append('product_id', item.id);
        itemForm.append('quantity', item.quantity || 1);
        itemForm.append('rental_days', item.rentalDays || 1);
        itemForm.append('price', item.price);
        const itemRes = await fetch('/api/v1/rental_item/create', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: itemForm,
        });
        if (!itemRes.ok) {
          // Tidak perlu throw, rental sudah dibuat, tapi tampilkan warning
          message.warning('Ada item gagal disimpan, silakan cek riwayat penyewaan.');
        }
      }
      // Clear cart
      setCart([]);
      message.success('Pesanan berhasil dibuat!');
      navigate('/order-success', { state: { order: { id: rentalId, items: cart, customer: values, total: getTotalPrice() } } });
    } catch (error) {
      message.error('Gagal melakukan penyewaan: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/products')}
          className="mr-4"
        >
          Kembali ke Produk
        </Button>
        <h1 className="text-2xl font-bold">Keranjang Sewa</h1>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Keranjang Anda kosong</p>
          <Button type="primary" onClick={() => navigate('/products')} className="mt-4">
            Lihat Produk
          </Button>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={cart}
            rowKey="id"
            pagination={false}
            className="mb-12 shadow-md rounded-lg overflow-hidden"
          />

          <div className="bg-white p-6 rounded-lg shadow-md mb-12">
            <h2 className="text-xl font-semibold mb-4">Informasi Pelanggan</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="name"
                  label="Nama Lengkap"
                  rules={[{ required: true, message: 'Nama harus diisi' }]}
                >
                  <Input placeholder="Masukkan nama lengkap Anda"/>
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Email harus diisi' },
                    { type: 'email', message: 'Email tidak valid' }
                  ]}
                >
                  <Input placeholder="contoh@email.com" disabled={!!user?.username}/>
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Nomor Telepon"
                  rules={[{ required: true, message: 'Nomor telepon harus diisi' }]}
                >
                  <Input placeholder="Contoh: 08123456789"/>
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Alamat"
                  rules={[{ required: true, message: 'Alamat harus diisi' }]}
                >
                  <Input.TextArea rows={2} placeholder="Masukkan alamat lengkap Anda"/>
                </Form.Item>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 bg-blue-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-blue-800">Total Pembayaran:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    Rp {getTotalPrice().toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-blue-700 text-center mb-6">
                  Pembayaran dilakukan saat pengambilan barang. Anda tidak perlu melakukan pembayaran sekarang.
                </p>
                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  loading={loading}
                  className="h-12 text-lg"
                >
                  Checkout
                </Button>
              </div>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart; 