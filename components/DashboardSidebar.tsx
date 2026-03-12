import Link from 'next/link';

interface SidebarProps {
  activePath?: string;
}

export function DashboardSidebar({ activePath }: SidebarProps) {
  const links = [
    { href: '/user/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/user/games', label: 'All Games', icon: 'playing_cards' },
    { href: '/user/tournaments', label: 'Tournaments', icon: 'emoji_events' },
    { href: '/historial', label: 'Transactions', icon: 'history' },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#051510] border-r border-white/5">
      <div className="p-8">
        <div className="flex flex-col gap-1">
          <span className="text-primary-emerald font-bold tracking-[0.2em] text-xl">EMERALD</span>
          <span className="text-primary-emerald font-bold tracking-[0.2em] text-xl">CASINO</span>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {links.map((link) => {
          const isActive = activePath === link.href;
          return (
            <Link 
              key={link.label}
              href={link.href} 
              className={`flex items-center gap-3 px-4 py-3 transition-colors group ${
                isActive 
                  ? 'bg-emerald-accent/20 text-primary-emerald border-l-2 border-primary-emerald' 
                  : 'text-slate-400 hover:text-primary-emerald'
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className={`font-medium ${!isActive ? 'group-hover:translate-x-1 transition-transform' : ''}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6">
        <div className="bg-emerald-card/50 rounded-xl p-4 border border-white/5">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">VIP STATUS</p>
          <p className="text-lg font-bold text-gold">PLATINUM</p>
        </div>
      </div>
    </aside>
  );
}
