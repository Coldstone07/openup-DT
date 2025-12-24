import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Welcome = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 rounded-full animate-pulse-slow"></div>
                <Sparkles className="w-16 h-16 text-indigo-400 relative z-10" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                <span className="block text-white mb-2">Unlock Your Potential</span>
                <span className="text-gradient-primary">with OpenUp.AI</span>
            </h1>

            <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
                Your AI-powered bridge to meaningful mentorship. Create your digital twin,
                find your perfect match, and accelerate your growth journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" onClick={onStart} className="group">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="secondary" size="lg">
                    Learn More
                </Button>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                <Card hover className="bg-white/5 border-white/5">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 font-bold">1</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Create Profile</h3>
                    <p className="text-slate-400 text-sm">Define your goals, skills, and aspirations to build your digital twin.</p>
                </Card>
                <Card hover className="bg-white/5 border-white/5">
                    <div className="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4 text-violet-400 font-bold">2</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Find Match</h3>
                    <p className="text-slate-400 text-sm">Our AI analyzes thousands of profiles to find your perfect mentor or mentee.</p>
                </Card>
                <Card hover className="bg-white/5 border-white/5">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 font-bold">3</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Start Growing</h3>
                    <p className="text-slate-400 text-sm">Connect, schedule sessions, and track your progress in real-time.</p>
                </Card>
            </div>
        </div>
    );
};

export default Welcome;
