import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, ShieldAlert, Trash2, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, Input, Select, Button } from '../components/UI';
import api from '../services/api';

interface User {
    id: string;
    username: string;
    role: string;
}

interface Task {
    id: string;
    title: string;
    status: string;
    user: {
        username: string;
    };
}

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('USER');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [usersRes, tasksRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/tasks')
            ]);
            setUsers(usersRes.data);
            setTasks(tasksRes.data);
        } catch (err: any) {
            console.error('Data fetch failed', err);
            // Even if it fails, we show the dashboard for dev purposes as requested (No JWT)
            // But if it's a real 403, we still report it.
            if (err.response?.status === 403) {
                setError('Administrative access restricted.');
            } else {
                setError('Service Unavailable. Please check backend connectivity.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/users', {
                username: newUsername,
                password: newPassword,
                role: newRole
            });
            setUsers([...users, response.data]);
            setNewUsername('');
            setNewPassword('');
            setShowAddUser(false);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error occurred while adding user');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err: any) {
            alert('Failed to delete user');
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!confirm('Delete this task?')) return;
        try {
            await api.delete(`/admin/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err: any) {
            alert('Failed to delete task');
        }
    };

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center bg-[#f6f7fb]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f6f7fb] pb-20">
            <header className="bg-white border-b border-gray-200 px-8 py-6 mb-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Console</h1>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Control Center & Oversight</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-8">
                {error && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-4 mb-8">
                        <ShieldAlert className="text-danger" size={24} />
                        <div>
                            <p className="text-sm font-bold text-danger">Security Notice</p>
                            <p className="text-xs text-rose-400 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="p-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Active Users</p>
                        <h2 className="text-3xl font-bold text-gray-800">{users.length}</h2>
                    </Card>
                    <Card className="p-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">System Wide Tasks</p>
                        <h2 className="text-3xl font-bold text-gray-800">{tasks.length}</h2>
                    </Card>
                    <Card className="p-6 bg-primary text-white border-none shadow-lg shadow-primary/20">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">System Status</p>
                        <h2 className="text-xl font-bold">Operational</h2>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="space-y-6">
                        <CardHeader
                            title="User Directory"
                            subtitle="Manage Access Levels"
                            icon={Users}
                            action={
                                <Button onClick={() => setShowAddUser(!showAddUser)} size="sm">
                                    {showAddUser ? 'Cancel' : 'New User'}
                                </Button>
                            }
                        />

                        {showAddUser && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <Card className="p-6 bg-gray-50 border-dashed border-2">
                                    <form onSubmit={handleAddUser} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                                            <Input label="Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                        </div>
                                        <Select label="Role" options={['USER', 'MANAGER', 'ADMIN']} value={newRole} onChange={e => setNewRole(e.target.value)} />
                                        <div className="flex justify-end gap-3 mt-4">
                                            <Button type="submit">Create Account</Button>
                                        </div>
                                    </form>
                                </Card>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            {users.map(u => (
                                <div key={u.id} className="bg-white p-4 rounded-lg border border-gray-100 flex items-center justify-between hover:border-primary/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-primary font-bold">
                                            {u.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{u.username}</p>
                                            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{u.role}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-gray-300 hover:text-danger opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <CardHeader title="Task Monitor" subtitle="Global Trace Log" icon={Briefcase} />
                        <div className="space-y-3">
                            {tasks.map(t => (
                                <div key={t.id} className="bg-white p-4 rounded-lg border border-gray-100 flex items-center justify-between group">
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{t.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded">
                                                {t.status}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                Owned by: {t.user?.username || 'System'}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteTask(t.id)} className="p-2 text-gray-300 hover:text-danger opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
