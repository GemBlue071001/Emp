import React, { useState } from 'react';
import { Table, Tag, Space, Avatar, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { jwtDecode } from 'jwt-decode';

interface TableRow {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  subDepartment: string | null;
}

interface TableComponentProps {
  data: TableRow[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
}

interface DecodedToken {
  roleId: number;
  exp: number;
  Authorities: string;
}

const TableComponent: React.FC<TableComponentProps> = ({ data, loading, pagination }) => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string>('');

  const isCurrentUserAdmin = (): boolean => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token) as DecodedToken;
        return decoded.Authorities === "ADMIN";
      } catch (error) {
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  };

  const handleEdit = (record: TableRow) => {
    navigate('/update-user', { state: { userData: record } });
  };

  const handleDelete = (email: string) => {
    setEmailToDelete(email);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://localhost:7073/api/users/${emailToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success('User deleted successfully');
        // Trigger refresh of data
        if (pagination && pagination.onChange) {
          pagination.onChange(pagination.current);
        }
      } else {
        message.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    } finally {
      setIsModalVisible(false);
    }
  };

  const columns: ColumnsType<TableRow> = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TableRow) => (
        <Space>
          <Avatar style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
            {record.firstName.charAt(0)}
          </Avatar>
          <span>{`${record.firstName} ${record.lastName}`}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (text: string | null) => text || '',
    },
    {
      title: 'Role',
      dataIndex: 'userType',
      key: 'userType',
      render: (userType: string) => (
        <Tag color={userType === 'ADMIN' ? '#1890ff' : undefined} style={{ borderRadius: '2px' }}>
          {userType}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const isAdmin = isCurrentUserAdmin();
        const isUserAdmin = record.userType === 'ADMIN';
        const disableActions = !isAdmin || isUserAdmin;

        return (
          <Space size="middle">
            <Button
              type="link"
              style={{ 
                padding: 0, 
                color: disableActions ? '#d9d9d9' : '#1890ff',
                cursor: disableActions ? 'not-allowed' : 'pointer'
              }}
              onClick={() => !disableActions && handleEdit(record)}
              disabled={disableActions}
            >
              Edit
            </Button>
            <Button
              type="link"
              style={{ 
                padding: 0, 
                color: disableActions ? '#d9d9d9' : '#ff4d4f',
                cursor: disableActions ? 'not-allowed' : 'pointer'
              }}
              onClick={() => !disableActions && handleDelete(record.email)}
              disabled={disableActions}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="email"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: false,
          showQuickJumper: false,
          size: 'small',
          style: { marginBottom: 0 }
        }}
        style={{ marginTop: '8px' }}
      />
      <Modal
        title="Confirm Delete"
        open={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </>
  );
};

export default TableComponent; 