import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

const PAGE_TITLES = {
  '/feed': 'Feed',
  '/network': 'Network',
  '/recruitment': 'Recruit',
  '/profile': 'Profile',
  '/messages': 'Messages',
  '/notifications': 'Notifications',
  '/create-post': 'Create Post',
};

function getTitle(pathname) {
  if (pathname === '/dashboard') return null;
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const [key, val] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(key + '/')) return val;
  }
  return null;
}

// Back button shown on all non-main-tab screens
const MAIN_TABS = ['/dashboard', '/feed', '/network', '/recruitment', '/profile'];

function shouldShowBack(pathname) {
  return !MAIN_TABS.includes(pathname);
}

export default function AppShell() {
  const location = useLocation();
  const title = getTitle(location.pathname);
  const showBack = shouldShowBack(location.pathname);

  return (
    <div className="min-h-screen bg-[#08080F] flex items-stretch justify-center">
      {/* Phone frame — fixed height so BottomNav stays pinned to viewport bottom */}
      <div
        className="relative flex flex-col bg-bg w-full"
        style={{ maxWidth: '430px', height: '100dvh', overflow: 'hidden' }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-80 z-20" />

        {/* Top Bar — fixed height */}
        <TopBar title={title} showBack={showBack} />

        {/* Scrollable content — takes all remaining space */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden bg-bg"
          style={{ WebkitOverflowScrolling: 'touch', minHeight: 0 }}
        >
          <Outlet />
        </main>

        {/* Bottom Navigation — always pinned at bottom */}
        <BottomNav />
      </div>

      <style>{`
        @media (min-width: 768px) { body { background-color: #08080F; } }
      `}</style>
    </div>
  );
}
