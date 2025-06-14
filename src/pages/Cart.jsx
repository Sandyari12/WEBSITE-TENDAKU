import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, InputNumber, Form, Input, message } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, setCart, removeFromCart, updateQuantity, updateRentalDays, getTotalPrice } = useCart();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
      render: (price) => `Rp ${price.toLocaleString()}`,
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
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
      render: (_, record) => {
        const subtotal = record.price * (record.quantity || 1) * (record.rentalDays || 1);
        return `Rp ${subtotal.toLocaleString()}`;
      },
    },
    {
      title: 'Aksi',
      key: 'action',
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

  const onFinish = (values) => {
    setLoading(true);
    // Simulasi proses checkout
    setTimeout(() => {
      // Simpan data rental ke localStorage
      const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory') || '[]');
      const newRental = {
        id: Date.now(),
        date: new Date().toISOString(),
      items: cart,
        customer: values,
        total: getTotalPrice(),
      };
      rentalHistory.push(newRental);
      localStorage.setItem('rentalHistory', JSON.stringify(rentalHistory));

      // Clear cart
      setCart([]);
      message.success('Pesanan berhasil dibuat!');
      navigate('/rental-history');
      setLoading(false);
    }, 1500);
  };

    return (
    <div className="container mx-auto px-4 py-8">
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
            className="mb-8"
          />

          <div className="bg-gray-50 p-6 rounded-lg">
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
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Email harus diisi' },
                    { type: 'email', message: 'Email tidak valid' }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Nomor Telepon"
                  rules={[{ required: true, message: 'Nomor telepon harus diisi' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Alamat"
                  rules={[{ required: true, message: 'Alamat harus diisi' }]}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total Pembayaran:</span>
                  <span className="text-xl font-bold text-blue-600">
                    Rp {getTotalPrice().toLocaleString()}
                  </span>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  loading={loading}
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