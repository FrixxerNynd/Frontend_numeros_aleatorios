import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-dark font-sans text-white p-6">
      <div className="max-w-md w-full space-y-12 text-center">
        {/* Logo Section */}
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-col gap-1">
            <span className="text-primary-emerald font-bold tracking-[0.3em] text-4xl">EMERALD</span>
            <span className="text-primary-emerald font-bold tracking-[0.3em] text-4xl">CASINO</span>
          </div>
          <div className="h-1 w-24 bg-gold rounded-full mt-4"></div>
        </div>

        {/* Selection Card */}
        <div className="bg-emerald-card p-10 rounded-3xl glow-card border border-white/5 space-y-8">
          <h1 className="font-serif text-3xl text-gold">Welcome to Emerald</h1>
          <p className="text-slate-400 text-sm">Select your interface to continue</p>
          
          <div className="flex flex-col gap-4">
            <Link 
              href="/user/dashboard" 
              className="bg-white/5 gold-hover text-white font-bold py-4 rounded-xl text-lg border border-white/10 flex items-center justify-center gap-3 active:scale-95 group"
            >
              <span className="material-symbols-outlined group-hover:text-emerald-dark transition-colors">person</span>
              USER VIEW
            </Link>
            
            <Link 
              href="/admin" 
              className="bg-white/5 gold-hover text-white font-bold py-4 rounded-xl text-lg border border-white/10 flex items-center justify-center gap-3 active:scale-95 group"
            >
              <span className="material-symbols-outlined group-hover:text-emerald-dark transition-colors">admin_panel_settings</span>
              ADMIN VIEW
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-slate-500 text-[10px] uppercase tracking-widest pt-8">
          Authorized Operative Interface · 2026
        </div>
      </div>
    </div>
  );
}
