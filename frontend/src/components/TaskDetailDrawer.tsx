import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Calendar, Clock, CheckCircle2, PlayCircle, XCircle, MessageSquare, Save } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface TaskDetailDrawerProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: any; color: string; bg: string; border: string }> = {
    TODO: { label: 'Yapılacak', icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' },
    IN_PROGRESS: { label: 'Çalışılıyor', icon: PlayCircle, color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' },
    DONE: { label: 'Tamamlandı', icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
    CANCELLED: { label: 'İptal Edildi', icon: XCircle, color: 'text-rose-700', bg: 'bg-rose-100', border: 'border-rose-200' },
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
        return new Date(dateStr).toISOString().split('T')[0];
    } catch {
        return dateStr;
    }
};

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ task, isOpen, onClose }) => {
    const { updateTaskStatus, updateTaskProgress, deleteTask, updateTask } = useTaskStore();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [progress, setProgress] = useState(task.progress || 0);
    const [endDate, setEndDate] = useState(formatDate(task.endDate));
    const [startDate, setStartDate] = useState(formatDate(task.startDate));
    const [hasChanges, setHasChanges] = useState(false);

    if (!isOpen) return null;

    const config = STATUS_CONFIG[task.status];
    const StatusIcon = config.icon;
    const progressColor = progress < 30 ? '#e2445c' : progress < 70 ? '#fdab3d' : '#00c875';

    const handleDelete = () => {
        if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
            deleteTask(task.id);
            onClose();
        }
    };

    const markChanged = () => setHasChanges(true);

    const handleSave = async () => {
        if (title !== task.title || description !== (task.description || '')) {
            await updateTask(task.id, { title, description });
        }
        if (progress !== (task.progress || 0)) {
            await updateTaskProgress(task.id, progress);
        }
        setHasChanges(false);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl bg-white max-h-[85vh] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] rounded-2xl border border-gray-100 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.border} ${config.bg} ${config.color} text-xs font-bold transition-all hover:brightness-105`}>
                                    <StatusIcon size={14} />
                                    <span>{config.label}</span>
                                </button>
                            </div>
                            <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                            <div className="flex gap-1">
                                {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map(s => {
                                    if (s === task.status) return null;
                                    const c = STATUS_CONFIG[s];
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => updateTaskStatus(task.id, s)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                                            title={c.label}
                                        >
                                            <c.icon size={16} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={handleDelete} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all" title="Sil">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Title - Editable */}
                    <input
                        type="text"
                        value={title}
                        onChange={e => { setTitle(e.target.value); markChanged(); }}
                        className="w-full text-2xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-300"
                        placeholder="Görev başlığı..."
                    />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Info Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Başlangıç</label>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => { setStartDate(e.target.value); markChanged(); }}
                                    className="text-sm text-gray-700 font-medium bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 w-full outline-none focus:border-primary/30"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Bitiş</label>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={e => { setEndDate(e.target.value); markChanged(); }}
                                    className="text-sm text-gray-700 font-medium bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 w-full outline-none focus:border-primary/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">İlerleme</span>
                            <span className="text-lg font-bold text-gray-800">{progress}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full rounded-full"
                                style={{ background: progressColor }}
                            />
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={progress}
                            onChange={e => { setProgress(Number(e.target.value)); markChanged(); }}
                            className="w-full accent-primary h-1.5"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare size={14} className="text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Açıklama</span>
                        </div>
                        <textarea
                            value={description}
                            onChange={e => { setDescription(e.target.value); markChanged(); }}
                            placeholder="Görev açıklaması ekleyin..."
                            rows={4}
                            className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-primary/30 resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Footer */}
                {hasChanges && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border-t border-gray-100 bg-gray-50/50"
                    >
                        <button
                            onClick={handleSave}
                            className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:brightness-105 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={16} />
                            Değişiklikleri Kaydet
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};
