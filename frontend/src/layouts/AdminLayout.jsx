import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CarFront, Users, FileText, Settings, LogOut, Menu } from 'lucide-react';

function AdminLayout() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Fleet Management', href: '/admin/fleet', icon: CarFront },
    { name: 'Bookings', href: '/admin/bookings', icon: FileText },
    { name: 'Leads', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1c3a59] text-white hidden md:flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-widest text-white mb-1">SANCARS</span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#c88349]">ADMIN PANEL</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#c88349] text-white font-bold' 
                    : 'text-gray-300 hover:bg-[#2a4d70] hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2a4d70]">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#2a4d70] hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-gray-300 hover:bg-[#2a4d70] hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#1c3a59]">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-[#1c3a59]">
              {navigation.find(n => n.href === location.pathname)?.name || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#c88349] flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
