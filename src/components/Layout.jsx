import React from 'react';
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown, Menu as AntMenu } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  ShoppingOutlined,
  QuestionCircleOutlined,
  PlayCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">Beranda</Link>,
    },
    {
      key: '/products',
      label: <Link to="/products">Produk</Link>,
    },
    {
      key: '/playlist',
      label: <Link to="/playlist">Playlist</Link>,
    },
    {
      key: '/cart',
      label: <Link to="/cart">Keranjang</Link>,
    },
    {
      key: '/rental-history',
      label: <Link to="/rental-history">Riwayat Sewa</Link>,
    },
    // Only show admin menu for admin users
    ...(user?.role === 'admin' ? [
      {
        key: '/admin',
        label: <Link to="/admin">Admin</Link>,
      }
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Dropdown menu for profile
  const profileMenu = (
    <AntMenu>
      <AntMenu.Item key="profile" onClick={() => navigate('/profile')}>
        Profil
      </AntMenu.Item>
      <AntMenu.Item key="logout" onClick={handleLogout} danger>
        Logout
      </AntMenu.Item>
    </AntMenu>
  );

  return (
    <AntLayout className="min-h-screen">
      <Header className="flex items-center justify-between px-6" style={{ background: '#2C3E50' }}>
        <div className="flex items-center w-full">
          <div className="text-white text-xl font-bold mr-8">TendaKu</div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ 
              flex: 1,
              border: 'none',
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: 'center',
              minWidth: 0,
              gap: '8px',
              background: 'transparent',
            }}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-4 ml-4">
          {user ? (
            <>
              <Dropdown overlay={profileMenu} placement="bottomRight" trigger={["click"]}>
                <div className="text-white flex items-center gap-2 cursor-pointer select-none">
                  <Avatar src={user.photo} icon={!user.photo && <UserOutlined />} />
                <span>{user.name}</span>
              </div>
              </Dropdown>
            </>
          ) : (
            <Button
              type="primary"
              onClick={() => navigate('/login')}
              className="login-button bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Button>
          )}
        </div>
      </Header>
      <Content className="p-6">
        {children}
      </Content>
      <Footer className="text-center">
        TendaKu ©{new Date().getFullYear()} Created by ZenCode
      </Footer>
    </AntLayout>
  );
};

export default Layout; 