import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Card, Button, Space, message, Modal } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RentalHistory = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Mengambil data riwayat sewa dari localStorage
    const rentalHistory = JSON.parse(localStorage.getItem('rentalHistory') || '[]');
    setRentals(rentalHistory);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'active':
        return 'processing';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Hapus Riwayat Sewa',
      content: 'Apakah Anda yakin ingin menghapus riwayat sewa ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Tidak',
      onOk() {
        const updatedRentals = rentals.filter(rental => rental.id !== id);
        setRentals(updatedRentals);
        localStorage.setItem('rentalHistory', JSON.stringify(updatedRentals));
        message.success('Riwayat sewa berhasil dihapus');
      }
    });
  };

  const columns = [
    {
      title: 'ID Sewa',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    },
    {
      title: 'Item',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {Array.isArray(items) && items.map((item, index) => (
            <li key={index}>{item?.name} (x{item?.quantity || 1})</li>
          ))}
        </ul>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `Rp ${total.toLocaleString('id-ID')}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'pending' && 'Menunggu'}
          {status === 'active' && 'Aktif'}
          {status === 'completed' && 'Selesai'}
          {status === 'cancelled' && 'Dibatalkan'}
        </Tag>
      )
    },
    {
      title: 'Aksi',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate('/order-success', { state: { order: record } })}
          >
            Detail
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/products')}
          className="mr-4"
        >
          Kembali ke Produk
        </Button>
        <Title level={2} style={{ margin: 0 }}>Riwayat Sewa</Title>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={rentals}
          rowKey="id"
          loading={loading}
          pagination={{
            showTotal: (total) => `Total ${total} riwayat sewa`
          }}
        />
      </Card>
    </div>
  );
};

export default RentalHistory; 