import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Rss, Building2, Target, User } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/feed', icon: Rss, label: 'Feed' },
  { path: '/network', icon: Building2, label: 'Network' },
  { path: '/recruitment', icon: Target, label: 'Recruit' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="flex-shrink-0 bg-surface border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path ||
            (path !== '/dashboard' && location.pathname.startsWith(path));

          return (
            <NavLink
              key={path}
              to={path}
              className={`bottom-nav-item ${
                isActive
                  ? 'text-primary'
                  : 'text-muted hover:text-white'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-primary/15' : ''
              }`}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={`transition-all duration-200 ${isActive ? 'text-primary' : 'text-muted'}`}
                />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-muted'
              }`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
