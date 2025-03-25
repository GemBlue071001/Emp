import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'USER',
    userName: '',
    departmentId: 1
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`https://localhost:7073/api/users?page=${page}&size=15&searchQuery=${searchQuery}`, {
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
        setTotalPages(data.result.totalPages);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('https://localhost:7073/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      alert(data.message);
      setUsers([...users, data.result]);
      navigate('/admin');
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return <p className="text-center py-4">Loading...</p>;
  }

  if (error) {
    return <p className="text-center py-4 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold text-center mb-6">Quản Lý Nhân Viên</h2>
      <div className="mb-6">
        
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Tạo Người Dùng Mới</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="firstName" placeholder="First Name" className="border p-2 rounded" onChange={handleInputChange} />
          <input type="text" name="lastName" placeholder="Last Name" className="border p-2 rounded" onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email" className="border p-2 rounded" onChange={handleInputChange} />
          <input type="text" name="phone" placeholder="Phone" className="border p-2 rounded" onChange={handleInputChange} />
          <input type="text" name="userName" placeholder="Username" className="border p-2 rounded" onChange={handleInputChange} />
          <input type="text" name="password" placeholder="Password" className="border p-2 rounded" onChange={handleInputChange} />
          
        </div>
        <button onClick={handleCreateUser} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Tạo Người Dùng</button>
      </div>
    </div>
  );
};

export default User;
