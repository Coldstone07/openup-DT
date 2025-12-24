import React from 'react';
import { Activity, User } from 'lucide-react';
import Button from './Button';

const Header = ({ activeTab, setActiveTab, userId, userType }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B0E17]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                        <Activity className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-gradient-primary tracking-tight">
                        OpenUp.AI
                    </h1>
                </div>

                <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('input')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'input'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        New Session
                    </button>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'dashboard'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Dashboard
                    </button>
                </nav>

                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-xs font-medium text-slate-300">{userId}</span>
                        <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">{userType}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                        <User size={16} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
