import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Users, ShieldAlert, UserX, UserCheck, Trash2, Mail } from 'lucide-react';

const SuperAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users');
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (id, role) => {
        try {
            await api.put(`/users/${id}/role`, { role });
            setUsers(users.map(u => u._id === id ? { ...u, role } : u));
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating role');
        }
    };

    const handleStatusChange = async (id, isActive) => {
        try {
            await api.put(`/users/${id}/status`, { isActive });
            setUsers(users.map(u => u._id === id ? { ...u, isActive } : u));
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating status');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Permanently delete this user? This cannot be undone.')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting user');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '5rem 2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <header style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ShieldAlert size={36} style={{ color: 'var(--fg)' }} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Super Admin Panel</h1>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', maxWidth: '42rem' }}>
                    Full system control. Manage user roles, permissions, and account statuses. You can promote users to admin or ban accounts from the platform.
                </p>
            </header>

            <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ backgroundColor: 'var(--surface)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Users size={20} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Active Accounts ({users.length})</span>
                     </div>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--surface)', fontSize: '0.625rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1.5rem' }}>User</th>
                                <th style={{ padding: '1.5rem', textAlign: 'center' }}>Role</th>
                                <th style={{ padding: '1.5rem', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '1.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user.name}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                                                <Mail size={14} />
                                                <span>{user.email}</span>
                                            </div>
                                            <span style={{ fontSize: '0.625rem', fontFamily: 'monospace', color: 'var(--muted)', marginTop: '0.25rem' }}>{user._id}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <select 
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.375rem 0.75rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', outline: 'none' }}
                                            >
                                                <option value="user">USER</option>
                                                <option value="admin">ADMIN</option>
                                                <option value="super_admin">SUPER ADMIN</option>
                                            </select>
                                         </div>
                                    </td>
                                    <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                                         {user.isActive ? (
                                             <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                                  <UserCheck size={14} /> Active
                                             </span>
                                         ) : (
                                             <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'rgba(225, 29, 72, 0.1)', color: 'var(--error)' }}>
                                                  <UserX size={14} /> Banned
                                             </span>
                                         )}
                                    </td>
                                    <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', color: 'var(--muted)' }}>
                                            {user.role !== 'super_admin' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleStatusChange(user._id, !user.isActive)}
                                                        title={user.isActive ? "Ban User" : "Unban User"}
                                                        style={{ color: user.isActive ? 'var(--muted)' : 'var(--success)', cursor: 'pointer' }}
                                                    >
                                                       {user.isActive ? <UserX size={20} /> : <UserCheck size={20} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        title="Delete Account"
                                                        style={{ color: 'var(--muted)', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default SuperAdmin;
