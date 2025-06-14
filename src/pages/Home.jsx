import React from 'react';
import { Typography, Button, Row, Col, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { 
  EnvironmentOutlined, 
  SafetyOutlined, 
  DollarOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import tendaOrange from '../assets/tenda_orange.jpg.png'
import komporCamping from '../assets/kompor_camping.png.png'
import sleepingBagSummit from '../assets/sleeping_bag_summit.jpeg.png'

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const handleMapClick = () => {
    window.open('https://maps.app.goo.gl/TkxtTajmo5sNKJVp8', '_blank');
  };

  const handleProductInfoClick = () => {
    navigate('/products');
  };

  const featuredCategories = [
    {
      title: 'Tenda',
      image: tendaOrange,
      description: 'Berbagai jenis tenda untuk kebutuhan camping Anda',
      category: 'tent'
    },
    {
      title: 'Peralatan Masak',
      image: komporCamping,
      description: 'Peralatan masak lengkap untuk aktivitas outdoor',
      category: 'cooking'
    },
    {
      title: 'Sleeping Bag',
      image: sleepingBagSummit,
      description: 'Sleeping bag nyaman untuk tidur di alam terbuka',
      category: 'sleeping-bag'
    }
  ]

  const handleCategoryClick = (category) => {
    navigate('/products', { state: { selectedCategory: category } });
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 0',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        marginBottom: '48px',
        borderRadius: '12px',
      }}>
        <Title level={1} style={{ color: 'white', marginBottom: '24px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          Sewa Alat Camping Terpercaya
        </Title>
        <Paragraph style={{ fontSize: '18px', marginBottom: '32px', color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          Nikmati petualangan camping Anda dengan peralatan berkualitas
        </Paragraph>
        <Button type="primary" size="large">
          <Link to="/products" style={{ color: 'white' }}>
            Lihat Produk
          </Link>
        </Button>
      </div>

      {/* Features Section */}
      <Row gutter={[32, 32]} style={{ marginBottom: '48px' }}>
        <Col xs={24} sm={8}>
          <Card
            style={{ height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
            bodyStyle={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleMapClick}
            hoverable
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <EnvironmentOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Title level={4} style={{ marginBottom: 8 }}>Lokasi Strategis</Title>
            <Paragraph style={{ margin: 0 }}>
              Pengambilan dan pengembalian alat di lokasi yang mudah dijangkau
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            hoverable
            style={{ height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
            bodyStyle={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleProductInfoClick}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Title level={4} style={{ marginBottom: 8 }}>Perlengkapan Berkualitas</Title>
            <Paragraph style={{ margin: 0 }}>Semua alat camping terjamin kualitasnya dan terawat dengan baik</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            hoverable
            style={{ height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
            bodyStyle={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleProductInfoClick}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <DollarCircleOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Title level={4} style={{ marginBottom: 8 }}>Harga Terjangkau</Title>
            <Paragraph style={{ margin: 0 }}>Sewa dengan harga yang kompetitif dan transparan</Paragraph>
          </Card>
        </Col>
      </Row>

      {/* CTA Section */}
      <div style={{ 
        textAlign: 'center', 
        padding: '48px 0',
        background: '#f0f2f5',
        borderRadius: '8px'
      }}>
        <Title level={2}>Siap untuk Petualangan?</Title>
        <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
          Segera sewa perlengkapan camping Anda sekarang
        </Paragraph>
        <Button type="primary" size="large">
          <Link to="/products" style={{ color: 'white' }}>
            Lihat Produk
          </Link>
        </Button>
      </div>

      {/* Featured Categories */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">
          Kategori Unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => handleCategoryClick(category.category)}
            >
              <img
                src={category.image}
                alt={category.title}
                className={
                  category.title === 'Tenda'
                    ? 'h-40 w-40 mx-auto mt-6 mb-2 rounded-lg object-cover'
                    : category.title === 'Peralatan Masak'
                    ? 'h-48 w-48 mx-auto mt-6 mb-2 rounded-lg object-cover'
                    : 'w-full h-48 object-cover'
                }
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-center">{category.title}</h3>
                <p className="text-gray-600 text-center">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-12 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mengapa Memilih Kami?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kualitas Terjamin</h3>
              <p className="text-gray-600">
                Semua peralatan kami dirawat dengan baik dan berkualitas tinggi
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-gray-600">
                Pengiriman cepat dan aman ke seluruh Indonesia
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pembayaran Aman</h3>
              <p className="text-gray-600">
                Sistem pembayaran yang aman dan terpercaya
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 