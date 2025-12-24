import React, { useState, useEffect } from 'react';
import { Mic, Send, Users, Activity, ExternalLink, BarChart2, Plus } from 'lucide-react';
import { api } from '../api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Header from '../components/Header';

const Dashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('input');
    const [transcript, setTranscript] = useState('');
    const [matches, setMatches] = useState([]);
    const [graphData, setGraphData] = useState(null);
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchGraph();
    }, []);

    const fetchGraph = async () => {
        try {
            const data = await api.getGraph();
            setGraphData(data);
        } catch (e) {
            console.error("Failed to fetch graph", e);
        }
    };

    const handleSubmitSession = async () => {
        if (!transcript) return;
        setIsSubmitting(true);
        setStatus('Processing session...');
        try {
            await api.submitSession({
                user_id: user.userId,
                user_type: user.role,
                transcript: transcript
            });
            setStatus('Session ingested. Graph updated.');
            setTranscript('');
            fetchGraph();

            if (user.role === 'mentee') {
                await fetchMatches(user.userId);
            }
        } catch (e) {
            setStatus(`Error: ${e.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchMatches = async (userId) => {
        setStatus('Finding matches...');
        try {
            const results = await api.getMatches({
                user_id: userId,
                top_k: 3
            });
            setMatches(results);
            setStatus('Matches found.');
        } catch (e) {
            setStatus(`Error matching: ${e.message}`);
        }
    };

    return (
        <>
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userId={user.name}
                userType={user.role}
            />

            <main className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                {status && (
                    <div className="bg-indigo-500/10 text-indigo-300 px-4 py-3 rounded-xl border border-indigo-500/20 flex items-center gap-2">
                        <Activity size={16} />
                        {status}
                    </div>
                )}

                {activeTab === 'input' && (
                    <div className="grid gap-8">
                        <Card className="relative overflow-hidden">
                            {/* Decorative background blob */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

                            <div className="relative z-10">
                                <h2 className="text-xl font-semibold mb-1 text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-indigo-400" />
                                    New Session
                                </h2>
                                <p className="text-slate-400 text-sm mb-6">
                                    {user.role === 'mentee'
                                        ? "Share your current challenges or goals to update your digital twin."
                                        : "Share your recent experiences or expertise to update your digital twin."}
                                </p>

                                <div className="relative mb-6">
                                    <textarea
                                        value={transcript}
                                        onChange={(e) => setTranscript(e.target.value)}
                                        placeholder="Type your thoughts here..."
                                        className="w-full h-40 p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none text-base transition-all duration-200"
                                    />
                                    <button className="absolute bottom-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                                        <Mic size={18} />
                                    </button>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSubmitSession}
                                        disabled={!transcript}
                                        isLoading={isSubmitting}
                                        size="lg"
                                    >
                                        <Send size={18} className="mr-2" />
                                        Sync to Digital Twin
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {matches.length > 0 && (
                            <section className="animate-fade-in">
                                <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                                    <Users className="text-indigo-400" size={24} />
                                    Recommended Mentors
                                </h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {matches.map((match, idx) => (
                                        <Card key={idx} hover className="flex flex-col h-full">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {match.mentor_id.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                                                    {(match.score * 100).toFixed(0)}% Match
                                                </span>
                                            </div>

                                            <h4 className="font-semibold text-lg text-white mb-2 truncate">
                                                {match.mentor_id}
                                            </h4>

                                            <p className="text-sm text-slate-400 mb-4 flex-grow line-clamp-3">
                                                {match.rationale}
                                            </p>

                                            <Button variant="secondary" className="w-full mt-auto">
                                                Connect <ExternalLink size={14} className="ml-2" />
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div className="grid gap-6">
                        <Card>
                            <h2 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-violet-400" />
                                Network Statistics
                            </h2>

                            {graphData ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                                        <div className="text-3xl font-bold text-indigo-400 mb-1">{Object.keys(graphData).length}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Users</div>
                                    </div>
                                    {/* Additional stats could go here */}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-12 text-slate-500">
                                    <div className="animate-spin mr-3"><Activity size={20} /></div>
                                    Loading knowledge graph data...
                                </div>
                            )}
                        </Card>

                        <Card>
                            <h2 className="text-lg font-semibold mb-4 text-white">Raw Graph Data</h2>
                            <div className="bg-[#0B0E17] p-4 rounded-xl border border-slate-800 overflow-hidden">
                                <pre className="text-indigo-300 overflow-auto max-h-96 text-xs font-mono scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent p-2">
                                    {JSON.stringify(graphData, null, 2)}
                                </pre>
                            </div>
                        </Card>
                    </div>
                )}
            </main>
        </>
    );
};

export default Dashboard;
