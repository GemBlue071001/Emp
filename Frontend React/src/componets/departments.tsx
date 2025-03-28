import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, message, Button, Modal, Select, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Department {
  id: number;
  name: string;
  parentId: number;
  key: number;
}

interface ApiResponse {
  code: number;
  message: string;
  result: Omit<Department, 'key'>[];
}

interface NewDepartment {
  name: string;
  parentId: number;
}

const DepartmentComponent: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDepartment, setNewDepartment] = useState<NewDepartment>({
    name: '',
    parentId: 0
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://localhost:7073/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }

      const data: ApiResponse = await response.json();
      if (data.code === 200) {
        const departmentsWithKey = data.result.map(dept => ({
          ...dept,
          key: dept.id
        }));
        setDepartments(departmentsWithKey);
      } else {
        message.error(data.message || 'Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      message.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setNewDepartment({ name: '', parentId: 0 });
    setIsModalVisible(false);
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.name.trim()) {
      message.error('Please enter department name');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://localhost:7073/api/departments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDepartment),
      });
      handleModalClose();
      fetchDepartments();
      if (!response.ok) {
        throw new Error('Failed to create department');
      }

      const data = await response.json();
      if (data.code === 200) {
        message.success('Department created successfully');
        handleModalClose();
        await fetchDepartments();
      } else {
        message.error(data.message || 'Failed to create department');
      }
    } catch (error) {
      console.error('Error creating department:', error);
      message.error('Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getParentDepartmentName = (parentId: number): string => {
    const parent = departments.find(dept => dept.id === parentId);
    return parent ? parent.name : 'None';
  };

  const columns: ColumnsType<Department> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Parent Department',
      key: 'parentDepartment',
      render: (_, record) => getParentDepartmentName(record.parentId),
      sorter: (a, b) => {
        const parentNameA = getParentDepartmentName(a.parentId);
        const parentNameB = getParentDepartmentName(b.parentId);
        return parentNameA.localeCompare(parentNameB);
      },
    }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '180px', padding: '24px', flex: 1 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0 }}>Departments</Title>
            
          </div>
          <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Add Department
            </Button>
          <Table
            columns={columns}
            dataSource={departments}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} departments`
            }}
          />
        </Card>

        <Modal
          title="Add New Department"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              loading={isSubmitting}
              onClick={handleAddDepartment}
            >
              Create
            </Button>
          ]}
        >
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
              Department Name
            </div>
            <Input
              placeholder="Enter department name"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <div style={{ marginBottom: '8px' }}>Parent Department</div>
            <Select
              style={{ width: '100%' }}
              placeholder="Select parent department"
              value={newDepartment.parentId}
              onChange={(value) => setNewDepartment(prev => ({ ...prev, parentId: value }))}
              allowClear
            >
              <Select.Option value={0}>None</Select.Option>
              {departments.map(dept => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DepartmentComponent;
