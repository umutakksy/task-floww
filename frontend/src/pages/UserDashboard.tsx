import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Clock, Trash2, CheckSquare, Folder as FolderIcon, Layout as LayoutIcon, Zap } from 'lucide-react';

import api from '../services/api';

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    createdAt: string;
    folderId?: number;
}

interface Folder {
    id: number;
    name: string;
    tasks: Task[];
    children: Folder[];
    parent?: Folder;
}

const UserDashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSettingUp, setIsSettingUp] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [tasksRes, foldersRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/folders')
            ]);
            setTasks(tasksRes.data);
            setFolders(foldersRes.data);
        } catch (err) {
            console.error('Veriler getirilemedi', err);
        } finally {
            setIsLoading(false);
        }
    };

    const setupAgile = async () => {
        setIsSettingUp(true);
        try {
            await api.post('/folders/setup-agile');
            await fetchData();
        } catch (err) {
            console.error('Agile şablonu oluşturulamadı', err);
        } finally {
            setIsSettingUp(false);
        }
    };

    const addTask = async (e: React.FormEvent, folderId?: number) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await api.post('/tasks', {
                title: newTitle,
                description: newDesc,
                status: 'TODO',
                folder: folderId ? { id: folderId } : null
            });
            await fetchData();
            setNewTitle('');
            setNewDesc('');
        } catch (err) {
            console.error('Görev eklenemedi', err);
        }
    };

    const updateStatus = async (id: number, currentStatus: string) => {
        const statusMap: Record<string, 'TODO' | 'IN_PROGRESS' | 'DONE'> = {
            'TODO': 'IN_PROGRESS',
            'IN_PROGRESS': 'DONE',
            'DONE': 'TODO'
        };

        const newStatus = statusMap[currentStatus];

        try {
            await api.put(`/tasks/${id}`, { status: newStatus });
            setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
            // Also update in folders if we use folder structure for rendering
            fetchData();
        } catch (err) {
            console.error('Durum güncellenemedi', err);
        }
    };

    const deleteTask = async (id: number) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchData();
        } catch (err) {
            console.error('Görev silinemedi', err);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DONE': return <CheckCircle2 size={20} color="var(--success)" />;
            case 'IN_PROGRESS': return <Clock size={20} color="var(--warning)" />;
            default: return <Circle size={20} color="var(--text-muted)" />;
        }
    };

    const renderTask = (task: Task) => (
        <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            className="task-card"
            style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '0.75rem', padding: '1rem' }}
        >
            <button
                onClick={() => updateStatus(task.id, task.status)}
                style={{ background: 'transparent', border: 'none', marginTop: '4px' }}
            >
                {getStatusIcon(task.status)}
            </button>

            <div style={{ flex: 1 }}>
                <h4 style={{
                    fontSize: '1rem',
                    marginBottom: '0.25rem',
                    textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
                    opacity: task.status === 'DONE' ? 0.5 : 1
                }}>
                    {task.title}
                </h4>
                {task.description && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{task.description}</p>
                )}
            </div>

            <button
                onClick={() => deleteTask(task.id)}
                style={{
                    background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.4)',
                    padding: '4px', borderRadius: '4px'
                }}
            >
                <Trash2 size={16} />
            </button>
        </motion.div>
    );

    const renderFolder = (folder: Folder, depth = 0) => (
        <div key={folder.id} style={{ marginBottom: '1.5rem', marginLeft: depth * 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FolderIcon size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.125rem' }}>{folder.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>
                    {folder.tasks.length} Görev
                </span>
            </div>

            <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid var(--glass-border)' }}>
                {folder.tasks.map(task => renderTask(task))}
                {folder.children && folder.children.map(child => renderFolder(child, depth + 1))}
            </div>
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Görevlerim</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Klasör yapısı ile işlerini organize et.</p>
                </div>
                <button
                    onClick={setupAgile}
                    disabled={isSettingUp}
                    className="btn-primary"
                    style={{ background: 'var(--accent)', color: 'var(--bg-dark)' }}
                >
                    <Zap size={18} /> {isSettingUp ? 'Hazırlanıyor...' : 'Hızlı Agile Şablonu'}
                </button>
            </div>

            {/* Quick Add Form */}
            <div className="task-card" style={{ marginBottom: '3rem', border: '1px dashed var(--primary)' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} color="var(--primary)" /> Yeni Bağımsız Görev Ekle
                </h3>
                <form onSubmit={(e) => addTask(e)} style={{ display: 'grid', gap: '1rem' }}>
                    <input
                        className="glass-input"
                        placeholder="Görev başlığı..."
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        required
                    />
                    <textarea
                        className="glass-input"
                        placeholder="Detaylı açıklama (isteğe bağlı)..."
                        style={{ minHeight: '60px', resize: 'vertical' }}
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn-primary">
                            <Plus size={18} /> Ekle
                        </button>
                    </div>
                </form>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {isLoading ? (
                    <p>Yükleniyor...</p>
                ) : (
                    <>
                        {/* Render Root Folders first */}
                        {folders.filter(f => !f.parent).map(folder => renderFolder(folder))}

                        {/* Render unassigned tasks */}
                        {tasks.filter(t => !folders.some(f => f.tasks.some(ft => ft.id === t.id)) && !folders.some(f => f.children.some(c => c.tasks.some(ct => ct.id === t.id)))).length > 0 && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    <LayoutIcon size={18} color="var(--text-muted)" />
                                    <h3 style={{ fontSize: '1.125rem' }}>Genel Görevler</h3>
                                </div>
                                <AnimatePresence mode="popLayout">
                                    {tasks.filter(t => !folders.some(f => f.tasks.some(ft => ft.id === t.id))).map(task => renderTask(task))}
                                </AnimatePresence>
                            </div>
                        )}

                        {folders.length === 0 && tasks.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                <CheckSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>Henüz bir görevin yok. "Hızlı Agile Şablonu" butonuna basarak başlayabilirsin!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;

