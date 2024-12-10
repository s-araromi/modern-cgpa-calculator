import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../config/supabase';

interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) throw error;

        setUsers(data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error(err);
      }
    };

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleUpdateRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      );
      
      setUsers(updatedUsers);
      setOpenRoleDialog(false);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Note: In a real app, you'd want to handle this server-side
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((userData) => (
              <tr key={userData.id}>
                <td className="px-6 py-4 whitespace-nowrap">{userData.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{userData.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => {
                      setSelectedUser(userData);
                      setOpenRoleDialog(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Change Role
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(userData.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openRoleDialog && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl mb-4">Change Role for {selectedUser.email}</h2>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleUpdateRole(selectedUser.id, 'user')}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Set as User
              </button>
              <button 
                onClick={() => handleUpdateRole(selectedUser.id, 'admin')}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Set as Admin
              </button>
              <button 
                onClick={() => setOpenRoleDialog(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
