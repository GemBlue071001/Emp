import React, { useState } from 'react';
import { Table, Tag, Space, Avatar, Button, Modal, message, Input, Form, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { jwtDecode } from 'jwt-decode';

const { Option } = Select;

interface TableRow {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  subDepartment: string | null;
  departmentId: number;
}

interface Department {
  id: number;
  name: string;
}

interface TableComponentProps {
  data: TableRow[];
  departments: Department[];
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

const TableComponent: React.FC<TableComponentProps> = ({ data, departments, loading, pagination }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string>('');
  const [form] = Form.useForm();

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
    form.setFieldsValue({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phone: record.phone,
      userName: record.name,
      password: '',
      departmentId: record.departmentId
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`https://localhost:7073/api/users/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      message.success('User updated successfully');
      setIsEditModalVisible(false);
      if (pagination && pagination.onChange) {
        pagination.onChange(pagination.current);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Failed to update user');
    }
  };

  const handleDelete = (email: string) => {
    setEmailToDelete(email);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://localhost:7073/api/users?email=${emailToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success('User deleted successfully');
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
      setIsDeleteModalVisible(false);
      window.location.reload();
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
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ remember: true }}
          style={{ marginTop: '-12px' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please input first name!' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input size="middle" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please input last name!' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input size="middle" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              style={{ marginBottom: '12px' }}
            >
              <Input disabled size="middle" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Please input phone number!' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input size="middle" />
            </Form.Item>
            <Form.Item
              name="userName"
              label="Username"
              rules={[{ required: true, message: 'Please input username!' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input size="middle" />
            </Form.Item>
            <Form.Item
              name="password"
              label="New Password (optional)"
              style={{ marginBottom: '12px' }}
            >
              <Input.Password size="middle" />
            </Form.Item>
            <Form.Item
              name="departmentId"
              label="Department"
              rules={[{ required: true, message: 'Please select department!' }]}
              style={{ marginBottom: '12px' }}
            >
              <Select size="middle">
                {departments.map(dept => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default TableComponent; 