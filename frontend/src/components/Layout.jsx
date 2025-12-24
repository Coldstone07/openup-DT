import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#0B0E17] text-slate-200 selection:bg-indigo-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Content */}
            <div className="relative z-10 pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
