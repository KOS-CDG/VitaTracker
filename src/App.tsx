import { useEffect, useState } from 'react';
import { LatestStatus } from './components/LatestStatus';
import { HistoryTable } from './components/HistoryTable';
import { GoalProgress } from './components/GoalProgress';
import { SettingsPanel } from './components/SettingsPanel';
import { VitaminLog } from './types';

export default function App() {
  const [logs, setLogs] = useState<VitaminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setLogs(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Poll for updates every 5 seconds since it's hardware data
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const latestLog = logs.length > 0 ? logs[0] : null;
  const isStale = latestLog 
    ? (new Date().getTime() - new Date(latestLog.timestamp).getTime()) > 24 * 60 * 60 * 1000
    : false;

  return (
    <div className="flex flex-col h-screen w-full bg-white text-black font-sans overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 border-b border-black">
        <div className="space-y-0.5 sm:space-y-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tighter uppercase">VitTrack System v1.0</h1>
          <p className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-neutral-500 uppercase tracking-widest hidden sm:block">Automated Supplement Dispersion Monitoring</p>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-black ${isStale ? 'bg-transparent' : 'bg-black animate-pulse'}`}></div>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">
              {isStale ? 'ESP32-S3: Offline (>24h)' : 'ESP32-S3: Connected'}
            </span>
          </div>
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 border border-black text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
            API Status: {error ? 'Error' : loading ? 'Loading' : '200 OK'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {loading && logs.length === 0 ? (
            <div className="col-span-1 lg:col-span-12 py-24 flex items-center justify-center border border-black bg-white">
              <span className="text-xs sm:text-sm tracking-widest uppercase text-gray-500 font-bold">Loading system data...</span>
            </div>
          ) : error ? (
            <div className="col-span-1 lg:col-span-12 py-24 flex items-center justify-center border border-black bg-white">
              <div className="text-center">
                <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-black">System Error</span>
                <p className="text-[10px] sm:text-xs text-gray-600 mt-2">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <section className="col-span-1 lg:col-span-5 flex flex-col space-y-6 lg:space-y-8">
                <LatestStatus log={latestLog} />
                <GoalProgress logs={logs} />
                <SettingsPanel />
              </section>
              
              <section className="col-span-1 lg:col-span-7 flex flex-col border border-black bg-white overflow-hidden min-h-[400px]">
                <HistoryTable logs={logs} />
              </section>
            </>
          )}
        </div>
      </main>

      <footer className="p-4 lg:p-6 border-t border-black bg-white flex justify-between text-[9px] lg:text-[10px] font-bold uppercase tracking-widest flex-shrink-0">
        <span>© 2024 VitTrack Logistics</span>
        <span className="hidden sm:inline-block">Security: Internal</span>
        <span className="hidden sm:inline-block">Polling: 5s</span>
      </footer>
    </div>
  );
}
