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
  // const [form] = Form.useForm();
  // const [product, setProduct] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [submitting, setSubmitting] = useState(false);
  // const { id } = useParams();
  // const { user } = useAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   fetchProduct();
  // }, [id]);

  // const fetchProduct = async () => {
  //   try {
  //     const response = await api.get(`/products/${id}`);
  //     setProduct(response.data);
  //   } catch (error) {
  //     message.error('Gagal mengambil detail produk');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const onFinish = async (values) => {
  //   setSubmitting(true);
  //   try {
  //     const rentalData = {
  //       productId: id,
  //       startDate: values.dates[0].format('YYYY-MM-DD'),
  //       endDate: values.dates[1].format('YYYY-MM-DD'),
  //       pickupMethod: values.pickupMethod,
  //       notes: values.notes,
  //     };

  //     const response = await api.post('/rentals', rentalData);
  //     message.success('Penyewaan berhasil!');
  //     navigate(`/rentals/${response.data.id}`);
  //   } catch (error) {
  //     message.error('Gagal melakukan penyewaan: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // if (loading) {
  //   return (
  //     <div style={{ textAlign: 'center', padding: '50px' }}>
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <div>
      <Title level={2}>Form Penyewaan</Title>
      
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>{product?.name}</Title>
        <Paragraph>
          Harga Sewa: Rp {product?.price.toLocaleString('id-ID')} / hari
        </Paragraph>
      </Card>


    </div>
  );
};

export default RentalForm; 