import { useState } from 'react';
import { VitaminLog } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface HistoryTableProps {
  logs: VitaminLog[];
}

export function HistoryTable({ logs }: HistoryTableProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    if (!startDate && !endDate) return true;
    const logDate = new Date(log.timestamp);
    logDate.setHours(0, 0, 0, 0);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (logDate < start) return false;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      if (logDate > end) return false;
    }
    
    return true;
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('VitTrack System - Activity Log', 14, 15);
    
    const tableColumn = ["Timestamp", "Status", "Device ID"];
    const tableRows = filteredLogs.map(log => [
      new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19),
      log.vitamin_status,
      log.device_id
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { font: 'helvetica' },
      headStyles: { fillColor: [0, 0, 0] },
    });
    doc.save(`vittrack_logs_${new Date().toISOString().substring(0, 10)}.pdf`);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 border-b border-black flex flex-col lg:flex-row justify-between items-start lg:items-end flex-shrink-0 gap-4">
        <div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest">Activity History</h3>
          <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase font-bold block mt-1">Showing {filteredLogs.length} Records</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="flex items-center justify-between sm:justify-start space-x-2 text-[9px] sm:text-[10px] font-bold uppercase flex-1 sm:flex-none">
            <span className="text-neutral-500">From</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-black px-1.5 sm:px-2 py-1 outline-none bg-neutral-50 cursor-pointer w-[95px] sm:w-auto"
            />
            <span className="text-neutral-500">To</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-black px-1.5 sm:px-2 py-1 outline-none bg-neutral-50 cursor-pointer w-[95px] sm:w-auto"
            />
          </div>
          <button 
            onClick={exportPDF}
            disabled={filteredLogs.length === 0}
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-black bg-black text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            Export PDF
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-neutral-100 border-b border-black">
            <tr>
              <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Timestamp</th>
              <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Status</th>
              <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider hidden sm:table-cell">Origin</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 sm:px-8 py-8 text-center text-[10px] sm:text-xs font-mono text-neutral-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const date = new Date(log.timestamp);
                const formattedDateTime = date.toISOString().replace('T', ' ').substring(0, 19);
                
                // Determine pill style based on status keyword
                const isDispensed = log.vitamin_status.toLowerCase().includes('dispense');
                const pillClasses = isDispensed 
                  ? "inline-block px-1.5 sm:px-2 py-0.5 bg-black text-white text-[9px] sm:text-[10px] font-bold uppercase text-center min-w-[60px] sm:min-w-[70px]"
                  : "inline-block px-1.5 sm:px-2 py-0.5 border border-black text-[9px] sm:text-[10px] font-bold uppercase text-center min-w-[60px] sm:min-w-[70px]";

                return (
                  <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-mono text-[10px] sm:text-[11px] lg:text-[12px] whitespace-nowrap text-neutral-700">
                      {formattedDateTime}
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                      <span className={pillClasses}>{log.vitamin_status}</span>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-[10px] sm:text-[11px] lg:text-[12px] font-mono text-neutral-500 hidden sm:table-cell">
                      {log.device_id}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 sm:p-4 lg:p-6 bg-neutral-100 border-t border-black text-center flex-shrink-0">
        <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">System Log End — Secure Transmission Active</span>
      </div>
    </>
  );
}
