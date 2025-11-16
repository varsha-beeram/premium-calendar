import React from 'react';
export default function Sidebar(){
  const items = ['Dashboard','Accounts','Contacts','Calendar','Cases','Activities','Users'];
  return (
    <aside className="w-64 bg-white h-screen border-r">
      <div className="px-6 py-5 flex items-center gap-3 border-b">
        <div className="rounded-full bg-indigo-600 w-10 h-10 flex items-center justify-center text-white font-bold">CR</div>
        <div>
          <div className="text-lg font-semibold">CRMHUB</div>
          <div className="text-xs text-slate-500">Team Workspace</div>
        </div>
      </div>
      <nav className="px-4 py-6">
        {items.map((it)=>(
          <div key={it} className={'flex items-center gap-3 px-3 py-2 rounded-md mb-1 cursor-pointer ' + (it==='Calendar' ? 'bg-indigo-50 text-indigo-700':'text-slate-700 hover:bg-slate-50')}>
            <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-500">{it[0]}</div>
            <div className="text-sm">{it}</div>
          </div>
        ))}
      </nav>
      <div className="px-4 mt-auto py-6">
        <div className="text-xs text-slate-500 mb-2">Plan</div>
        <div className="text-sm font-medium">Pro • <span className="text-slate-500">Renewal: 01 Jun</span></div>
      </div>
    </aside>
  )
}
