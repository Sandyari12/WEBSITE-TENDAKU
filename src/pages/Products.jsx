import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Input, Select, Typography, message } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../utils/api';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.selectedCategory) {
      console.log('Selected category from home:', location.state.selectedCategory);
      setCategory(location.state.selectedCategory);
    }
  }, [location.state]);

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

  const handleAddToCart = (product) => {
    if (!user) {
      message.warning('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    // Cari produk asli dari hasil fetch backend
    const realProduct = products.find(p => String(p.id) === String(product.id));
    if (!realProduct) {
      message.error('Produk tidak ditemukan. Silakan refresh halaman.');
      return;
    }
    const inCart = (cart || []).find(item => String(item.id) === String(realProduct.id))?.quantity || 0;
    if (inCart >= realProduct.stock) {
      message.error('Stok produk tidak mencukupi');
      return;
    }
    addToCart(realProduct); // gunakan data produk asli dari backend
    message.success('Produk berhasil ditambahkan ke keranjang');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    console.log('Filtering product:', product.name, 'Category:', product.category, 'Selected category:', category, 'Matches:', matchesCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Title level={2} style={{ marginBottom: '24px' }}>Daftar Produk</Title>

      {/* Filters */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <Input
          placeholder="Cari produk..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }}
        />
        <Select
          value={category}
          style={{ width: '200px' }}
          onChange={setCategory}
        >
          <Option value="all">Semua Kategori</Option>
          <Option value="tent">Tenda</Option>
          <Option value="sleeping-bag">Sleeping Bag</Option>
          <Option value="cooking">Peralatan Masak</Option>
          <Option value="lighting">Penerangan</Option>
          <Option value="backpack">Ransel</Option>
          <Option value="hiking">Peralatan Hiking</Option>
        </Select>
      </div>

      {/* Products Grid */}
      <Row gutter={[24, 24]}>
        {filteredProducts.map((product, idx) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              className={`hover-lift floating stagger-${(idx%5)+1}`}
              style={{ height: '100%' }}
              cover={
                <img
                  alt={product.name}
                  src={product.image}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              }
              actions={[
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => handleAddToCart(product)}
                  block
                >
                  Masukkan Keranjang
                </Button>
              ]}
            >
              <Card.Meta
                title={product.name}
                description={
                  <>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {product.description}
                    </Paragraph>
                    <Paragraph strong style={{ color: '#1890ff', marginTop: '8px' }}>
                      Rp {product.price.toLocaleString('id-ID')} / hari
                    </Paragraph>
                    <Paragraph type="secondary" style={{ marginTop: '4px' }}>
                      Stok: {product.stock} unit
                    </Paragraph>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Products; 