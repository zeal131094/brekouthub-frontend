import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import Button from '../ui/Button';

const SPORTS = ['Basketball', 'Football', 'Soccer', 'Track & Field', 'Baseball', 'Volleyball', 'Swimming', 'Tennis', 'Wrestling', 'Lacrosse'];
const GRADES = ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];
const GENDERS = ['Male', 'Female'];

export default function FilterSheet({ filters, onApply, onClose }) {
  const [local, setLocal] = useState({ ...filters });

  const update = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));
  const toggle = (key, val) => setLocal(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }));

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleReset = () => {
    const reset = { sport: '', grade: '', gender: '', min_gpa: '', min_height: '' };
    setLocal(reset);
    onApply(reset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[430px] mx-auto bg-surface rounded-t-3xl border-t border-border animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-primary" />
            <h3 className="font-bold text-white">Filter Athletes</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-card">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Sport */}
          <div>
            <label className="text-sm font-semibold text-white mb-2 block">Sport</label>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map(s => (
                <button
                  key={s}
                  onClick={() => toggle('sport', s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    local.sport === s
                      ? 'bg-primary border-primary text-white'
                      : 'bg-card border-border text-muted hover:border-primary/50 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Grade */}
          <div>
            <label className="text-sm font-semibold text-white mb-2 block">Grade Level</label>
            <div className="flex flex-wrap gap-2">
              {GRADES.map(g => (
                <button
                  key={g}
                  onClick={() => toggle('grade', g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    local.grade === g
                      ? 'bg-primary border-primary text-white'
                      : 'bg-card border-border text-muted hover:border-primary/50 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-semibold text-white mb-2 block">Gender</label>
            <div className="flex gap-2">
              {GENDERS.map(g => (
                <button
                  key={g}
                  onClick={() => toggle('gender', g)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                    local.gender === g
                      ? 'bg-primary border-primary text-white'
                      : 'bg-card border-border text-muted hover:border-primary/50 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Min GPA */}
          <div>
            <label className="text-sm font-semibold text-white mb-2 block">
              Minimum GPA: <span className="text-primary">{local.min_gpa || 'Any'}</span>
            </label>
            <input
              type="range"
              min="0"
              max="4"
              step="0.1"
              value={local.min_gpa || 0}
              onChange={e => update('min_gpa', e.target.value === '0' ? '' : e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>Any</span>
              <span>2.0</span>
              <span>3.0</span>
              <span>4.0</span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-6 pt-3 border-t border-border flex gap-3">
          <Button variant="secondary" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button variant="primary" onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
