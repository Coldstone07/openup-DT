import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <div
            className={twMerge(clsx(
                "glass-panel rounded-2xl p-6 transition-all duration-300",
                hover && "hover:border-white/20 hover:bg-opacity-80 hover:shadow-lg hover:translate-y-[-2px]",
                className
            ))}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
