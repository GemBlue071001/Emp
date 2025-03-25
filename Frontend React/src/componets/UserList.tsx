import React, { useEffect, useState } from 'react';
import { Button, Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import TableComponent from '../components/TableComponent';
import Sidebar from '../components/Sidebar';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userName: string;
  roleId: number;
  role: string | null;
  subDepartment: string | null;
  departmentName: string | null;
  departmentId: number;
}

interface TransformedUser {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  departmentName: string | null;
  subDepartment: string;
}

interface ApiResponse {
  code: number;
  message: string;
  result: User[];
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<TransformedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://localhost:7073/api/users/user-department', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: ApiResponse = await response.json();
      if (data.code === 200) {
        const transformedUsers = data.result.map(user => ({
          email: user.email,
          name: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          userType: getRoleName(user.roleId),
          departmentName: user.departmentName,
          subDepartment: `${user.departmentName}`
        }));
        setUsers(transformedUsers);
        setTotal(data.result.length);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (roleId: number): string => {
    switch (roleId) {
      case 1:
        return 'USER';
      case 2:
        return 'MANAGER';
      case 3:
        return 'ADMIN';
      default:
        return 'UNKNOWN';
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.userType.toLowerCase().includes(value.toLowerCase()) ||
      user.subDepartment.toLowerCase().includes(value.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '180px', padding: '24px', flex: 1 }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>User Management</h1>
         
        </div>
        <TableComponent
          data={users}
          loading={loading}
          pagination={{
            current: currentPage,
            total: total,
            pageSize: pageSize,
            onChange: handlePageChange
          }}
        />
      </div>
    </div>
  );
};

export default UserList;
