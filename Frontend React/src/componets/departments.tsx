import React, { useEffect, useState } from 'react';
import { Card, Typography, message, Button, Modal, Select, Input, Tree } from 'antd';
import { PlusOutlined, CarryOutOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import type { TreeDataNode } from 'antd';

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

interface EditDepartment {
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
        icon: <CarryOutOutlined />,
        children: buildTree(dept.id)
      }))
      .filter(node => node !== null);
  };

  return buildTree(0);
};

const DepartmentComponent: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDepartment, setNewDepartment] = useState<NewDepartment>({
    name: '',
    parentId: 0
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<EditDepartment>({
    id: 0,
    name: '',
    parentId: 0
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, [navigate]);

  const fetchDepartments = async () => {
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

      if (!response.ok) {
        throw new Error('Failed to create department');
      }

      const data = await response.json();
      await fetchDepartments();
      handleModalClose();
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

  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://localhost:7073/api/departments', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingDepartment)
      });

      if (response.ok) {
        message.success('Department updated successfully');
        setIsEditModalVisible(false);
        fetchDepartments();
      } else {
        message.error('Failed to update department');
      }
    } catch (error) {
      message.error('Error occurred while updating department');
      console.error('Update error:', error);
    }
    setIsSubmitting(false);
  };

  const handleTreeNodeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const selectedId = Number(selectedKeys[0]);
      const selectedDepartment = departments.find(dept => dept.id === selectedId);
      if (selectedDepartment) {
        setEditingDepartment({
          id: selectedDepartment.id,
          name: selectedDepartment.name,
          parentId: selectedDepartment.parentId
        });
        setIsEditModalVisible(true);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`https://localhost:7073/api/departments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (response.ok) {
        message.success('Department deleted successfully');
        setIsEditModalVisible(false);
        fetchDepartments();
      } else {
        message.error('Failed to delete department');
      }
    } catch (error) {
      message.error('Error occurred while deleting department');
      console.error('Delete error:', error);
    }
  };

  const showDeleteConfirm = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    handleDelete(editingDepartment.id);
    setIsDeleteModalVisible(false);
  };

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
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <Card style={{ width: '300px' }}>
              <Tree
                showLine
                showIcon
                defaultExpandAll
                treeData={transformToTreeData(departments)}
                onSelect={handleTreeNodeSelect}
              />
            </Card>
          </div>
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

        <Modal
          title="Edit Department"
          open={isEditModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => setIsEditModalVisible(false)}
          confirmLoading={isSubmitting}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
              Cancel
            </Button>,
            <Button 
              key="delete" 
              danger 
              icon={<DeleteOutlined />}
              onClick={showDeleteConfirm}
            >
              Delete
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              loading={isSubmitting}
              onClick={handleEditSubmit}
            >
              Save
            </Button>
          ]}
        >
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
              Department Name
            </div>
            <Input
              placeholder="Department Name"
              value={editingDepartment.name}
              onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
            />
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>Parent Department</div>
            <Select
              style={{ width: '100%' }}
              placeholder="Select Parent Department"
              value={editingDepartment.parentId}
              onChange={(value) => setEditingDepartment({ ...editingDepartment, parentId: value })}
            >
              <Select.Option value={0}>No Parent</Select.Option>
              {departments.map(dept => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Modal>

        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span role="img" aria-label="warning">⚠️</span>
              Are you sure you want to delete this department?
            </div>
          }
          open={isDeleteModalVisible}
          onCancel={handleDeleteCancel}
          footer={null}
          width={400}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button block onClick={handleDeleteCancel}>
              No
            </Button>
            <Button block type="primary" onClick={handleDeleteConfirm}>
              Yes
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DepartmentComponent;
