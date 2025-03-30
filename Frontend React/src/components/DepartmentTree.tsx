import React, { useState } from 'react';
import { CarryOutOutlined } from '@ant-design/icons';
import { Switch, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';

interface Department {
  id: number;
  name: string;
  parentId: number;
}

interface DepartmentTreeProps {
  departments: Department[];
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

  return buildTree(0); // Start with root level (parentId = 0)
};

const DepartmentTree: React.FC<DepartmentTreeProps> = ({ departments }) => {
  const [showLine, setShowLine] = useState<boolean>(true);
  const [showIcon, setShowIcon] = useState<boolean>(true);

  const treeData = transformToTreeData(departments);

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>Show Lines:</span>
        <Switch checked={showLine} onChange={setShowLine} />
        <span style={{ marginLeft: 16, marginRight: 8 }}>Show Icons:</span>
        <Switch checked={showIcon} onChange={setShowIcon} />
      </div>
      <Tree
        showLine={showLine}
        showIcon={showIcon}
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
      />
    </div>
  );
};

export default DepartmentTree; 