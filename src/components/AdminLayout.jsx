import React from 'react';
import { Avatar, Dropdown, Menu as AntMenu } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, FileOutlined, MessageOutlined, BellOutlined, EnvironmentOutlined, BarChartOutlined, AppstoreOutlined, PlayCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <HomeOutlined />, path: '/admin' },
  { key: 'products', label: 'Kelola Produk', icon: <AppstoreOutlined />, path: '/kelolaproduk' },
  { key: 'orders', label: 'Kelola Pesanan', icon: <ShoppingCartOutlined />, path: '/kelolapesanan' },
  { key: 'playlists', label: 'Kelola Playlist', icon: <PlayCircleOutlined />, path: '/kelolaplaylist' },
  { key: 'location', label: 'Location', icon: <EnvironmentOutlined />, path: '/admin?tab=location' },
  { key: 'graph', label: 'Graph', icon: <BarChartOutlined />, path: '/admin?tab=graph' },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const activeKey = menuItems.find(item => location.pathname === item.path)?.key || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#22304A] text-white flex flex-col items-center py-8 shadow-lg min-h-screen fixed left-0 top-0 h-full z-30">
        <Avatar size={80} src={user?.photo} icon={!user?.photo && <UserOutlined />} className="mb-4 bg-white text-[#22304A]" />
        <div className="text-lg font-bold mb-1">{user?.name || 'Admin'}</div>
        <div className="text-sm text-blue-100 mb-8">{user?.username || user?.email || 'admin@email.com'}</div>
        <nav className="w-full flex-1">
          <ul className="space-y-2 px-6">
            {menuItems.map(item => (
              <li
                key={item.key}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-colors ${activeKey === item.key ? 'bg-[#2C3E50]' : 'hover:bg-[#2C3E50]'}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon} <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-8 w-full flex flex-col items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#22304A] rounded-lg shadow hover:bg-blue-100 transition font-semibold w-40 justify-center"
          >
            <HomeOutlined />
            <span>Ke Beranda</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 cursor-pointer select-none px-4 py-2 bg-[#2C3E50] rounded-lg hover:bg-[#1B2536] w-40 justify-center text-white font-semibold"
          >
            <LogoutOutlined /> <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        {/* Header */}
        <div className="bg-white py-4 px-8 text-2xl font-bold shadow flex items-center justify-between">
          <span>Dashboard Admin</span>
        </div>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout; 