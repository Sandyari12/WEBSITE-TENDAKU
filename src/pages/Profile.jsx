import React, { useState, useRef } from 'react';
import { Card, Typography, Button, Avatar, Input, Form } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  if (!user) {
    return <div className="text-center mt-12">Anda belum login.</div>;
  }

  const handleEdit = () => {
    setEditMode(true);
    form.setFieldsValue({
      name: user.name,
      password: '',
    });
    setPhotoPreview(user.photo || null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setPhotoPreview(user.photo || null);
  };

  const handleSave = (values) => {
    updateProfile({
      name: values.name,
      password: values.password ? values.password : undefined,
      photo: photoPreview,
    });
    setEditMode(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] bg-gradient-to-br from-[#2C3E50] via-blue-100 to-white py-12 px-4">
      {/* Back to Home Navbar */}
      <div className="w-full max-w-lg mb-6">
        <Button
          icon={<HomeOutlined />}
          style={{ backgroundColor: '#2C3E50', color: 'white', borderColor: '#2C3E50' }}
          onClick={() => navigate('/')}
          block
        >
          Kembali ke Beranda
        </Button>
      </div>

      <Card
        className="w-full max-w-lg shadow-2xl rounded-2xl border border-[#2C3E50] p-8"
        style={{ background: 'rgba(255,255,255,0.95)' }}
      >
        <div className="flex flex-col items-center mb-6">
          <Avatar
            size={96}
            icon={!photoPreview && <UserOutlined />}
            src={photoPreview}
            style={{ backgroundColor: '#2C3E50', marginBottom: 16 }}
          />
          <Title level={2} style={{ color: '#2C3E50', textAlign: 'center', marginBottom: 0 }}>
            Profil Saya
          </Title>
          <Paragraph style={{ color: '#2C3E50', marginTop: 4, marginBottom: 0, fontWeight: 500 }}>
            {user.role === 'admin' ? 'Admin' : 'Pengguna'}
          </Paragraph>
        </div>

        {editMode ? (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ name: user.name, password: '' }}
            onFinish={handleSave}
          >
            <Form.Item
              label="Nama"
              name="name"
              rules={[{ required: true, message: 'Nama tidak boleh kosong' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Password Baru" name="password">
              <Input.Password placeholder="Kosongkan jika tidak ingin mengubah" />
            </Form.Item>

            <Form.Item label="Foto Profil">
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handlePhotoChange}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current.click()}
              >
                Pilih Foto
              </Button>
              {photoPreview && (
                <div className="mt-4 flex justify-center">
                  <Avatar size={64} src={photoPreview} />
                </div>
              )}
            </Form.Item>

            <div className="flex gap-2 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                style={{ backgroundColor: '#2C3E50', borderColor: '#2C3E50' }}
              >
                Simpan
              </Button>
              <Button onClick={handleCancel}>Batal</Button>
            </div>
          </Form>
        ) : (
          <>
            <div className="mb-8 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#2C3E50] w-24">Nama:</span>
                <span className="text-gray-700">{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#2C3E50] w-24">Email:</span>
                <span className="text-gray-700">{user.email}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button
                icon={<EditOutlined />}
                onClick={handleEdit}
                style={{ backgroundColor: '#2C3E50', borderColor: '#2C3E50', color: 'white' }}
              >
                Edit Profil
              </Button>
              <Button type="primary" danger onClick={logout}>
                Logout
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Profile;
