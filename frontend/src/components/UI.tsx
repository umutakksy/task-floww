import React, { type InputHTMLAttributes, type SelectHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';

// --- Types ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    error?: string | undefined;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: string[] | { value: string; label: string }[];
    icon?: LucideIcon;
    error?: string | undefined;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: LucideIcon;
}

// --- Components ---

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
    <div
        className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
        {children}
    </div>
);

export const CardHeader: React.FC<{
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
}> = ({ title, subtitle, icon: Icon, action }) => (
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-lg">
        <div className="flex items-center gap-3">
            {Icon && (
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Icon size={18} strokeWidth={2.5} />
                </div>
            )}
            <div>
                <h3 className="text-base font-bold text-gray-800 tracking-tight">{title}</h3>
                {subtitle && <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{subtitle}</p>}
            </div>
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const Input: React.FC<InputProps> = ({
    label,
    className = '',
    icon: Icon,
    iconPosition = 'left',
    error,
    required,
    ...props
}) => (
    <div className="w-full">
        {label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">{label} {required && '*'}</label>}
        <div className="relative">
            {Icon && iconPosition === 'left' && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            )}
            <input
                className={`
                    w-full bg-white border-gray-200 text-gray-800 rounded-lg border py-2.5 px-4
                    focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all
                    placeholder:text-gray-300 font-medium text-sm
                    ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
                    ${error ? 'border-danger' : ''}
                    ${className}
                `}
                {...props}
            />
        </div>
        {error && <p className="mt-1 text-xs font-bold text-danger ml-1">{error}</p>}
    </div>
);

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    icon: Icon,
    error,
    required,
    ...props
}) => (
    <div className="w-full">
        {label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">{label} {required && '*'}</label>}
        <div className="relative">
            {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            )}
            <select
                className={`
                    w-full bg-white border-gray-200 text-gray-800 rounded-lg border py-2.5 px-4 appearance-none
                    focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all
                    font-medium text-sm
                    ${Icon ? 'pl-10' : ''}
                    ${error ? 'border-danger' : ''}
                `}
                value={value}
                onChange={onChange}
                {...props}
            >
                {options.map((opt, i) => {
                    const val = typeof opt === 'string' ? opt : opt.value;
                    const lbl = typeof opt === 'string' ? opt : opt.label;
                    return <option key={i} value={val}>{lbl}</option>;
                })}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={16} />
            </div>
        </div>
        {error && <p className="mt-1 text-xs font-bold text-danger ml-1">{error}</p>}
    </div>
);

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading,
    icon: Icon,
    children,
    className = '',
    ...props
}) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        secondary: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
        danger: 'bg-danger text-white hover:opacity-90',
        success: 'bg-success text-white hover:opacity-90',
        ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 border-transparent',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-md',
        md: 'px-5 py-2 text-sm rounded-md',
        lg: 'px-6 py-3 text-base rounded-lg',
    };

    return (
        <button
            className={`
                flex items-center justify-center gap-2 font-bold border
                transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
                ${variants[variant]} ${sizes[size]} ${className}
            `}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && <Icon size={16} strokeWidth={2.5} />}
                    {children}
                </>
            )}
        </button>
    );
};
