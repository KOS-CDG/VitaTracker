import { VitaminLog } from '../types';

interface LatestStatusProps {
  log: VitaminLog | null;
}

export function LatestStatus({ log }: LatestStatusProps) {
  if (!log) {
    return (
      <div className="flex-1 border border-black bg-white p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[250px] lg:min-h-[300px]">
        <h2 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400">Current Status</h2>
        <p className="text-3xl sm:text-4xl font-black mt-4 leading-none tracking-tight uppercase text-neutral-300">Awaiting Data</p>
      </div>
    );
  }

  const date = new Date(log.timestamp);
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex-1 border border-black bg-white p-6 sm:p-8 flex flex-col justify-between min-h-[250px] lg:min-h-[300px]">
      <div>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400">Current Status</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mt-3 sm:mt-4 leading-none tracking-tight uppercase break-words">{log.vitamin_status}</h2>
        <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs lg:text-sm font-medium text-neutral-600">Latest action recorded at {formattedTime} on {formattedDate}.</p>
      </div>
      <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-neutral-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <span className="block text-[8px] sm:text-[9px] uppercase font-bold text-neutral-400">Device ID</span>
            <span className="text-xs sm:text-sm font-mono font-bold truncate block">{log.device_id}</span>
          </div>
          <div>
            <span className="block text-[8px] sm:text-[9px] uppercase font-bold text-neutral-400">Log ID</span>
            <span className="text-xs sm:text-sm font-mono font-bold truncate block">{log.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
