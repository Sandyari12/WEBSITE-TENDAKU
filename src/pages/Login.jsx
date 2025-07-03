import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const result = await login(values.email, values.password);
    if (result && result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from || '/');
      }
    } else {
      message.error('Email atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '20px', left: '20px' }}
      >
        Kembali ke Beranda
      </Button>
      <div className="w-full max-w-md">
        <Card>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Login
          </Title>
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Silakan masukkan email Anda' },
                { type: 'email', message: 'Email tidak valid' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Email" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Silakan masukkan password Anda' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Login
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              Belum punya akun?{' '}
              <Link to="/register">Daftar di sini</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login; 