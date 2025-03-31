import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface ApiResponse {
  code: number;
  message: string;
  result: {
    departmentId: number;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<ApiResponse['result']>>({});
  const [error, setError] = useState<string | null>(null);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      phone: userData?.phone || '',
      name: userData?.name || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
    setError(null);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      if (!userData) {
        setError('User data not available');
        return;
      }

      const response = await fetch('https://localhost:7073/api/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
        body: JSON.stringify({
          firstName: editedData.firstName,
          lastName: editedData.lastName,
          email: userData.email,
          phone: editedData.phone,
          userName: editedData.name,
          departmentId: userData.departmentId
        }),
      });

      const data = await response.json();

      if (data.code === 200) {
        setUserData(prev => prev ? { ...prev, ...editedData } : null);
        setIsEditing(false);
        setEditedData({});
        setError(null);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating the profile');
      console.error('Error updating profile:', error);
    }
  };

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
          padding: '32px',
          width: '1000px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'normal',
              color: '#202124'
            }}>
              Basic info
            </h1>

          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1a73e8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Edit
            </button>
          )}
          {/* <p style={{
            color: '#5f6368',
            marginBottom: '32px'
          }}>
            Some info may be visible to other people using this application.
          </p> */}

          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)'
          }}>
            {/* Full Name Section */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #dadce0'
            }}>
              <div style={{ color: '#5f6368', marginBottom: '4px' }}>Full Name</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                    <input
                      type="text"
                      value={editedData.firstName || ''}
                      onChange={(e) => setEditedData(prev => ({ ...prev, firstName: e.target.value }))}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editedData.lastName || ''}
                      onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <div style={{ color: '#202124' }}>{`${userData.firstName} ${userData.lastName}`}</div>
                )}
              </div>
            </div>

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
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name || ''}
                    onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #dadce0',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Username"
                  />
                ) : (
                  <div style={{ color: '#202124' }}>{userData.name}</div>
                )}
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
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.phone || ''}
                    onChange={(e) => setEditedData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #dadce0',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Phone Number"
                  />
                ) : (
                  <div style={{ color: '#202124' }}>{userData.phone}</div>
                )}
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

            {/* Edit Actions */}
            {isEditing && (
              <div style={{
                padding: '24px',
                borderTop: '1px solid #dadce0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#fff',
                    color: '#5f6368',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1a73e8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Save
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '16px',
                backgroundColor: '#fce8e6',
                color: '#c5221f',
                borderTop: '1px solid #dadce0'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserProfile;