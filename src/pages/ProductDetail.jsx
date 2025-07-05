import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Row, 
  Col, 
  Image, 
  Button, 
  Descriptions, 
  message
} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { getProductById } from '../utils/api';

const { Title, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        message.error('Gagal mengambil detail produk');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleRent = () => {
    if (!user) {
      message.warning('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    // reduceStock(product.id, 1);
    navigate(`/rent/${id}`);
  };

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Produk tidak ditemukan</Title>
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Image
            src={product.image}
            alt={product.name}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Title level={2}>{product.name}</Title>
          <Paragraph style={{ fontSize: '18px', marginBottom: '24px' }}>
            {product.description}
          </Paragraph>

          <Descriptions bordered column={1}>
            <Descriptions.Item label="Kategori">
              {product.category === 'tent' && 'Tenda'}
              {product.category === 'sleeping-bag' && 'Sleeping Bag'}
              {product.category === 'cooking' && 'Peralatan Masak'}
              {product.category === 'lighting' && 'Penerangan'}
            </Descriptions.Item>
            <Descriptions.Item label="Harga Sewa">
              Rp {product.price.toLocaleString('id-ID')} / hari
            </Descriptions.Item>
            <Descriptions.Item label="Stok">
              {product.stock} unit
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              size="large" 
              icon={<ShoppingCartOutlined />}
              onClick={handleRent}
              block
            >
              Sewa Sekarang
            </Button>
          </div>
        </Col>
      </Row>

      {/* Additional Information */}
      <div style={{ marginTop: '48px' }}>
        <Title level={3}>Informasi Tambahan</Title>
        <Paragraph>
          {product.additionalInfo}
        </Paragraph>
      </div>
    </div>
  );
};

export default ProductDetail; 