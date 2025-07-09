// ✅ Register.jsx (diperbaiki: aturan "rules" pakai kurung kurawal yang benar)
import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import registerImage from '../assets/register.jpeg';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("username", values.email); // sesuai backend
    formData.append("password", values.password);
    formData.append("roles", "user"); // default user

    try {
      const response = await fetch(`/api/v1/user/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DETAIL:", errorText);
        throw new Error("Registrasi gagal");
      }

      message.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      console.error("Registrasi gagal:", error);
      message.error("Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 md:px-0" style={{ background: '#E7F1FF' }}>
      <div className="w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden" style={{ background: '#F9FCFF' }}>
        {/* Kiri: Gambar */}
        <div className="flex-1 hidden md:block">
          <img src={registerImage} alt="Camping Register" className="w-full h-full object-cover object-center rounded-l-3xl" />
        </div>
        {/* Kanan: Form Register */}
        <div className="flex-1 flex items-center justify-center rounded-r-3xl" style={{ background: '#F9FCFF' }}>
          <div className="w-full max-w-md p-8">
            <div className="text-center mb-8">
              <Title level={2} style={{ color: '#061F5C', fontWeight: 700, marginBottom: 0, fontSize: 32 }}>Buat Akun TendaKu</Title>
              <p className="mt-2 text-base" style={{ color: '#334EAC' }}>Bergabung dan mulai petualangan campingmu!</p>
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
                style={{ color: '#334EAC' }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#334EAC' }} />}
                  placeholder="Nama Lengkap"
                  size="large"
                  className="rounded-xl"
                  style={{ borderColor: '#334EAC' }}
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Email harus diisi' },
                  { type: 'email', message: 'Email tidak valid' }
                ]}
                style={{ color: '#334EAC' }}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#334EAC' }} />}
                  placeholder="Email"
                  size="large"
                  className="rounded-xl"
                  style={{ borderColor: '#334EAC' }}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Nomor telepon harus diisi' }]}
                style={{ color: '#334EAC' }}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#334EAC' }} />}
                  placeholder="Nomor Telepon"
                  size="large"
                  className="rounded-xl"
                  style={{ borderColor: '#334EAC' }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Password harus diisi' },
                  { min: 6, message: 'Password minimal 6 karakter' }
                ]}
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
                  })
                ]}
                style={{ color: '#334EAC' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#334EAC' }} />}
                  placeholder="Konfirmasi Password"
                  size="large"
                  className="rounded-xl"
                  style={{ borderColor: '#334EAC' }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="rounded-xl border-none"
                  style={{ background: '#334EAC', borderColor: '#334EAC', color: '#fff' }}
                >
                  Daftar
                </Button>
              </Form.Item>
              <div className="text-center">
                <p className="text-base" style={{ color: '#334EAC' }}>
                  Sudah punya akun?{' '}
                  <Link to="/login" className="font-semibold hover:underline" style={{ color: '#334EAC' }}>
                    Login di sini
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
