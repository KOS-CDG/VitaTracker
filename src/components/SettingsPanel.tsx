import { useState } from 'react';

export function SettingsPanel() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  return (
    <div className="border border-black bg-white p-6 sm:p-8 flex flex-col justify-between">
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Stale Device Alerts (&gt;24h)</span>
      
      <div className="space-y-5">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase group-hover:text-neutral-600 transition-colors">Email Notifications</span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
            <div className={`w-10 h-5 border border-black p-0.5 flex items-center transition-colors ${emailEnabled ? 'bg-black' : 'bg-white'}`}>
              <div className={`w-3.5 h-3.5 bg-white border border-black transition-transform ${emailEnabled ? 'translate-x-[18px]' : 'bg-black'}`}></div>
            </div>
          </div>
        </label>
        
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase group-hover:text-neutral-600 transition-colors">Push Notifications</span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />
            <div className={`w-10 h-5 border border-black p-0.5 flex items-center transition-colors ${pushEnabled ? 'bg-black' : 'bg-white'}`}>
              <div className={`w-3.5 h-3.5 bg-white border border-black transition-transform ${pushEnabled ? 'translate-x-[18px]' : 'bg-black'}`}></div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
