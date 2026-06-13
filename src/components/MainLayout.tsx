import React, {type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home, Star, TrendingUp, Calendar } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 min-h-[850px] flex">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-100 p-6 flex flex-col justify-between bg-white shrink-0">
          <div>
            <Link to="/" className="flex items-center gap-2.5 text-blue-600 font-bold text-xl mb-8 px-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                </svg>
              </div>
              <span>MovieHub</span>
            </Link>

            <nav className="space-y-1.5">
              <Link to="/" className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-xl bg-blue-600 text-white transition-all">
                <Home className="w-4 h-4" /> Home
              </Link>
              <button className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
                <Star className="w-4 h-4" /> Popular
              </button>
              <button className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
                <TrendingUp className="w-4 h-4" /> Top Rated
              </button>
              <button className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
                <Calendar className="w-4 h-4" /> Upcoming
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto max-h-225 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}