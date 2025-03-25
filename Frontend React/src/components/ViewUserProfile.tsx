import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface ApiResponse {
  code: number;
  message: string;
  result: {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    userType: string | null;
    subDepartment: string | null;
    departmentName: string | null;
  };
}

const ViewUserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<ApiResponse['result'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://localhost:7073/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data: ApiResponse = await response.json();
        if (data.code === 200) {
          setUserData(data.result);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        No profile data available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{
        marginLeft: '180px',
        flex: 1,
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'normal',
            marginBottom: '8px',
            color: '#202124'
          }}>
            Basic info
          </h1>
          <p style={{
            color: '#5f6368',
            marginBottom: '32px'
          }}>
            Some info may be visible to other people using this application.
          </p>

          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)'
          }}>
            {/* Username Section */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #dadce0'
            }}>
              <div style={{ color: '#5f6368', marginBottom: '4px' }}>Username</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ color: '#202124' }}>{userData.name}</div>
              </div>
            </div>

            {/* Phone Section */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #dadce0'
            }}>
              <div style={{ color: '#5f6368', marginBottom: '4px' }}>Phone</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ color: '#202124' }}>{userData.phone}</div>
              </div>
            </div>

            {/* Email Section */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #dadce0'
            }}>
              <div style={{ color: '#5f6368', marginBottom: '4px' }}>Email</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ color: '#202124' }}>{userData.email}</div>
              </div>
            </div>

            {/* Department Section */}
            <div style={{
              padding: '24px'
            }}>
              <div style={{ color: '#5f6368', marginBottom: '4px' }}>Department</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ color: '#202124' }}>{userData.departmentName || 'Not Assigned'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserProfile; 