import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginImage from '../assets/register.jpeg';

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
    <div className="min-h-screen flex items-center justify-center px-2 md:px-0" style={{ background: '#E7F1FF' }}>
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden" style={{ background: '#F9FCFF' }}>
        {/* Kiri: Gambar */}
        <div className="flex-1 hidden md:block">
          <img src={loginImage} alt="Camping Login" className="w-full h-full object-cover object-center rounded-l-3xl" />
        </div>
        {/* Kanan: Form Login */}
        <div className="flex-1 flex items-center justify-center rounded-r-3xl" style={{ background: '#F9FCFF' }}>
          <div className="w-full max-w-md p-10">
            <div className="text-center mb-8">
              <Title level={2} style={{ color: '#061F5C', fontWeight: 700, marginBottom: 0, fontSize: 32 }}>Selamat Datang di TendaKu</Title>
              <p className="mt-2 text-base" style={{ color: '#334EAC' }}>Silakan login untuk melanjutkan petualangan campingmu!</p>
            </div>
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
                style={{ color: '#334EAC' }}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#334EAC' }} />} 
                  placeholder="Email" 
                  size="large"
                  className="rounded-xl"
                  style={{ borderColor: '#334EAC' }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Silakan masukkan password Anda' }]}
                style={{ color: '#334EAC' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#334EAC' }} />}
                  placeholder="Password"
                  size="large"
                  className="rounded-xl"
                  style={{ borderColor: '#334EAC' }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" className="rounded-xl border-none" style={{ background: '#334EAC', borderColor: '#334EAC', color: '#fff' }}>
                  Login
                </Button>
              </Form.Item>
              <div className="text-center">
                Belum punya akun?{' '}
                <Link to="/register" className="font-semibold hover:underline" style={{ color: '#334EAC' }}>Daftar di sini</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 