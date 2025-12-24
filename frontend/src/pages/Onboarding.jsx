import React, { useState } from 'react';
import { User, Users, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: '',
        name: '',
        context: ''
    });

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
        setStep(2);
    };

    const handleContextSubmit = () => {
        if (formData.name && formData.context) {
            onComplete(formData);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 animate-fade-in">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between mb-2">
                    <span className={`text-sm font-medium ${step >= 1 ? 'text-indigo-400' : 'text-slate-600'}`}>Role</span>
                    <span className={`text-sm font-medium ${step >= 2 ? 'text-indigo-400' : 'text-slate-600'}`}>Profile</span>
                    <span className={`text-sm font-medium ${step >= 3 ? 'text-indigo-400' : 'text-slate-600'}`}>Ready</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 2) * 100}%` }}
                    />
                </div>
            </div>

            {step === 1 && (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Choose your path</h2>
                        <p className="text-slate-400">How would you like to participate in OpenUp.AI?</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Card
                            hover
                            onClick={() => handleRoleSelect('mentee')}
                            className="cursor-pointer border-2 border-transparent hover:border-indigo-500 group"
                        >
                            <div className="bg-indigo-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                                <User className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Im a Mentee</h3>
                            <p className="text-slate-400 text-sm">Looking for guidance, career advice, and skill development.</p>
                        </Card>

                        <Card
                            hover
                            onClick={() => handleRoleSelect('mentor')}
                            className="cursor-pointer border-2 border-transparent hover:border-violet-500 group"
                        >
                            <div className="bg-violet-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                                <Users className="w-8 h-8 text-violet-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Im a Mentor</h3>
                            <p className="text-slate-400 text-sm">Ready to share experience, provide insights, and help others grow.</p>
                        </Card>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Tell us about yourself</h2>
                        <p className="text-slate-400">Help us build your digital twin.</p>
                    </div>

                    <Card className="space-y-6">
                        <Input
                            label="Display Name"
                            placeholder="e.g. Alex Chen"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
                                {formData.role === 'mentee' ? 'What are your goals?' : 'What is your expertise?'}
                            </label>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 min-h-[120px]"
                                placeholder={formData.role === 'mentee'
                                    ? "Describe what you want to achieve..."
                                    : "Describe your background and what you can teach..."}
                                value={formData.context}
                                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                            >
                                <ArrowLeft className="mr-2 w-4 h-4" /> Back
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleContextSubmit}
                                disabled={!formData.name || !formData.context}
                            >
                                Complete Setup <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Onboarding;
