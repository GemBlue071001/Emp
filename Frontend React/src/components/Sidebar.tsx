import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  TeamOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: '/admin',
      icon: <DashboardOutlined style={{ fontSize: '16px' }} />,
      label: 'Dashboard',
    },
    {
      key: '/home',
      icon: <UserOutlined style={{ fontSize: '16px' }} />,
      label: 'Users',
    },
    {
      key: '/departments',
      icon: <TeamOutlined style={{ fontSize: '16px' }} />,
      label: 'Departments',
    },
  ];

  const handleMenuClick = (item: { key: string }) => {
    if (item.key === 'logout') {
      localStorage.removeItem('accessToken');
      navigate('/login');
    } else {
      navigate(item.key);
    }
  };

  return (
    <Sider
      width={180}
      style={{
        background: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <div style={{ padding: '20px 16px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#0066ff',
          margin: 0,
          lineHeight: 1.2
        }}>
          Admin<br />Panel
        </h1>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultSelectedKeys={['/admin']}
        items={menuItems}
        style={{ 
          borderRight: 'none',
        }}
        onClick={handleMenuClick}
      />
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%',
        borderTop: '1px solid #f0f0f0'
      }}>
        <Menu
          mode="inline"
          items={[
            {
              key: '/view-user',
              icon: <ProfileOutlined style={{ fontSize: '16px', color: '#1890ff' }} />,
              label: <span style={{ color: '#1890ff' }}>User Profile</span>,
            },
            {
              key: 'logout',
              icon: <LogoutOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />,
              label: <span style={{ color: '#ff4d4f' }}>Logout</span>,
            },
          ]}
          onClick={handleMenuClick}
          style={{ borderRight: 'none' }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar; 