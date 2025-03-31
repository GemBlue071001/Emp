import React, { useState, useEffect } from 'react';
import TableComponent from '../components/TableComponent';
import Sidebar from '../components/Sidebar';
import { Spin, Input, Button, Select, Modal, Form, message, TreeSelect } from 'antd';
import { SearchOutlined, UserAddOutlined, CarryOutOutlined } from '@ant-design/icons';
import type { TreeDataNode } from 'antd';

const { Option } = Select;

interface User {
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
  parentId: number;
}

const transformToTreeData = (departments: Department[]): TreeDataNode[] => {
  const buildTree = (parentId: number): TreeDataNode[] => {
    return departments
      .filter(dept => dept.parentId === parentId)
      .map(dept => ({
        title: dept.name,
        key: dept.id.toString(),
        value: dept.id.toString(),
        label: dept.name,
        icon: <CarryOutOutlined />,
        children: buildTree(dept.id)
      }))
      .filter(node => node !== null);
  };

  return buildTree(0);
};

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
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const pageSize = 15;

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
    fetchUsers();
  }, [page, searchQuery, selectedDepartment, selectedRole]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCreateUser = async () => {
    try {
      const values = await createForm.validateFields();
      const response = await fetch('https://localhost:7073/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          userType: 'USER'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      message.success(data.message);
      setIsCreateModalVisible(false);
      createForm.resetFields();
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Failed to create user');
    }
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
            onClick={() => setIsCreateModalVisible(true)}
          >
            Add User
          </Button>
        </div>
        <TableComponent
          data={users}
          departments={departments}
          loading={loading}
          pagination={{
            current: page,
            total: totalItems,
            pageSize: pageSize,
            onChange: handlePageChange
          }}
        />
        <Modal
          title="Create User"
          open={isCreateModalVisible}
          onOk={handleCreateUser}
          onCancel={() => {
            setIsCreateModalVisible(false);
            createForm.resetFields();
          }}
          width={800}
        >
          <Form
            form={createForm}
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
                name="userName"
                label="Username"
                rules={[{ required: true, message: 'Please input username!' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input size="middle" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input password!' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input.Password size="middle" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
                style={{ marginBottom: '12px' }}
              >
                <Input size="middle" />
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
                name="departmentId"
                label="Department"
                rules={[{ required: true, message: 'Please select department!' }]}
                style={{ marginBottom: '12px' }}
              >
                <TreeSelect
                  style={{ width: '100%' }}
                  placeholder="Select Department"
                  allowClear
                  treeDefaultExpandAll
                  treeData={transformToTreeData(departments)}
                />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </>
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '180px', padding: '24px', flex: 1 }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
