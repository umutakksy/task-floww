import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Task, TaskStatus, Priority } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import {
    Plus, Search, ChevronDown, Trash2,
    User, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { TaskDetailDrawer } from './TaskDetailDrawer';
import { CreateTaskModal } from './CreateTaskModal';

/* ─── Status Config ───────────────────────────────────────────── */
const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string; icon: any }> = {
    TODO: { label: 'Yapılacak', bg: '#c4c4c4', text: '#fff', icon: Clock },
    IN_PROGRESS: { label: 'Yapılmakta', bg: '#fdab3d', text: '#fff', icon: AlertCircle },
    DONE: { label: 'Tamamlandı', bg: '#00c875', text: '#fff', icon: CheckCircle2 },
    CANCELLED: { label: 'İptal Edildi', bg: '#e2445c', text: '#fff', icon: AlertCircle },
};

/* ─── Priority Config ─────────────────────────────────────────── */
const PRIORITY_CONFIG: Record<Priority, { label: string; bg: string; text: string }> = {
    URGENT: { label: 'ACİL', bg: '#e2445c', text: '#fff' },
    HIGH: { label: 'Yüksek', bg: '#401694', text: '#fff' },
    MEDIUM: { label: 'Orta', bg: '#579bfc', text: '#fff' },
    LOW: { label: 'Düşük', bg: '#00c875', text: '#fff' },
};

const Avatar: React.FC<{ id?: string; size?: number }> = ({ id, size = 24 }) => (
    <div
        style={{ width: size, height: size }}
        className="rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0"
    >
        {id ? (
            <div
                className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: `hsl(${id.charCodeAt(0) * 10 % 360}, 60%, 50%)` }}
            >
                {id[0]?.toUpperCase()}
            </div>
        ) : (
            <User size={size * 0.6} className="text-gray-300" />
        )}
    </div>
);

const StatusBadge: React.FC<{ status: TaskStatus; onChange: (s: TaskStatus) => void }> = ({ status, onChange }) => {
    const [open, setOpen] = useState(false);
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;

    return (
        <div className="relative w-full h-full">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className="w-full h-full flex items-center justify-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-90 px-2"
                style={{ background: cfg.bg, color: cfg.text }}
            >
                <span>{cfg.label}</span>
                <Icon size={14} className="opacity-80" />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-[500] overflow-hidden min-w-[160px]">
                    {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((s) => (
                        <button
                            key={s}
                            onClick={(e) => { e.stopPropagation(); onChange(s); setOpen(false); }}
                            className="w-full px-4 py-2.5 text-left text-[13px] font-medium hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                        >
                            <div className="w-3 h-3 rounded-full" style={{ background: STATUS_CONFIG[s].bg }} />
                            {STATUS_CONFIG[s].label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const AssigneeSelector: React.FC<{ assigneeIds: string[]; onToggle: (userId: string) => void }> = ({ assigneeIds, onToggle }) => {
    const [open, setOpen] = useState(false);
    const { users } = useTaskStore();

    return (
        <div className="relative group/assignee">
            <div
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 px-2 rounded-lg transition-all"
            >
                <div className="flex items-center">
                    {assigneeIds.length > 0 ? (
                        <div className="flex -space-x-1.5">
                            {assigneeIds.slice(0, 3).map(id => {
                                const user = users.find(u => u.id === id);
                                return <Avatar key={id} id={user?.username || id} size={24} />;
                            })}
                            {assigneeIds.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[8px] font-bold text-gray-500">
                                    +{assigneeIds.length - 3}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-300 hover:border-primary hover:text-primary">
                            <User size={12} />
                        </div>
                    )}
                </div>
                {assigneeIds.length > 0 && (
                    <span className="text-[12px] font-medium text-gray-600 truncate max-w-[80px]">
                        {users.find(u => u.id === assigneeIds[0])?.username || 'Bilinmiyor'}
                    </span>
                )}
            </div>

            {open && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[510] min-w-[200px] p-2">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 pb-2 border-b border-gray-50 mb-2">Sorumlu Ata</div>
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        {users.map(u => (
                            <div
                                key={u.id}
                                onClick={(e) => { e.stopPropagation(); onToggle(u.id); }}
                                className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            >
                                <Avatar id={u.username} size={24} />
                                <span className="text-[12px] font-semibold text-gray-700 flex-1">{u.username}</span>
                                {assigneeIds.includes(u.id) && <div className="w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-primary/20" />}
                            </div>
                        ))}
                    </div>
                    {users.length === 0 && <div className="p-4 text-center text-[10px] text-gray-400">Kullanıcı bulunamadı</div>}
                </div>
            )}
        </div>
    );
};

const PriorityBadge: React.FC<{ priority: Priority; onChange: (p: Priority) => void }> = ({ priority, onChange }) => {
    const [open, setOpen] = useState(false);
    const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;

    return (
        <div className="relative w-full h-full">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className="w-full h-full flex items-center justify-center text-[13px] font-medium transition-opacity hover:opacity-90 px-2"
                style={{ background: cfg.bg, color: cfg.text }}
            >
                {cfg.label}
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-[500] overflow-hidden min-w-[140px]">
                    {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                        <button
                            key={p}
                            onClick={(e) => { e.stopPropagation(); onChange(p); setOpen(false); }}
                            className="w-full px-4 py-2.5 text-left text-[13px] font-medium hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                        >
                            <div className="w-3 h-3 rounded-full" style={{ background: PRIORITY_CONFIG[p].bg }} />
                            {PRIORITY_CONFIG[p].label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const fmtShort = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } catch { return dateStr; }
};

const TimelineBar: React.FC<{ start?: string; end?: string; color?: string }> = ({ start, end, color = '#579bfc' }) => {
    if (!start && !end) return <div className="h-6 w-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-[10px] text-gray-400 font-bold">—</div>;
    const label = [fmtShort(start), fmtShort(end)].filter(Boolean).join(' - ');
    return (
        <div
            className="h-6 rounded-full mx-2 flex items-center justify-center text-[11px] text-white font-medium"
            style={{ background: color }}
        >
            <span className="truncate px-2">{label}</span>
        </div>
    );
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } catch {
        return dateStr;
    }
};

const TaskRow: React.FC<{
    task: Task;
    onStatusChange: (s: TaskStatus) => void;
    onPriorityChange: (p: Priority) => void;
    onAssigneeToggle: (userId: string) => void;
    onDelete: () => void;
    onClick: () => void;
}> = ({ task, onStatusChange, onPriorityChange, onAssigneeToggle, onDelete, onClick }) => {
    const { users } = useTaskStore();
    const creator = users.find(u => u.id === task.creatorId);

    return (
        <tr
            onClick={onClick}
            className="group/row border-b border-gray-100 hover:bg-[#f8f9fb] transition-colors cursor-pointer"
        >
            <td className="w-10 px-4">
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                />
            </td>

            {/* Görev Başlığı */}
            <td className="px-2 py-3 min-w-[300px]">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_CONFIG[task.status].bg }} />
                    <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-gray-700 group-hover/row:text-primary transition-colors">
                            {task.title}
                        </span>
                        {task.description && (
                            <span className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                                {task.description}
                            </span>
                        )}
                    </div>
                </div>
            </td>

            {/* Sorumlu (Assignee) */}
            <td className="w-44 px-2" onClick={(e) => e.stopPropagation()}>
                <AssigneeSelector assigneeIds={task.assigneeIds} onToggle={onAssigneeToggle} />
            </td>

            {/* Oluşturan (Creator) */}
            <td className="w-32 px-2">
                <div className="flex items-center gap-2 justify-center">
                    <Avatar id={creator?.username || task.creatorId} size={20} />
                    <span className="text-[12px] font-medium text-gray-600 truncate max-w-[80px]">
                        {creator?.username || 'Sistem'}
                    </span>
                </div>
            </td>

            {/* Status (Durum) */}
            <td className="w-36 p-0 border-l border-white" onClick={(e) => e.stopPropagation()}>
                <StatusBadge status={task.status} onChange={onStatusChange} />
            </td>

            {/* Son Tarih */}
            <td className="w-32 border-l border-white text-center">
                <span className="text-gray-600 font-normal">{formatDate(task.endDate)}</span>
            </td>

            {/* Öncelik */}
            <td className="w-32 p-0 border-l border-white" onClick={(e) => e.stopPropagation()}>
                <PriorityBadge priority={task.priority} onChange={onPriorityChange} />
            </td>

            {/* Zaman Čizelgesi */}
            <td className="w-40 border-l border-white py-1">
                <TimelineBar start={task.startDate} end={task.endDate} color={STATUS_CONFIG[task.status].bg} />
            </td>

            {/* Son Güncelleme */}
            <td className="w-44 border-l border-white px-3 text-center">
                <span className="text-[11px] text-gray-400 font-medium">
                    {task.updatedAt ? new Date(task.updatedAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                </span>
            </td>

            {/* Actions */}
            <td className="w-10 border-l border-white pr-2">
                <div className="flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1 text-gray-300 hover:text-red-500"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export const TaskPanel: React.FC<{ folderId: string; folderName?: string }> = ({ folderId, folderName }) => {
    const { tasks, updateTaskStatus, updateTaskPriority, toggleAssignee, createTask, deleteTask } = useTaskStore();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [defaultModalStatus, setDefaultModalStatus] = useState<TaskStatus>('TODO');

    const filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description ?? '').toLowerCase().includes(search.toLowerCase())
    );

    const handleCreateTask = async (data: {
        title: string;
        description: string;
        status: TaskStatus;
        startDate: string;
        endDate: string;
        progress: number;
    }) => {
        await createTask({
            title: data.title,
            description: data.description,
            status: data.status,
            folderId,
            startDate: data.startDate || undefined,
            endDate: data.endDate || undefined,
            progress: data.progress,
        });
        setShowModal(false);
    };

    const handleDelete = async (taskId: string) => {
        if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
            await deleteTask(taskId);
        }
    };

    const openModalForStatus = (status: TaskStatus) => {
        setDefaultModalStatus(status);
        setShowModal(true);
    };

    const groups = (Object.keys(STATUS_CONFIG) as TaskStatus[]).map(s => ({
        status: s,
        label: s === 'DONE' ? 'Bitti' : s === 'TODO' ? 'Yapılacaklar' : STATUS_CONFIG[s].label,
        tasks: filtered.filter(t => t.status === s),
        color: s === 'DONE' ? '#00c875' : s === 'TODO' ? '#579bfc' : STATUS_CONFIG[s].bg,
    })).filter(g => g.tasks.length > 0 || search === '');

    return (
        <div className="flex flex-col h-full bg-white select-none font-sans">
            {/* Monday Style Toolbar */}
            <div className="px-6 pt-4 pb-2 border-b border-gray-100/50">
                <h2 className="text-[22px] font-bold text-gray-800 mb-4 tracking-tight">{folderName || 'Genel Pano'}</h2>
                <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <button
                                onClick={() => openModalForStatus('TODO')}
                                className="bg-[#0073ea] hover:bg-[#0060c4] text-white px-3 py-1.5 rounded-[4px] text-[13px] font-medium flex items-center gap-1 transition-colors shadow-sm"
                            >
                                Yeni görev
                                <ChevronDown size={14} className="border-l border-white/20 ml-1 pl-1" />
                            </button>
                        </div>

                        <div className="h-4 w-[1px] bg-gray-200 mx-1" />

                        <div className="flex items-center gap-5 text-gray-500">
                            <div className="flex items-center gap-1.5 bg-gray-50/80 p-1 px-2 rounded-md transition-shadow focus-within:bg-white focus-within:ring-1 focus-within:ring-primary/20">
                                <Search size={16} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Aramal..."
                                    className="bg-transparent border-none outline-none text-[13px] w-24"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                <ChevronDown size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Board Content */}
            <div className="flex-1 overflow-auto bg-white custom-scrollbar">
                <div className="min-w-[1000px] p-6 pt-8">
                    {groups.map((group) => (
                        <div key={group.status} className="mb-12 group/section">
                            {/* Group Header */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-0.5 rounded hover:bg-gray-100 cursor-pointer">
                                    <ChevronDown size={20} className="text-gray-400" style={{ color: group.color }} />
                                </div>
                                <h3 className="text-[18px] font-bold" style={{ color: group.color }}>
                                    {group.label}
                                </h3>
                                <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                                <span className="text-sm text-gray-400 font-medium">{group.tasks.length} Görev</span>
                            </div>

                            {/* Table */}
                            <div className="rounded-sm bg-white border-l-4" style={{ borderColor: group.color }}>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-y border-[#e6e9ef] text-[13px] font-normal text-gray-500 h-9 bg-gray-50/20">
                                            <th className="w-10 pl-2">
                                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                            </th>
                                            <th className="px-3 text-left font-normal border-l border-gray-100">Görev</th>
                                            <th className="w-32 text-center font-normal border-l border-gray-100">Sorumlu</th>
                                            <th className="w-32 text-center font-normal border-l border-gray-100">Oluşturan</th>
                                            <th className="w-36 text-center font-normal border-l border-gray-100">Durum</th>
                                            <th className="w-32 text-center font-normal border-l border-gray-100">Son tarih</th>
                                            <th className="w-32 text-center font-normal border-l border-gray-100">Öncelik</th>
                                            <th className="w-40 text-center font-normal border-l border-gray-100">Zaman Çizel...</th>
                                            <th className="w-44 text-left px-3 font-normal border-l border-gray-100">Son Güncelleme</th>
                                            <th className="w-10 text-center border-l border-gray-100">+</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.tasks.map((task) => (
                                            <TaskRow
                                                key={task.id}
                                                task={task}
                                                onClick={() => setSelectedTask(task)}
                                                onStatusChange={(s) => updateTaskStatus(task.id, s)}
                                                onPriorityChange={(p) => updateTaskPriority(task.id, p)}
                                                onAssigneeToggle={(uid) => toggleAssignee(task.id, uid)}
                                                onDelete={() => handleDelete(task.id)}
                                            />
                                        ))}
                                        {/* + Ekle Row */}
                                        <tr className="h-9 border-b border-[#e6e9ef] hover:bg-gray-50/50 cursor-pointer group/add">
                                            <td className="w-10 pl-2 pr-0"></td>
                                            <td colSpan={9} className="px-3" onClick={() => openModalForStatus(group.status)}>
                                                <div className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-[13px]">
                                                    <Plus size={14} />
                                                    <span>+ görev ekle</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <Search size={48} className="text-gray-200 mb-4" />
                            <p className="text-lg font-bold text-gray-400">Aradığınız kriterde öğe bulunamadı</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Detail Drawer */}
            <AnimatePresence mode="wait">
                {selectedTask && (
                    <TaskDetailDrawer
                        task={selectedTask}
                        isOpen={!!selectedTask}
                        onClose={() => setSelectedTask(null)}
                    />
                )}
            </AnimatePresence>

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleCreateTask}
                defaultStatus={defaultModalStatus}
            />
        </div>
    );
};
