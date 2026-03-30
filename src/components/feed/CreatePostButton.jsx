import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function CreatePostButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/create-post')}
      className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full shadow-glow-purple flex items-center justify-center hover:from-primary-light hover:to-primary transition-all duration-200 active:scale-90 z-30"
      aria-label="Create post"
    >
      <Plus size={24} strokeWidth={2.5} />
    </button>
  );
}
