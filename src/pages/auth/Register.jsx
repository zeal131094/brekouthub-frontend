import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { register as registerApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const SPORTS = ['Basketball', 'Football', 'Soccer', 'Track & Field', 'Baseball', 'Volleyball', 'Swimming', 'Tennis', 'Wrestling', 'Lacrosse', 'Other'];
const GRADES = ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];
const BUSINESS_CATEGORIES = ['Videographer', 'Photographer', 'Trainer', 'CPA', 'NIL/Legal', 'Nutrition', 'Equipment', 'Other'];

const ROLES = [
  { id: 'player', icon: '🏃', label: 'Athlete', desc: 'Player looking to get recruited' },
  { id: 'parent', icon: '👨‍👩‍👧', label: 'Parent', desc: 'Supporting an athlete' },
  { id: 'recruiter', icon: '🎯', label: 'Recruiter', desc: 'College coach or scout' },
  { id: 'business', icon: '🏢', label: 'Business', desc: 'Sports service provider' },
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    role: '',
    sport: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    grade_level: '',
    gender: '',
    height: '',
    school: '',
    name: '',
    category: '',
    description: '',
  });

  const update = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setError('');
  };

  const maxSteps = form.role === 'business' ? 4 : 3;

  const canProceed = () => {
    if (step === 1) return Boolean(form.role);
    if (step === 2) return form.role === 'business' ? true : Boolean(form.sport);
    if (step === 3) {
      if (form.role === 'business') return Boolean(form.name && form.category);
      return Boolean(form.email && form.password && form.first_name && form.last_name);
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const { token, user } = await registerApi(form);
      login(token, user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative flex-1 flex flex-col px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => step === 1 ? navigate('/welcome') : setStep(s => s - 1)}
              className="p-2 text-muted hover:text-white transition-colors rounded-xl hover:bg-card"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Create Account</h1>
              <p className="text-xs text-muted">Step {step} of {maxSteps}</p>
            </div>
            <div className="text-2xl font-black">
              <span className="text-white">BH</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-border rounded-full mb-8">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${(step / maxSteps) * 100}%` }}
            />
          </div>

          {/* Step 1: Role */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Who are you?</h2>
              <p className="text-muted text-sm mb-6">Select your role to personalize your experience</p>

              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => update('role', role.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 active:scale-95 ${
                      form.role === role.id
                        ? 'border-primary bg-primary/15 shadow-glow-purple'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{role.icon}</div>
                    <div className="font-bold text-white text-sm">{role.label}</div>
                    <div className="text-xs text-muted mt-0.5">{role.desc}</div>
                    {form.role === role.id && (
                      <div className="mt-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Sport (or skip for business) */}
          {step === 2 && form.role !== 'business' && (
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Your Sport</h2>
              <p className="text-muted text-sm mb-6">What sport do you play or coach?</p>

              <div className="flex flex-wrap gap-2">
                {SPORTS.map(sport => (
                  <button
                    key={sport}
                    onClick={() => update('sport', sport)}
                    className={`px-4 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200 active:scale-95 ${
                      form.sport === sport
                        ? 'border-primary bg-primary text-white shadow-glow-purple'
                        : 'border-border bg-card text-muted hover:border-primary/50 hover:text-white'
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 for business: profile details */}
          {step === 2 && form.role === 'business' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white mb-1">Business Info</h2>
              <p className="text-muted text-sm mb-6">Tell athletes about your business</p>

              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Business Name *</label>
                <input
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Elite Highlight Films"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Category *</label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => update('category', cat)}
                      className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all active:scale-95 ${
                        form.category === cat
                          ? 'border-primary bg-primary text-white'
                          : 'border-border bg-card text-muted hover:border-primary/50 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Tell athletes what you offer..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Profile details (non-business) */}
          {step === 3 && form.role !== 'business' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white mb-1">Your Profile</h2>
              <p className="text-muted text-sm mb-4">Set up your account details</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted mb-1.5 block">First Name *</label>
                  <input value={form.first_name} onChange={e => update('first_name', e.target.value)} placeholder="Marcus" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted mb-1.5 block">Last Name *</label>
                  <input value={form.last_name} onChange={e => update('last_name', e.target.value)} placeholder="Johnson" className="input-field" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Email Address *</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" className="input-field" />
              </div>

              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Password *</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 6 characters" className="input-field" />
              </div>

              {(form.role === 'player' || form.role === 'parent') && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-muted mb-1.5 block">Grade</label>
                      <select value={form.grade_level} onChange={e => update('grade_level', e.target.value)} className="input-field">
                        <option value="">Select grade</option>
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted mb-1.5 block">Gender</label>
                      <select value={form.gender} onChange={e => update('gender', e.target.value)} className="input-field">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted mb-1.5 block">School</label>
                    <input value={form.school} onChange={e => update('school', e.target.value)} placeholder="Lincoln High School" className="input-field" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3 for business: account credentials */}
          {step === 3 && form.role === 'business' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white mb-1">Account Setup</h2>
              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Email Address *</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Password *</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 6 characters" className="input-field" />
              </div>
            </div>
          )}

          {/* Step 4: Payment (business only) */}
          {step === 4 && form.role === 'business' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white mb-1">Business Plan</h2>
              <p className="text-muted text-sm">Choose your subscription tier</p>

              <div className="space-y-3">
                {[
                  { name: 'Starter', price: 'Free', features: ['Basic profile listing', 'Up to 5 reviews', 'Standard placement'] },
                  { name: 'Pro', price: '$29/mo', features: ['Featured placement', 'Verified badge', 'Unlimited reviews', 'Analytics dashboard'], popular: true },
                  { name: 'Elite', price: '$79/mo', features: ['Everything in Pro', 'Top search placement', 'Priority support', 'Custom branding'] },
                ].map(plan => (
                  <div
                    key={plan.name}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      plan.popular
                        ? 'border-primary bg-primary/10 shadow-glow-purple'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{plan.name}</span>
                        {plan.popular && (
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Popular</span>
                        )}
                      </div>
                      <span className={`font-black text-lg ${plan.popular ? 'text-primary' : 'text-white'}`}>{plan.price}</span>
                    </div>
                    <ul className="space-y-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted">
                          <Check size={12} className="text-green-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-2xl border border-border p-4">
                <p className="text-xs text-muted text-center">
                  🔒 Powered by Stripe — Your payment info is secure. You can upgrade or cancel anytime.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-auto pt-8">
            {step < maxSteps ? (
              <Button
                fullWidth
                size="lg"
                disabled={!canProceed()}
                onClick={() => setStep(s => s + 1)}
                className="flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                fullWidth
                size="lg"
                loading={loading}
                disabled={!canProceed()}
                onClick={handleSubmit}
              >
                Create My Account
              </Button>
            )}
          </div>

          <p className="text-center text-sm text-muted mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-light">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
