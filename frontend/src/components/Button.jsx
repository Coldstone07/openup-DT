import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30 focus:ring-indigo-500 border border-transparent",
        secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20 backdrop-blur-sm",
        outline: "bg-transparent border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white",
        ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
        gradient: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg hover:shadow-violet-500/30 border border-transparent"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    const classes = twMerge(
        clsx(
            baseStyles,
            variants[variant],
            sizes[size],
            className
        )
    );

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
