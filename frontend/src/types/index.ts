export interface User {
    id: string;
    username: string;
    role: 'ADMIN' | 'MANAGER' | 'USER';
}

export interface Folder {
    id: string;
    name: string;
    userId: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    children?: Folder[];
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    folderId: string;
    parentTaskId?: string;
    creatorId: string;
    startDate?: string;
    endDate?: string;
    progress: number;
    createdAt: string;
    updatedAt: string;
    assigneeIds: string[];
}
