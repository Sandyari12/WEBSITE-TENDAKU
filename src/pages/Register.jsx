import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const result = await register(values.name, values.email, values.password);
    if (result.success) {
      message.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } else {
      message.error(result.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2}>Daftar Akun</Title>
          <p className="text-gray-600">Buat akun baru untuk mulai menyewa</p>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Nama harus diisi' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nama Lengkap"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email harus diisi' },
              { 
                validator: (_, value) => {
                  if (!value || value.includes('@')) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Email harus mengandung karakter @');
                }
              }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Nomor telepon harus diisi' }]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Nomor Telepon"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Password harus diisi' },
              { min: 6, message: 'Password minimal 6 karakter' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Konfirmasi password harus diisi' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Password tidak cocok'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Konfirmasi Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
            >
              Daftar
            </Button>
          </Form.Item>

          <div className="text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Login di sini
              </Link>
            </p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 