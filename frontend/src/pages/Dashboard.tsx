import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderTree } from '../components/FolderTree';
import { TaskPanel } from '../components/TaskPanel';
import { useTaskStore } from '../store/useTaskStore';
import { LogOut, Bell, Search, LayoutPanelLeft, Sparkles, ChevronRight } from 'lucide-react';


const findFolder = (folders: any[], id: string): any | undefined => {
    for (const f of folders) {
        if (f.id === id) return f;
        if (f.children) {
            const found = findFolder(f.children, id);
            if (found) return found;
        }
    }
    return undefined;
};

export const Dashboard: React.FC = () => {
    const { folders, fetchFolders, fetchTasks, fetchUsers } = useTaskStore();
    const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
    const [selectedFolderName, setSelectedFolderName] = useState<string | undefined>();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchFolders();
        fetchUsers();
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser({ username: 'Dev User', role: 'ADMIN' });
        }
    }, []);

    const handleFolderSelect = (id: string) => {
        setSelectedFolderId(id);
        const found = findFolder(folders, id);
        setSelectedFolderName(found?.name);
        fetchTasks(id);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <div className="flex h-screen w-full bg-[#f6f7fb] overflow-hidden font-sans">
            {/* Sidebar with Glass effect */}
            <motion.aside
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-[260px] h-full glass border-r z-50 flex flex-col"
            >
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-8 group cursor-pointer px-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles size={18} className="text-white fill-white/20" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-gray-800 leading-tight">Task Module</h1>
                        </div>
                    </div>

                    <FolderTree folders={folders} onSelect={handleFolderSelect} selectedId={selectedFolderId} />
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#f5f6f8] relative">
                <header className="h-14 px-6 flex items-center justify-between bg-white border-b border-gray-100 z-40">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <span>Ana Çalışma Alanı</span>
                            <ChevronRight size={12} />
                            <span className="text-gray-800 text-[13px]">{selectedFolderName || 'Genel Bakış'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            {[Search, Bell].map((Icon, i) => (
                                <button key={i} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>

                        <div className="h-6 w-[1px] bg-gray-100 mx-1" />

                        <div className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded-lg transition-all cursor-pointer group">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-[11px] font-bold text-gray-800 leading-none">{user?.username}</p>
                                <p className="text-[9px] font-bold text-gray-400 mt-0.5">{user?.role}</p>
                            </div>
                            <button onClick={handleLogout} className="text-gray-300 hover:text-red-500 transition-colors ml-1">
                                <LogOut size={14} />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden p-6">
                    <AnimatePresence mode="wait">
                        {selectedFolderId ? (
                            <motion.div
                                key={selectedFolderId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <TaskPanel folderId={selectedFolderId} folderName={selectedFolderName} />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full flex flex-col items-center justify-center"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl border border-white flex items-center justify-center relative">
                                        <LayoutPanelLeft size={48} className="text-primary" strokeWidth={1.5} />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-working rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                                        <Sparkles size={16} fill="currentColor" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-gray-800 mb-3 tracking-tight">İŞ GELİŞTİRME PROJE YÖNETİM SİSTEMİ</h2>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};
