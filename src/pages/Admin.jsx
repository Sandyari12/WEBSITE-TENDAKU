import { Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { ShoppingCartOutlined, AppstoreOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getProducts, getRentals, getPlaylists } from '../utils/api';

const { Title } = Typography;

function Admin() {
  const [produkCount, setProdukCount] = useState(0);
  const [pesananCount, setPesananCount] = useState(0);
  const [playlistCount, setPlaylistCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [produk, pesanan, playlist] = await Promise.all([
          getProducts(),
          getRentals(),
          getPlaylists(),
        ]);
        setProdukCount(produk.length);
        setPesananCount(pesanan.length);
        setPlaylistCount(playlist.length);
        setRecentOrders(pesanan.slice(-5).reverse()); // 5 pesanan terbaru
      } catch (err) {
        // Optional: handle error
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Nama', dataIndex: 'name', key: 'name' },
    { title: 'Tanggal', dataIndex: 'created_at', key: 'created_at', render: (date) => date ? new Date(date).toLocaleString('id-ID') : '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => status?.charAt(0).toUpperCase() + status?.slice(1) },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (total) => `Rp ${Number(total || 0).toLocaleString('id-ID')}` },
  ];

  return (
    <div className="min-h-screen bg-softblue p-0">
      <div className="p-6 max-w-7xl mx-auto">
        {/* <Title level={2} className="mb-6" style={{ color: '#1890ff', fontWeight: 700 }}>Dashboard Admin</Title> */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={8}>
            <Card
              style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(24,144,255,0.08)', transition: 'box-shadow 0.2s', background: 'white' }}
              className="hover:shadow-lg group"
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={<span style={{ color: '#888', fontWeight: 500 }}>Total Produk</span>}
                value={produkCount}
                valueStyle={{ color: '#1890ff', fontWeight: 700 }}
                prefix={<AppstoreOutlined style={{ color: '#1890ff', fontSize: 32, marginRight: 8 }} />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(82,196,26,0.08)', transition: 'box-shadow 0.2s', background: 'white' }}
              className="hover:shadow-lg group"
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={<span style={{ color: '#888', fontWeight: 500 }}>Total Pesanan</span>}
                value={pesananCount}
                valueStyle={{ color: '#52c41a', fontWeight: 700 }}
                prefix={<ShoppingCartOutlined style={{ color: '#52c41a', fontSize: 32, marginRight: 8 }} />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(250,173,20,0.08)', transition: 'box-shadow 0.2s', background: 'white' }}
              className="hover:shadow-lg group"
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={<span style={{ color: '#888', fontWeight: 500 }}>Total Playlist</span>}
                value={playlistCount}
                valueStyle={{ color: '#faad14', fontWeight: 700 }}
                prefix={<PlayCircleOutlined style={{ color: '#faad14', fontSize: 32, marginRight: 8 }} />}
              />
            </Card>
          </Col>
        </Row>
        <Card
          title={<span style={{ color: '#222', fontWeight: 600 }}>Pesanan Terbaru</span>}
          className="mb-8"
          style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(24,144,255,0.06)', background: 'transparent' }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            columns={columns}
            dataSource={recentOrders}
            rowKey={record => record.id || record.id_rental}
            loading={loading}
            pagination={false}
            bordered
            size="middle"
            className="custom-table-header"
            style={{ borderRadius: 16, overflow: 'hidden', background: 'transparent' }}
            components={{
              header: {
                cell: (props) => <th style={{ background: '#f0f2f5', fontWeight: 600, color: '#222' }} {...props} />,
              },
            }}
          />
        </Card>
      </div>
    </div>
  );
}

export default Admin;