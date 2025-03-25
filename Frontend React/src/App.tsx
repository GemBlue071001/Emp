import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './componets/Home';
import Login from './componets/Login';
import AdminDashboard from './componets/Admin';
import Department from './componets/departments';
import UserList from './componets/UserList';
import UpdateUser from './components/UpdateUser';
import ViewUserProfile from './components/ViewUserProfile';
import User from './componets/users';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<UserList />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/users" element={<User />} />
          <Route path="/update-user" element={<UpdateUser />} />
          <Route path="/view-user" element={<ViewUserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
