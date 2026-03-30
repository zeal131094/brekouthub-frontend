import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { login as loginApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { token, user } = await loginApi(email, password);
      login(token, user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    const creds = {
      athlete: { email: 'demo@brekouthub.com', password: 'demo123' },
      recruiter: { email: 'recruiter@brekouthub.com', password: 'demo123' },
      business: { email: 'business@brekouthub.com', password: 'demo123' },
    };
    const c = creds[type];
    setEmail(c.email);
    setPassword(c.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative flex-1 flex flex-col px-6 py-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/welcome')}
            className="flex items-center gap-1 text-muted hover:text-white transition-colors mb-8 self-start"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Back</span>
          </button>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-3xl font-black tracking-tight mb-2">
              <span className="text-white">BREKOUT</span>
              <span className="text-primary">HUB</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-muted mt-1 text-sm">Sign in to your account</p>
          </div>

          {/* Card */}
          <div className="bg-card rounded-3xl border border-border p-6 relative overflow-hidden">
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-t-3xl" />

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="your@email.com"
                    className="input-field pl-10"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
                Sign In
              </Button>
            </form>

            <button className="w-full text-center text-sm text-muted hover:text-primary mt-3 transition-colors py-1">
              Forgot Password?
            </button>
          </div>

          {/* Demo hints */}
          <div className="mt-5 bg-surface rounded-2xl border border-border p-4">
            <p className="text-xs font-semibold text-muted mb-3 text-center">QUICK DEMO LOGIN</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => fillDemo('athlete')}
                className="text-xs bg-primary/15 text-primary border border-primary/30 rounded-xl py-2 px-2 font-medium hover:bg-primary/25 transition-colors active:scale-95"
              >
                🏃 Athlete
              </button>
              <button
                onClick={() => fillDemo('recruiter')}
                className="text-xs bg-accent/15 text-accent border border-accent/30 rounded-xl py-2 px-2 font-medium hover:bg-accent/25 transition-colors active:scale-95"
              >
                🎯 Recruiter
              </button>
              <button
                onClick={() => fillDemo('business')}
                className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 rounded-xl py-2 px-2 font-medium hover:bg-green-500/25 transition-colors active:scale-95"
              >
                🏢 Business
              </button>
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-muted mt-6">
            New to BrekoutHub?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-primary-light">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
