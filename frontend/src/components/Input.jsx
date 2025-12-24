import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ className, error, label, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <input
                className={twMerge(clsx(
                    "w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200",
                    error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
                    className
                ))}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-400 ml-1">{error}</p>}
        </div>
    );
};

export default Input;
