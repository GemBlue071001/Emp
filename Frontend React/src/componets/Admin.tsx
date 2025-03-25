import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TableComponent from '../components/TableComponent';
import Sidebar from '../components/Sidebar';
import { Spin, Layout, Input, Button } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';

const { Content } = Layout;

interface User {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  subDepartment: string | null;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSize = 15;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const normalizedSearchQuery = searchQuery.toLowerCase();
        const response = await fetch(`https://localhost:7073/api/users?page=${page}&size=${pageSize}&searchQuery=${normalizedSearchQuery}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.result.data);
        setTotalPages(data.result.totalPages);
        setTotalItems(data.result.totalElemets);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderContent = () => {
    if (loading && users.length === 0) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div style={{ color: '#ff4d4f' }}>Error: {error}</div>
        </div>
      );
    }

    return (
      <>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
            Admin Dashboard
          </h1>
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ width: '300px' }}
          />
           
        </div>
        <Button 
              type="primary"
              style={{ width: '200px' }}
              icon={<UserAddOutlined />}
              onClick={() => {
                navigate('/users')
              }}
            >
              Add User
            </Button>
        <TableComponent
          data={users}
          loading={loading}
          pagination={{
            current: page,
            total: totalItems,
            pageSize: pageSize,
            onChange: handlePageChange
          }}
        />
      </>
    );
  };

  return (
    <>
      <Sidebar />
      {renderContent()}
    </>
  );
};

export default AdminDashboard;
