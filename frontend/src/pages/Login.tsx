import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components/UI';
import api from '../services/api';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { username, password });
            login(response.data);
            if (response.data.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Login error', err);
            setError(err.response?.data?.message || 'Kullanıcı adı veya şifre hatalı.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-6 select-none font-sans">
            <div className="w-full max-w-[400px]">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm shadow-primary/20">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight mb-1">Task Module</h1>
                        <p className="text-gray-400 font-medium text-xs">Giriş yapın ve çalışmaya başlayın</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <Input
                                label="E-posta veya Kullanıcı Adı"
                                placeholder="E-posta girin"
                                icon={User}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                className="!rounded-lg !bg-white border-gray-200 focus:!border-primary py-2.5 text-sm"
                                required
                            />

                            <Input
                                label="Şifre"
                                type="password"
                                placeholder="Şifre girin"
                                icon={Lock}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="!rounded-lg !bg-white border-gray-200 focus:!border-primary py-2.5 text-sm"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-xs font-bold">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full py-2.5 !rounded-lg !bg-primary hover:brightness-105 transition-all flex items-center justify-center gap-2"
                                isLoading={isLoading}
                            >
                                <span className="font-bold text-sm">Giriş Yap</span>
                                <ArrowRight size={16} />
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-center pt-4">
                            <div className="h-[1px] flex-1 bg-gray-100" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                Task Management System
                            </p>
                            <div className="h-[1px] flex-1 bg-gray-100" />
                        </div>
                    </form>
                </div>

                <p className="text-center mt-6 text-gray-400 text-xs font-medium">
                    Hesabınız yok mu? <span className="text-primary hover:underline cursor-pointer font-bold">Bizimle iletişime geçin.</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
