import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Trash2, Hash, Layout } from 'lucide-react';
import type { Folder } from '../types';
import { useTaskStore } from '../store/useTaskStore';

interface FolderTreeProps {
    folders: Folder[];
    onSelect: (folderId: string) => void;
    selectedId?: string;
}

const FolderItem: React.FC<{ folder: Folder; onSelect: (id: string) => void; selectedId?: string; depth: number }> = ({
    folder,
    onSelect,
    selectedId,
    depth,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isAddingSub, setIsAddingSub] = useState(false);
    const [newName, setNewName] = useState('');
    const { createFolder, deleteFolder } = useTaskStore();

    const handleAddSubfolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAddingSub(true);
        setNewName('');
    };

    const submitSubfolder = () => {
        if (newName.trim()) {
            createFolder(newName.trim(), folder.id);
        }
        setIsAddingSub(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`"${folder.name}" klasörünü silmek istediğinizden emin misiniz?`)) {
            deleteFolder(folder.id);
        }
    };

    const isSelected = selectedId === folder.id;

    return (
        <div className="select-none">
            <motion.div
                initial={false}
                animate={{ backgroundColor: isSelected ? '#e5f4ff' : 'transparent' }}
                className={`
                    flex items-center group py-1.5 px-2 rounded-md cursor-pointer transition-all mx-1 mb-0.5
                    ${isSelected ? 'text-primary' : 'text-gray-600 hover:bg-gray-100'}
                `}
                style={{ paddingLeft: `${depth * 16 + 12}px` }}
                onClick={() => onSelect(folder.id)}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                    className="p-1 hover:bg-black/5 rounded-lg transition-colors mr-1 opacity-60 hover:opacity-100"
                >
                    {folder.children && folder.children.length > 0 ? (
                        <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                            <ChevronRight size={14} />
                        </motion.div>
                    ) : (
                        <div className="w-3.5" />
                    )}
                </button>

                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${isSelected ? 'bg-primary' : 'bg-transparent group-hover:bg-gray-300'} transition-all`} />

                <span className={`flex-1 truncate text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>
                    {folder.name}
                </span>

                <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button onClick={handleAddSubfolder} className="p-1 hover:bg-black/5 rounded text-gray-400 hover:text-primary">
                        <Plus size={14} />
                    </button>
                    {!folder.parentId && (
                        <button onClick={handleDelete} className="p-1 hover:bg-black/5 rounded text-gray-400 hover:text-danger">
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </motion.div>

            <AnimatePresence initial={false}>
                {isAddingSub && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mx-1 mb-1 overflow-hidden"
                        style={{ paddingLeft: `${(depth + 1) * 16 + 12}px` }}
                    >
                        <input
                            autoFocus
                            className="w-full bg-white border border-primary/30 rounded px-2 py-1 text-sm outline-none shadow-sm"
                            placeholder="Alt pano adı..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && submitSubfolder()}
                            onBlur={submitSubfolder}
                        />
                    </motion.div>
                )}

                {isOpen && folder.children && folder.children.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {folder.children.map((child) => (
                            <FolderItem key={child.id} folder={child} onSelect={onSelect} selectedId={selectedId} depth={depth + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FolderTree: React.FC<FolderTreeProps> = ({ folders, onSelect, selectedId }) => {
    const { createFolder } = useTaskStore();
    const [isAddingRoot, setIsAddingRoot] = useState(false);
    const [rootName, setRootName] = useState('');

    const handleAddRootFolder = () => {
        setIsAddingRoot(true);
        setRootName('');
    };

    const submitRootFolder = () => {
        if (rootName.trim()) {
            createFolder(rootName.trim());
        }
        setIsAddingRoot(false);
    };

    return (
        <div className="flex flex-col h-full bg-transparent w-full">
            <div className="space-y-1 mb-6 mt-2">
                <div className="flex items-center gap-3 px-3 py-2 text-primary bg-primary/10 rounded-xl cursor-pointer transition-all border border-primary/10 shadow-sm shadow-primary/5 mx-1">
                    <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Layout size={14} className="text-primary" />
                    </div>
                    <span className="text-[13px] font-bold tracking-tight">Genel Panolar</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div className="px-3 py-2 flex items-center justify-between group sticky top-0 bg-transparent backdrop-blur-sm z-10 mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Panolar</span>
                    <button onClick={handleAddRootFolder} className="p-1.5 bg-white shadow-sm rounded-lg text-primary hover:bg-primary hover:text-white transition-all border border-primary/10">
                        <Plus size={16} />
                    </button>
                </div>

                <AnimatePresence>
                    {isAddingRoot && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-2 mb-2 overflow-hidden"
                        >
                            <input
                                autoFocus
                                className="w-full bg-white border border-primary/30 rounded-lg px-3 py-2 text-sm outline-none shadow-sm placeholder:text-gray-300"
                                placeholder="Pano adı girin..."
                                value={rootName}
                                onChange={(e) => setRootName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && submitRootFolder()}
                                onBlur={submitRootFolder}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {folders.length > 0 ? (
                    <div className="space-y-0.5">
                        {folders.map((folder) => (
                            <FolderItem key={folder.id} folder={folder} onSelect={onSelect} selectedId={selectedId} depth={0} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 text-center px-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white shadow-sm">
                            <Hash size={20} className="text-gray-300" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pano Bulunmuyor</p>
                        <button onClick={handleAddRootFolder} className="mt-2 text-primary text-[11px] font-bold hover:underline transition-all">
                            Yeni Pano Oluştur
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

