import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Users, Shield, ShieldAlert, UserX, UserCheck, Trash2, Mail, Calendar } from 'lucide-react';

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
        <div className="container py-20 flex flex-col gap-12">
            <header className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <ShieldAlert size={32} className="text-black" />
                    <h1 className="text-4xl font-bold tracking-tight">Super Admin Panel</h1>
                </div>
                <p className="text-muted text-sm max-w-2xl">Full system control. Manage user roles, permissions, and account statuses. You can promote users to admin or ban accounts from the platform.</p>
            </header>

            <main className="flex flex-col gap-8">
                <div className="bg-surface p-4 rounded-lg border flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <Users size={18} />
                        <span className="text-sm font-semibold tracking-tight">Active Accounts ({users.length})</span>
                     </div>
                </div>

                <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface text-[10px] uppercase font-bold tracking-widest border-b">
                                <th className="p-6">User</th>
                                <th className="p-6 text-center">Role</th>
                                <th className="p-6 text-center">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b last:border-none hover:bg-surface/30 transition-colors">
                                    <td className="p-6">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-bold">{user.name}</span>
                                            <div className="flex items-center gap-2 text-xs text-muted">
                                                <Mail size={12} />
                                                <span>{user.email}</span>
                                            </div>
                                            <span className="text-[10px] font-mono mt-1 opacity-50">{user._id}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                         <div className="flex items-center justify-center gap-2">
                                            <select 
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="text-xs font-bold uppercase tracking-wider py-1.5 px-3 bg-surface border-none w-fit cursor-pointer outline-none focus:ring-1 focus:ring-black"
                                            >
                                                <option value="user">USER</option>
                                                <option value="admin">ADMIN</option>
                                                <option value="super_admin">SUPER ADMIN</option>
                                            </select>
                                         </div>
                                    </td>
                                    <td className="p-6 text-center">
                                         {user.isActive ? (
                                             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                  <UserCheck size={12} /> Active
                                             </span>
                                         ) : (
                                             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                  <UserX size={12} /> Banned
                                             </span>
                                         )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-6 text-muted">
                                            {user.role !== 'super_admin' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleStatusChange(user._id, !user.isActive)}
                                                        className={`hover:text-black transition-colors ${!user.isActive ? 'text-success hover:text-success' : 'hover:text-error'}`}
                                                        title={user.isActive ? "Ban User" : "Unban User"}
                                                    >
                                                       {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="hover:text-error transition-colors"
                                                        title="Delete Account"
                                                    >
                                                        <Trash2 size={18} />
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
