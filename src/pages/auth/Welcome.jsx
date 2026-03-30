import React from 'react';
import BrekoutLogo from '../../components/ui/BrekoutLogo';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Building2, TrendingUp } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-64 h-64 bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col flex-1 px-6 pt-16 pb-8">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BrekoutLogo size={48} />
              <div>
                <div className="text-3xl font-black tracking-tight leading-none">
                  <span className="text-white">BREKOUT</span>
                  <span className="text-primary">HUB</span>
                </div>
              </div>
            </div>
            <p className="text-xl font-bold text-white mt-4">Where Athletes</p>
            <p className="text-xl font-bold text-gradient-purple">Get Seen.</p>
          </div>

          {/* Hero image area */}
          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
            <img
              src="https://picsum.photos/seed/athletes_hero/800/600"
              alt="Athletes"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />

            {/* Floating stats */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <div className="flex-1 glass rounded-2xl p-3 border border-white/10">
                <p className="text-white font-black text-xl leading-none">12K+</p>
                <p className="text-muted text-xs mt-0.5">Athletes</p>
              </div>
              <div className="flex-1 glass rounded-2xl p-3 border border-white/10">
                <p className="text-white font-black text-xl leading-none">800+</p>
                <p className="text-muted text-xs mt-0.5">Businesses</p>
              </div>
              <div className="flex-1 glass rounded-2xl p-3 border border-white/10">
                <p className="text-accent font-black text-xl leading-none">Growing</p>
                <p className="text-muted text-xs mt-0.5">Daily</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              { icon: '🎬', text: 'Share your highlights and get noticed by college recruiters' },
              { icon: '🎯', text: 'Connect directly with coaches from top D1 programs' },
              { icon: '🏢', text: 'Access elite sports services — videographers, trainers, NIL advisors' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <p className="text-sm text-muted leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 mt-auto">
            <button
              onClick={() => navigate('/register')}
              className="w-full btn-primary text-base py-4 flex items-center justify-center gap-2"
            >
              Create Account
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full btn-secondary text-base py-4"
            >
              Sign In
            </button>
          </div>

          {/* Legal */}
          <p className="text-center text-xs text-muted/50 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
