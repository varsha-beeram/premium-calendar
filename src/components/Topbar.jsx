import React from 'react';
export default function Topbar(){
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <input placeholder="Search..." className="px-3 py-2 border rounded-lg w-80 text-sm" />
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">+ Add Event</button>
            <button className="px-3 py-2 rounded-lg border text-sm">Import</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">Nov 2025</div>
          <div className="flex items-center gap-3">
            <img src="" alt="avatar" className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="text-sm">Varsha B</div>
          </div>
        </div>
      </div>
    </header>
  )
}
