import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import MonthView from './views/MonthView';

export default function CalendarShell({ events, setEvents }){
  const [view, setView] = useState('monthly');
  const [displayDate, setDisplayDate] = useState(new Date());

  const prev = ()=> setDisplayDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1));
  const next = ()=> setDisplayDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Calendar</h1>
          <div className="text-sm text-slate-500">Full Event Schedule • {format(new Date(),'dd MMM yyyy')}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="space-x-2">
            <button onClick={()=>setView('weekly')} className={'px-3 py-1 rounded text-sm ' + (view==='weekly' ? 'bg-indigo-600 text-white':'border')}>Weekly</button>
            <button onClick={()=>setView('monthly')} className={'px-3 py-1 rounded text-sm ' + (view==='monthly' ? 'bg-indigo-600 text-white':'border')}>Monthly</button>
            <button onClick={()=>setView('timeline')} className={'px-3 py-1 rounded text-sm ' + (view==='timeline' ? 'bg-indigo-600 text-white':'border')}>Timeline</button>
          </div>
          <div className="flex items-center gap-2 border rounded p-1">
            <button onClick={prev} className="px-2">◀</button>
            <button onClick={next} className="px-2">▶</button>
          </div>
        </div>
      </div>

      <div>
        {view==='monthly' && <MonthView events={events} setEvents={setEvents} displayDate={displayDate} />}
        {view==='weekly' && <div className="p-6 bg-white rounded shadow">Weekly view (placeholder)</div>}
        {view==='timeline' && <div className="p-6 bg-white rounded shadow">Timeline view (placeholder)</div>}
      </div>
    </div>
  )
}
