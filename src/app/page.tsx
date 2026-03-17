import { ArrowRight, CircleDot, Layers } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const games = [
    {
      id: "roulette",
      name: "Rueta Premium",
      description: "Prueba tu suerte con el motor de generación cuántica.",
      icon: <CircleDot className="w-8 h-8 text-red-500" />,
      color: "from-red-500/20 to-orange-500/20",
      path: "/roulette"
    },
    {
      id: "blackjack",
      name: "Blackjack Royale",
      description: "Duelo de cartas contra el Dealer. Estrategia y riesgo.",
      icon: <Layers className="w-8 h-8 text-blue-500" />,
      color: "from-blue-500/20 to-indigo-500/20",
      path: "/blackjack"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-16">
        <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40 leading-tight">
          ELIGE TU DESAFÍO
        </h1>
        <p className="text-white/40 text-lg max-w-2xl font-light">
          Explora nuestra selección de juegos optimizados para ofrecer la mejor experiencia visual y justicia algorítmica.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {games.map((game) => (
          <Link 
            key={game.id} 
            href={game.path}
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${game.color} p-8 hover:border-indigo-500/50 transition-all duration-500 hover:scale-[1.02]`}
          >
            <div className="relative z-10">
              <div className="mb-6 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                {game.icon}
              </div>
              <h2 className="text-3xl font-bold mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                {game.name}
              </h2>
              <p className="text-white/40 group-hover:text-white/60 transition-colors mb-8 text-lg font-light leading-relaxed">
                {game.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-indigo-400">
                Jugar Ahora <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
            
            {/* Ambient Background Effect */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
