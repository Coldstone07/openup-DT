import React, { useState, useEffect } from 'react';
import { api } from './api';
import { Mic, Send, Users, Activity, ExternalLink, User } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('input'); // input, dashboard
  const [userType, setUserType] = useState('mentee');
  const [userId, setUserId] = useState(`user_${Math.floor(Math.random() * 1000)}`);
  const [transcript, setTranscript] = useState('');
  const [matches, setMatches] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [status, setStatus] = useState('');

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
    setStatus('Processing session...');
    try {
      await api.submitSession({
        user_id: userId,
        user_type: userType,
        transcript: transcript
      });
      setStatus('Session ingested. Graph updated.');
      setTranscript('');
      fetchGraph();
      // Auto-fetch matches if mentee
      if (userType === 'mentee') {
        fetchMatches();
      }
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const fetchMatches = async () => {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Activity className="text-indigo-600" size={24} />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            OpenUp.AI
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'input' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            New Session
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Dashboard
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          <User size={16} />
          {userId} ({userType})
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">

        {status && (
          <div className="mb-6 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-100 flex items-center gap-2">
            <Activity size={16} />
            {status}
          </div>
        )}

        {activeTab === 'input' && (
          <div className="grid gap-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">Start a Session</h2>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setUserType('mentee')}
                  className={`flex-1 py-2 rounded-lg border ${userType === 'mentee' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600'}`}
                >
                  I am a Mentee
                </button>
                <button
                  onClick={() => setUserType('mentor')}
                  className={`flex-1 py-2 rounded-lg border ${userType === 'mentor' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white border-slate-200 text-slate-600'}`}
                >
                  I am a Mentor
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={userType === 'mentee' ? "Describe your goals, challenges, or what you're looking for..." : "Describe your expertise, experience, and mentoring style..."}
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-lg"
                />
                <button className="absolute bottom-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Mic size={20} />
                </button>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmitSession}
                  disabled={!transcript}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={18} />
                  Submit Session
                </button>
              </div>
            </section>

            {/* Matches Section within Input for immediate feedback */}
            {matches.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Recommended Mentors</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {matches.map((match, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-violet-100 text-violet-700 p-2 rounded-full">
                          <Users size={20} />
                        </div>
                        <span className="text-sm font-bold text-green-600">{(match.score * 100).toFixed(0)}% Match</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">{match.mentor_id}</h4>
                      <p className="text-sm text-slate-500 mb-3">{match.rationale}</p>
                      <button className="w-full py-2 bg-slate-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                        Connect <ExternalLink size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid gap-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">Knowledge Graph Stats</h2>
              {graphData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-indigo-600">{Object.keys(graphData).length}</div>
                    <div className="text-sm text-slate-500">Total Users</div>
                  </div>
                  {/* We could parse the raw graph data to show node counts */}
                </div>
              ) : (
                <p className="text-slate-400">Loading graph data...</p>
              )}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">Raw Graph Representation (JSON)</h2>
              <pre className="bg-slate-900 text-slate-50 p-4 rounded-xl overflow-auto max-h-96 text-xs font-mono">
                {JSON.stringify(graphData, null, 2)}
              </pre>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
