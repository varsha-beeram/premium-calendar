import React, { useEffect, useState } from "react";
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import CalendarShell from './components/CalendarShell';
import eventsJson from './events.json';

export default function App(){
  const [events, setEvents] = useState(()=>{
    try { const raw = localStorage.getItem('premium-events'); return raw? JSON.parse(raw): eventsJson; } catch { return eventsJson; }
  });
  useEffect(()=>{ localStorage.setItem('premium-events', JSON.stringify(events)); }, [events]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-6">
            <CalendarShell events={events} setEvents={setEvents} />
          </main>
        </div>
      </div>
    </div>
  );
}
