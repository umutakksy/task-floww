import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { TaskStatus } from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description: string;
        status: TaskStatus;
        startDate: string;
        endDate: string;
        progress: number;
        assigneeIds: string[];
    }) => void;
    defaultStatus?: TaskStatus;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'TODO', label: 'Yapılacak', color: '#ff3d57' },
    { value: 'IN_PROGRESS', label: 'Çalışılıyor', color: '#ffcb00' },
    { value: 'DONE', label: 'Tamamlandı', color: '#00c875' },
    { value: 'CANCELLED', label: 'İptal', color: '#e2445c' },
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    defaultStatus = 'TODO',
}) => {
    const { users } = useTaskStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(defaultStatus);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [progress, setProgress] = useState(0);
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleAssignee = (userId: string) => {
        setSelectedAssignees(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({
            title: title.trim(),
            description: description.trim(),
            status,
            startDate,
            endDate,
            progress,
            assigneeIds: selectedAssignees
        });
        // Reset
        setTitle('');
        setDescription('');
        setStatus('TODO');
        setStartDate('');
        setEndDate('');
        setProgress(0);
        setSelectedAssignees([]);
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 mx-4 overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-primary" />
                        <h2 className="text-base font-bold text-gray-800">Yeni Görev Oluştur</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Görev Adı *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Görev adını girin..."
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:bg-white transition-colors"
                            autoFocus
                            required
                        />
                    </div>

                    {/* Assignees */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Sorumlu Seç</label>
                        <div className="flex flex-wrap gap-2 py-2">
                            {users.map(u => (
                                <button
                                    key={u.id}
                                    type="button"
                                    onClick={() => toggleAssignee(u.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${selectedAssignees.includes(u.id)
                                        ? 'bg-primary border-primary text-white shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${selectedAssignees.includes(u.id) ? 'bg-white/20' : 'bg-gray-100'}`}>
                                        {u.username[0].toUpperCase()}
                                    </div>
                                    {u.username}
                                </button>
                            ))}
                            {users.length === 0 && <span className="text-[10px] text-gray-400 italic">Kullanıcı bulunamadı</span>}
                        </div>
                    </div>

                    {/* Progress */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">
                            İlerleme: <span className="text-primary">{progress}%</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                value={progress}
                                onChange={(e) => setProgress(Number(e.target.value))}
                                className="flex-1 accent-primary h-2"
                            />
                            <span className="text-sm font-bold text-gray-600 w-10 text-right">{progress}%</span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${progress}%`,
                                    background: progress < 30 ? '#ff3d57' : progress < 70 ? '#ffcb00' : '#00c875',
                                }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Açıklama</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Görev açıklaması (isteğe bağlı)..."
                            rows={3}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:bg-white transition-colors resize-none"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Durum / Aşama</label>
                        <div className="flex gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setStatus(opt.value)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${status === opt.value
                                        ? 'text-white shadow-sm'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }`}
                                    style={
                                        status === opt.value
                                            ? { backgroundColor: opt.color, borderColor: opt.color }
                                            : undefined
                                    }
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Başlangıç</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Bitiş</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-bold text-white bg-primary hover:brightness-105 rounded-lg transition-all shadow-sm"
                        >
                            Görev Oluştur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
