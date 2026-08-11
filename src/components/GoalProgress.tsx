import { useState } from 'react';
import { VitaminLog } from '../types';

interface GoalProgressProps {
  logs: VitaminLog[];
}

export function GoalProgress({ logs }: GoalProgressProps) {
  const [dailyGoal, setDailyGoal] = useState(1);

  // Calculate today's dispensed
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= today && log.vitamin_status.toLowerCase().includes('dispense');
  });
  
  const progress = Math.min(100, Math.round((todaysLogs.length / dailyGoal) * 100));

  return (
    <div className="border border-black bg-white p-6 sm:p-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400">Daily Target</span>
          <div className="text-2xl sm:text-3xl font-black mt-1">{todaysLogs.length} / {dailyGoal}</div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400 hidden sm:inline-block">Goal:</span>
          <input 
            type="number" 
            min="1" 
            max="10" 
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Math.max(1, parseInt(e.target.value) || 1))}
            className="border border-black w-14 sm:w-16 text-center text-sm font-mono py-1.5 outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>
      <div className="h-5 sm:h-6 w-full bg-neutral-100 border border-black overflow-hidden relative">
        <div 
          className="h-full bg-black transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center mix-blend-difference text-white text-[9px] font-bold tracking-widest uppercase">
          {progress}%
        </div>
      </div>
    </div>
  );
}
