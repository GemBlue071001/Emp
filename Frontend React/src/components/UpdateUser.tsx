import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UpdateUser: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    userName: userData?.email || '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`https://localhost:7073/api/users/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold text-center mb-6">Cập Nhật Người Dùng</h2>
      <div className="mb-6">
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Thông Tin Người Dùng</h3>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="firstName" 
            placeholder="First Name" 
            className="border p-2 rounded" 
            value={formData.firstName}
            onChange={handleInputChange} 
          />
          <input 
            type="text" 
            name="lastName" 
            placeholder="Last Name" 
            className="border p-2 rounded" 
            value={formData.lastName}
            onChange={handleInputChange} 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            className="border p-2 rounded" 
            value={formData.email}
            onChange={handleInputChange}
            disabled
          />
          <input 
            type="text" 
            name="phone" 
            placeholder="Phone" 
            className="border p-2 rounded" 
            value={formData.phone}
            onChange={handleInputChange} 
          />
          <input 
            type="text" 
            name="userName" 
            placeholder="Username" 
            className="border p-2 rounded" 
            value={formData.userName}
            onChange={handleInputChange}
          />
          <input 
            type="password" 
            name="password" 
            placeholder="New Password (optional)" 
            className="border p-2 rounded" 
            value={formData.password}
            onChange={handleInputChange} 
          />
        
        </div>
        <button 
          onClick={handleUpdateUser} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Cập Nhật Người Dùng
        </button>
      </div>
    </div>
  );
};

export default UpdateUser; 