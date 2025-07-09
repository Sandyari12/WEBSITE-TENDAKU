import React, { useEffect, useState } from 'react';
import { Typography, Button, Row, Col, Card, Avatar, Form, Input, Rate } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { 
  EnvironmentOutlined, 
  SafetyOutlined, 
  DollarOutlined,
  DollarCircleOutlined,
  StarFilled,
  UserOutlined
} from '@ant-design/icons';
import tendaOrange from '../assets/tenda_orange.jpg.png'
import komporCamping from '../assets/kompor_camping.png.png'
import sleepingBagSummit from '../assets/sleeping_bag_summit.jpeg.png'
import FAQ from './FAQ';
import { message } from 'antd';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [testimonials, setTestimonials] = useState([
    {
      name: 'Daksa',
      role: 'Camping Enthusiast',
      content: 'Peralatan camping yang berkualitas dan pelayanan yang sangat memuaskan!',
      rating: 5
    },
    {
      name: 'Sandya',
      role: 'Backpacker',
      content: 'Harga terjangkau dengan kualitas terbaik. Sangat recommended!',
      rating: 5
    },
    {
      name: 'Ardo',
      role: 'Outdoor Guide',
      content: 'Sudah 2 tahun menggunakan jasa mereka, selalu puas dengan pelayanannya.',
      rating: 5
    }
  ]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMapClick = () => {
    window.open('https://maps.app.goo.gl/YRvVNC36m4i26bjR9?g_st=aw', '_blank');
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
    <div className="min-h-screen bg-softblue">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideInFromLeft {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromRight {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInFromBottom {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        .slide-in-left {
          animation: slideInFromLeft 1s ease-out;
        }
        
        .slide-in-right {
          animation: slideInFromRight 1s ease-out;
        }
        
        .slide-in-bottom {
          animation: slideInFromBottom 1s ease-out;
        }
        
        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .rotate {
          animation: rotate 20s linear infinite;
        }
        
        .fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        
        .bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-12 py-20 px-4 rounded-2xl mb-16 overflow-hidden" style={{ minHeight: '380px' }}>
        {/* Background Image Only (from Unsplash) */}
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '1rem',
          }}
        />
        {/* Konten Hero */}
        <div className="text-center md:text-left flex-1 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
            Sewa Alat Camping <span className="block text-white">Terpercaya</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed drop-shadow">
            Nikmati petualangan camping Anda dengan peralatan berkualitas tinggi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button 
              type="primary" 
              size="large" 
              className="bg-white border-white hover:bg-blue-50 hover:border-blue-50 h-12 px-8 text-lg font-semibold pulse"
            >
              <Link to="/products" className="text-white">
            Lihat Produk
          </Link>
        </Button>
            <Button 
              size="large" 
              className="border-white text-black hover:bg-white hover:text-black h-12 px-8 text-lg font-semibold bounce"
              onClick={handleMapClick}
            >
              Lihat Lokasi
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className={`text-3xl font-bold text-center mb-12 text-[#2C3E50] ${isVisible ? 'slide-in-bottom' : ''}`}>
          Mengapa Memilih TendaKu?
        </h2>
        <Row gutter={[32, 32]}>
        <Col xs={24} sm={8}>
          <Card
              className={`h-64 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg ${isVisible ? 'slide-in-left' : ''}`}
              bodyStyle={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
            onClick={handleMapClick}
          >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 rotate">
                <EnvironmentOutlined style={{ fontSize: '32px', color: '#2C3E50' }} />
            </div>
              <Title level={4} className="mb-3 text-[#2C3E50]">Lokasi Strategis</Title>
              <Paragraph className="text-gray-600">
              Pengambilan dan pengembalian alat di lokasi yang mudah dijangkau
            </Paragraph>
          </Card>
        </Col>
          <Col xs={24} sm={8}>
          <Card
              className={`h-64 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg ${isVisible ? 'slide-in-bottom' : ''}`}
              bodyStyle={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
            onClick={handleProductInfoClick}
          >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 floating">
                <SafetyOutlined style={{ fontSize: '32px', color: '#2C3E50' }} />
            </div>
              <Title level={4} className="mb-3 text-[#2C3E50]">Perlengkapan Berkualitas</Title>
              <Paragraph className="text-gray-600">
                Semua alat camping terjamin kualitasnya dan terawat dengan baik
              </Paragraph>
          </Card>
        </Col>
          <Col xs={24} sm={8}>
          <Card
              className={`h-64 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg ${isVisible ? 'slide-in-right' : ''}`}
              bodyStyle={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
            onClick={handleProductInfoClick}
          >
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 pulse">
                <DollarCircleOutlined style={{ fontSize: '32px', color: '#2C3E50' }} />
            </div>
              <Title level={4} className="mb-3 text-[#2C3E50]">Harga Terjangkau</Title>
              <Paragraph className="text-gray-600">
                Sewa dengan harga yang kompetitif dan transparan
              </Paragraph>
          </Card>
        </Col>
      </Row>
      </div>

      {/* Featured Categories */}
      <section className="mb-16">
        <h2 className={`text-3xl font-bold text-center mb-12 text-[#2C3E50] ${isVisible ? 'slide-in-bottom' : ''}`}>
          Kategori Unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCategories.map((category, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 ${isVisible ? 'slide-in-bottom' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() => handleCategoryClick(category.category)}
            >
              <div className="p-6">
              <img
                src={category.image}
                alt={category.title}
                  className="w-full h-48 object-cover rounded-xl mb-4 hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-xl font-semibold mb-3 text-center text-[#2C3E50]">{category.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`bg-gradient-to-r from-blue-50 to-indigo-50 py-16 rounded-2xl mb-16 ${isVisible ? 'slide-in-bottom' : ''}`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#2C3E50]">Apa Kata Mereka?</h2>
          <p className="text-gray-600 text-lg">Testimoni dari pelanggan setia kami</p>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={`text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${isVisible ? 'slide-in-bottom' : ''}`} style={{ animationDelay: `${index * 0.3}s` }}>
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarFilled key={i} style={{ color: '#fbbf24', fontSize: '20px' }} className="floating" />
                ))}
              </div>
              <Paragraph className="text-gray-700 mb-4 italic">"{testimonial.content}"</Paragraph>
              <div className="flex items-center justify-center">
                <Avatar icon={<UserOutlined />} className="mr-3 pulse" />
                <div>
                  <div className="font-semibold text-[#2C3E50]">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
            </div>
              </div>
            </Card>
          ))}
            </div>
        {/* Feedback Form */}
        <div className="max-w-xl mx-auto mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center text-[#2C3E50]">Beri Rating & Testimoni</h3>
          <Form
            layout="vertical"
            onFinish={(values) => {
              setTestimonials([
                ...testimonials,
                {
                  name: values.name,
                  role: 'Pengunjung',
                  content: values.message,
                  rating: values.rating
                }
              ]);
              message.success('Terima kasih atas feedback Anda!');
            }}
          >
            <Form.Item
              label="Nama"
              name="name"
              rules={[{ required: true, message: 'Nama wajib diisi' }]}
                >
              <Input placeholder="Nama Anda" />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: 'Beri rating untuk website ini' }]}
            >
              <Rate allowClear allowHalf />
            </Form.Item>
            <Form.Item
              label="Pesan / Testimoni"
              name="message"
              rules={[{ required: true, message: 'Pesan wajib diisi' }]}
            >
              <Input.TextArea rows={4} placeholder="Tulis pesan atau testimoni Anda..." />
            </Form.Item>
            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit" className="bg-blue-600 text-white px-8 py-2 text-lg rounded-xl font-semibold">
                Kirim
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>

      {/* CTA Section */}
      <div className={`text-white text-center py-16 rounded-2xl mb-16 ${isVisible ? 'slide-in-bottom' : ''}`}
        style={{
          backgroundImage: `url('https://1.bp.blogspot.com/-I7Gmtte7OAI/XKznYb4Ce8I/AAAAAAAADxw/TolpCZfSvU4s3HL5w20McSHDrGYvVefXwCLcBGAs/s1600/foto%2Bpemandangan%2Balam%2Bdi%2BYorkshire-min.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '1rem',
        }}>
        <Title level={2} className="mb-4 floating text-white" style={{ color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>Siap untuk Petualangan?</Title>
        <Paragraph className="text-xl mb-8 text-blue-100">
          Segera sewa perlengkapan camping Anda sekarang
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          className="bg-white text-[#2C3E50] border-white hover:bg-blue-50 hover:border-blue-50 h-12 px-8 text-lg font-semibold bounce"
        >
          <Link to="/products" className="text-[#2C3E50]">
            Mulai Sewa Sekarang
          </Link>
        </Button>
      </div>

      {/* FAQ Section at the bottom */}
      <section style={{ marginTop: '48px' }} className={isVisible ? 'slide-in-bottom' : ''}>
        <FAQ />
      </section>
    </div>
  );
};

export default Home; 