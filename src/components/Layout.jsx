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
    <AntLayout className="min-h-screen bg-softblue" style={{ background: 'transparent' }}>
      <Header className="flex items-center justify-between px-6" style={{ background: '#2C3E50' }}>
        <div className="flex items-center w-full">
          <div className="text-white text-2xl font-extrabold mr-8">TendaKu</div>
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
        <div className="flex items-center gap-6 ml-4">
          {user ? (
            <>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => navigate('/profile')}
                style={{ background: 'transparent', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                title="Profil"
              >
                <span
                  className={`rounded-full flex items-center justify-center ${user.photo ? '' : 'bg-white/20 p-2'}`}
                  style={{ width: 36, height: 36 }}
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <UserOutlined style={{ fontSize: 20 }} />
                  )}
                </span>
                <span className="font-normal text-white text-base">{user.name}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2 py-1 text-sm font-normal hover:text-red-400 transition text-white"
                title="Logout"
                style={{ height: 32 }}
              >
                <LogoutOutlined style={{ fontSize: 15 }} />
                <span className="text-sm">Logout</span>
              </button>
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
      <Content className="p-6 bg-transparent">
        {children}
      </Content>
      <Footer className="text-center bg-transparent">
        TendaKu ©{new Date().getFullYear()} Created by ZenCode
      </Footer>
    </AntLayout>
  );
};

export default Layout; 