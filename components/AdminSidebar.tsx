import Link from 'next/link';

interface AdminSidebarProps {
  activePath?: string;
}

export function AdminSidebar({ activePath }: AdminSidebarProps) {
  const menuItems = [
    { label: 'Operations Hub', icon: 'dashboard', href: '/admin' },
    { label: 'Analytics', icon: 'monitoring', href: '/admin/analytics' },
    { label: 'Financials', icon: 'account_balance', href: '/admin/financials' },
    { label: 'Security Audit', icon: 'security', href: '#' },
  ];

  return (
    <aside className="w-64 bg-[#051611] border-r border-[#D4AF37]/10 flex flex-col z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 bg-gradient-to-br from-[#D4AF37] to-[#AA8E39] rounded-lg flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[#04140F] font-bold">diamond</span>
          </div>
          <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Emerald</h1>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activePath === item.href
                  ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-r-2 border-[#D4AF37] rounded-r-none'
                  : 'text-[#10B981]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-8 border-t border-[#D4AF37]/5">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-10 rounded-full border border-[#D4AF37]/30 p-0.5">
            <div className="h-full w-full rounded-full bg-[#10B981]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#D4AF37] text-xl">person</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-tight">Admin Principal</p>
            <p className="text-[10px] text-[#10B981]/50">System Overseer</p>
          </div>
        </div>
        <Link href="#" className="flex items-center gap-3 px-0 py-3 text-[#10B981]/60 hover:text-[#D4AF37] transition-all">
          <span className="material-symbols-outlined text-sm">settings</span>
          <span className="text-sm font-medium">System Settings</span>
        </Link>
      </div>
    </aside>
  );
}
