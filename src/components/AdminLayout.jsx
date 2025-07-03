import React from 'react';
import { Avatar, Button, Dropdown, Menu as AntMenu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();

  // Dropdown menu for profile
  const profileMenu = (
    <AntMenu>
      <AntMenu.Item key="logout" onClick={logout} danger>
        Logout
      </AntMenu.Item>
    </AntMenu>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <div className="bg-[#2C3E50] text-white py-4 px-8 text-2xl font-bold shadow flex items-center justify-between">
        <span>Dashboard Admin</span>
        {user && (
          <Dropdown overlay={profileMenu} placement="bottomRight" trigger={["click"]}>
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <Avatar src={user.photo} icon={!user.photo && <UserOutlined />} />
              <span className="text-base font-normal">{user.name}</span>
            </div>
          </Dropdown>
        )}
      </div>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default AdminLayout; 