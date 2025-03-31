import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './componets/Home';
import Login from './componets/Login';
import AdminDashboard from './componets/Admin';
import DepartmentComponent from './componets/departments';
import UserList from './componets/UserList';
import UpdateUser from './components/UpdateUser';
import ViewUserProfile from './components/ViewUserProfile';
import User from './componets/users';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/user-list" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/view-user" element={<ProtectedRoute><ViewUserProfile /></ProtectedRoute>} />
          <Route path="/update-user" element={<ProtectedRoute><UpdateUser /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute requiredRole="ADMIN"><DepartmentComponent /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
