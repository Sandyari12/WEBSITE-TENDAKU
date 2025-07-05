import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Card, Button, Space, message, Modal } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const RentalHistory = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/rental/read', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Gagal mengambil data riwayat sewa');
        const data = await res.json();
        setRentals(data.datas || []);
      } catch (err) {
        message.error('Gagal mengambil data riwayat sewa');
      }
      setLoading(false);
    };
    fetchRentals();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu':
        return 'warning';
      case 'selesai':
        return 'success';
      case 'dibatalkan':
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
      render: (_, record) => record.id || record.id_rental
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => date ? new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : '-'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `Rp ${Number(total || 0).toLocaleString('id-ID')}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'menunggu' && 'Menunggu'}
          {status === 'selesai' && 'Selesai'}
          {status === 'dibatalkan' && 'Dibatalkan'}
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
          rowKey={record => record.id || record.id_rental}
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