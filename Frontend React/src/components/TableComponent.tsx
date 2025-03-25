import React from 'react';
import { Table, Tag, Space, Avatar, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

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

const TableComponent: React.FC<TableComponentProps> = ({ data, loading, pagination }) => {
  const navigate = useNavigate();

  const handleEdit = (record: TableRow) => {
    navigate('/update-user', { state: { userData: record } });
  };

  const handleDelete = async (email: string) => {
    try {
      const response = await fetch(`https://localhost:7073/api/users?email=${email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
          'accept': '*/*'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      Modal.error({
        title: 'Error',
        content: 'Failed to delete user'
      });
    }
  }



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
      dataIndex: 'subDepartment',
      key: 'subDepartment',
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
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            style={{ padding: 0, color: '#1890ff' }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            style={{ padding: 0, color: '#ff4d4f' }}
            onClick={() => handleDelete(record.email)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
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
  );
};

export default TableComponent; 