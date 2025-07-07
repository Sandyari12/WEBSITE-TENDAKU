import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Radio, 
  Card, 
  Typography, 
  message,
  Spin
} from 'antd';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const RentalForm = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!user) {
      message.error('Anda harus login untuk melakukan pemesanan!');
      navigate('/login');
      return;
    }

    // Fetch product data
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/v1/product/read/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.datas && data.datas.length > 0) {
            setProduct(data.datas[0]);
          } else {
            message.error('Produk tidak ditemukan');
            navigate('/products');
          }
        } else {
          message.error('Produk tidak ditemukan');
          navigate('/products');
        }
      } catch (error) {
        message.error('Gagal mengambil data produk');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setLoading(false);
    }

    // Set form values
    form.setFieldsValue({
      email: user.username,
      name: user.name,
    });
  }, [user, form, navigate, id]);

  const onFinish = async (values) => {
    if (!user) {
      message.error('Anda harus login untuk melakukan pemesanan!');
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      // 1. Create rental
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('address', values.address);
      formData.append('status', 'menunggu');
      formData.append('total', product?.price || 0);
      
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

      // 2. Create rental_item
      if (product) {
        const itemForm = new FormData();
        itemForm.append('rental_id', rentalId);
        itemForm.append('product_id', product.id);
        itemForm.append('quantity', 1);
        itemForm.append('rental_days', 1);
        itemForm.append('price', product.price);
        
        const itemRes = await fetch('/api/v1/rental_item/create', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: itemForm,
        });
        
        if (!itemRes.ok) {
          console.warn('Gagal membuat rental item, tapi rental sudah dibuat');
        }
      }
      
      message.success('Penyewaan berhasil!');
      navigate('/rental-history');
    } catch (error) {
      console.error('Error creating rental:', error);
      message.error('Gagal melakukan penyewaan: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Memuat data produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Produk tidak ditemukan</p>
        <Button onClick={() => navigate('/products')}>Kembali ke Produk</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>Form Penyewaan</Title>
      
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>{product.name}</Title>
        <Paragraph>
          Harga Sewa: Rp {product.price?.toLocaleString('id-ID')} / hari
        </Paragraph>
        {product.description && (
          <Paragraph>{product.description}</Paragraph>
        )}
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item name="name" label="Nama" rules={[{ required: true, message: 'Nama harus diisi' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email harus diisi' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Telepon" rules={[{ required: true, message: 'Telepon harus diisi' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Alamat" rules={[{ required: true, message: 'Alamat harus diisi' }]}>
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} size="large">
            Sewa Sekarang
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RentalForm; 