import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';

const { Sider } = Layout;

interface DecodedToken {
  roleId: number;
  exp: number;
  Authorities: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token) as DecodedToken;
        setIsAdmin(decoded.Authorities === "ADMIN");
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAdmin(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const menuItems = [
    ...(isAdmin ? [
      {
        key: '/admin',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/admin')
      },
      {
        key: '/departments',
        icon: <TeamOutlined />,
        label: 'Departments',
        onClick: () => navigate('/departments')
      }
    ] : []),
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/home')
    },
    {
      key: '/view-user',
      icon: <ProfileOutlined />,
      label: 'Profile',
      onClick: () => navigate('/view-user')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#001529'
      }}
      width={180}
    >
      <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>
          {isAdmin ? 'Admin Panel' : 'User Panel'}
        </h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar; 