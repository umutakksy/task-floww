import { create } from 'zustand';
import api from '../services/api';
import type { Folder, Task, TaskStatus, Priority, User } from '../types';

interface TaskState {
    folders: Folder[];
    tasks: Task[];
    users: User[];
    loading: boolean;
    error: string | null;
    fetchFolders: () => Promise<void>;
    fetchTasks: (folderId: string) => Promise<void>;
    fetchUsers: () => Promise<void>;
    createFolder: (name: string, parentId?: string) => Promise<void>;
    createTask: (taskData: Partial<Task>) => Promise<void>;
    updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
    updateTaskPriority: (taskId: string, priority: Priority) => Promise<void>;
    updateTaskProgress: (taskId: string, progress: number) => Promise<void>;
    updateTask: (taskId: string, data: { title?: string; description?: string }) => Promise<void>;
    toggleAssignee: (taskId: string, userId: string) => Promise<void>;
    deleteFolder: (folderId: string) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    folders: [],
    tasks: [],
    users: [],
    loading: false,
    error: null,

    fetchFolders: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/folders/tree');
            set({ folders: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchTasks: async (folderId: string) => {
        set({ loading: true });
        try {
            const response = await api.get(`/tasks/folder/${folderId}`);
            set({ tasks: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchUsers: async () => {
        try {
            const response = await api.get('/users');
            set({ users: response.data });
        } catch (error: any) {
            console.error('fetchUsers error:', error);
        }
    },

    createFolder: async (name: string, parentId?: string) => {
        try {
            await api.post('/folders', { name, parentId });
            get().fetchFolders();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Klasör oluşturulurken hata oluştu');
        }
    },

    createTask: async (taskData: Partial<Task>) => {
        try {
            await api.post('/tasks', taskData);
            if (taskData.folderId) {
                await get().fetchTasks(taskData.folderId);
            }
        } catch (error: any) {
            console.error('createTask error:', error);
            alert(error.response?.data?.message || error.message || 'Görev oluşturulurken hata oluştu');
        }
    },

    updateTaskStatus: async (taskId: string, status: TaskStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status?status=${status}`);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
            }));
        } catch (error: any) {
            alert(error.response?.data?.message || 'Durum güncellenirken hata oluştu');
        }
    },

    updateTaskPriority: async (taskId: string, priority: Priority) => {
        try {
            await api.patch(`/tasks/${taskId}/priority?priority=${priority}`);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, priority } : t)),
            }));
        } catch (error: any) {
            alert(error.response?.data?.message || 'Öncelik güncellenirken hata oluştu');
        }
    },

    updateTaskProgress: async (taskId: string, progress: number) => {
        try {
            await api.patch(`/tasks/${taskId}/progress?progress=${progress}`);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, progress } : t)),
            }));
        } catch (error: any) {
            console.error('updateProgress error:', error);
            alert(error.response?.data?.message || 'İlerleme güncellenirken hata oluştu');
        }
    },

    updateTask: async (taskId: string, data: { title?: string; description?: string }) => {
        try {
            await api.patch(`/tasks/${taskId}`, data);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...data } : t)),
            }));
        } catch (error: any) {
            console.error('updateTask error:', error);
            alert(error.response?.data?.message || 'Görev güncellenirken hata oluştu');
        }
    },

    toggleAssignee: async (taskId: string, userId: string) => {
        try {
            await api.post(`/tasks/${taskId}/assign/${userId}`);
            set((state) => ({
                tasks: state.tasks.map((t) => {
                    if (t.id === taskId) {
                        const exists = t.assigneeIds.includes(userId);
                        const newIds = exists
                            ? t.assigneeIds.filter(id => id !== userId)
                            : [...t.assigneeIds, userId];
                        return { ...t, assigneeIds: newIds };
                    }
                    return t;
                }),
            }));
        } catch (error: any) {
            console.error('toggleAssignee error:', error);
        }
    },

    deleteFolder: async (folderId: string) => {
        try {
            await api.delete(`/folders/${folderId}`);
            get().fetchFolders();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Klasör silinirken hata oluştu');
        }
    },

    deleteTask: async (taskId: string) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== taskId),
            }));
        } catch (error: any) {
            alert(error.response?.data?.message || 'Görev silinirken hata oluştu');
        }
    },
}));
