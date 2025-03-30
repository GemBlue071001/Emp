import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TableComponent from '../components/TableComponent';
import Sidebar from '../components/Sidebar';
import { Spin, Input, Button, Select } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';

const { Option } = Select;

interface User {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  subDepartment: string | null;
}

interface Department {
  id: number;
  name: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>();
  const [selectedRole, setSelectedRole] = useState<number | undefined>();
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSize = 15;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('https://localhost:7073/api/departments', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }

        const data = await response.json();
        setDepartments(data.result);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const normalizedSearchQuery = searchQuery.toLowerCase();
        let url = `https://localhost:7073/api/users?page=${page}&size=${pageSize}&searchQuery=${normalizedSearchQuery}`;
        
        if (selectedDepartment) {
          url += `&departmentId=${selectedDepartment}`;
        }
        if (selectedRole) {
          url += `&roleId=${selectedRole}`;
        }

        const response = await fetch(url, {
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
        setTotalItems(data.result.totalElemets);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchQuery, selectedDepartment, selectedRole]);

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
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              style={{ width: '300px' }}
            />
            <Select
              style={{ width: '200px' }}
              placeholder="Department"
              value={selectedDepartment}
              onChange={(value) => {
                setSelectedDepartment(value);
                setPage(1);
              }}
              allowClear
            >
              {departments.map(dept => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
            <Select
              style={{ width: '200px' }}
              placeholder="Role"
              value={selectedRole}
              onChange={(value) => {
                setSelectedRole(value);
                setPage(1);
              }}
              allowClear
            >
              <Option value={1}>ADMIN</Option>
              <Option value={2}>USER</Option>
            </Select>
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
        </div>
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
