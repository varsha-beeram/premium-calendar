import React, { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

function getMonthMatrix(d){
  const start = startOfWeek(startOfMonth(d), {weekStartsOn:0});
  const end = endOfWeek(endOfMonth(d), {weekStartsOn:0});
  const rows = [];
  let cur = start;
  while(cur <= end){
    const week = [];
    for(let i=0;i<7;i++){
      week.push(cur);
      cur = addDays(cur,1);
    }
    rows.push(week);
  }
  return rows;
}

function timeToMinutes(t){ const [hh,mm]=t.split(':').map(Number); return hh*60 + mm; }
function eventsOverlap(a,b){ if(a.date!==b.date) return false; const sa=timeToMinutes(a.time), ea=sa+(a.duration||0); const sb=timeToMinutes(b.time), eb=sb+(b.duration||0); return Math.max(sa,sb)<Math.min(ea,eb); }

/* Small inline Event item (replaces missing EventCard.jsx) */
function EventItem({ ev, conflict, onClick }) {
  return (
    <div
      onClick={() => onClick(ev)}
      className={`group cursor-pointer p-2 rounded-md mb-2 border-l-4 flex items-center justify-between`}
      style={{
        background: "#fff",
        borderLeftColor: ev.color || "#7C3AED",
        boxShadow: conflict ? "0 0 0 2px rgba(239,68,68,0.06)" : "none",
      }}
    >
      <div className="truncate">
        <div className="text-sm font-semibold truncate">{ev.title}</div>
        <div className="text-[11px] text-slate-500">{ev.time} • {ev.duration}m</div>
      </div>
      {conflict && (
        <div className="ml-2 text-xs px-1 rounded text-red-700 border border-red-200">!</div>
      )}
    </div>
  );
}

/* Minimal Modal (replaces missing EventModal.jsx) */
function Modal({ open, onClose, onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(initial?.date || format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(initial?.time || "09:00");
  const [duration, setDuration] = useState(initial?.duration || 30);

  // Reset when initial changes
  React.useEffect(() => {
    setTitle(initial?.title || "");
    setDate(initial?.date || format(new Date(), "yyyy-MM-dd"));
    setTime(initial?.time || "09:00");
    setDuration(initial?.duration || 30);
  }, [initial, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-xl z-10 w-[min(96%,480px)] p-5">
        <h3 className="text-lg font-semibold mb-3">{initial && initial.id ? "Edit Event" : "Create Event"}</h3>
        <label className="block text-sm">Title</label>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full mb-2 px-3 py-2 border rounded" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm">Date</label>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full px-2 py-2 border rounded"/>
          </div>
          <div>
            <label className="text-sm">Time</label>
            <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} className="w-full px-2 py-2 border rounded"/>
          </div>
        </div>
        <label className="block text-sm mt-2">Duration (minutes)</label>
        <input type="number" value={duration} onChange={(e)=>setDuration(Number(e.target.value))} className="w-full px-2 py-2 border rounded" />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded border">Cancel</button>
          <button onClick={()=>{
            onSave({ ...initial, title, date, time, duration });
          }} className="px-3 py-1 rounded bg-indigo-600 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function MonthView({ events, setEvents, displayDate }){
  const matrix = useMemo(()=> getMonthMatrix(displayDate), [displayDate]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const eventsByDate = useMemo(()=>{
    const map={};
    events.forEach(ev=>{ (map[ev.date]??=[]).push(ev); });
    Object.keys(map).forEach(k=> map[k].sort((a,b)=> timeToMinutes(a.time)-timeToMinutes(b.time)));
    return map;
  },[events]);

  const openCreate=(dateKey)=>{ setEditing({date:dateKey,time:'09:00',duration:30}); setModalOpen(true); }
  const openEdit=(ev)=>{ setEditing(ev); setModalOpen(true); }

  const save=(ev)=>{ 
    if(ev.id) setEvents(events.map(x=> x.id===ev.id? {...x,...ev}: x)); 
    else { const id=Math.max(0,...events.map(x=>x.id))+1; setEvents([...events,{...ev,id}]); } 
    setModalOpen(false); 
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <div className="grid grid-cols-7 gap-4 text-sm mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="text-center font-medium text-slate-600">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {matrix.flat().map((day,idx)=>{
          const key = format(day,'yyyy-MM-dd');
          const dayEvents = eventsByDate[key] ?? [];
          const currentMonth = isSameMonth(day, displayDate);
          const today = isSameDay(day,new Date());
          return (
            <div key={idx} className={'min-h-[120px] p-3 rounded border ' + (currentMonth? 'bg-white':'bg-slate-50 text-slate-400')}>
              <div className="flex items-center justify-between mb-2">
                <div className={today? 'bg-indigo-600 text-white px-2 py-0.5 rounded-full text-sm':'text-sm font-medium'}>{format(day,'d')}</div>
                <button onClick={()=>openCreate(key)} className="text-xs px-2 py-0.5 border rounded">+ Add</button>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-auto">
                {dayEvents.length===0 && <div className="text-xs text-slate-400">No events</div>}
                {dayEvents.map(ev=>{
                  const conflict = dayEvents.some(o=> o.id!==ev.id && eventsOverlap(ev,o));
                  return <EventItem key={ev.id} ev={ev} conflict={conflict} onClick={openEdit} />;
                })}
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} onSave={save} initial={editing} />
    </div>
  )
}
