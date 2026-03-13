import React from 'react';

interface Activity {
  title: string;
  type: string;
  date: string;
  chips: number;
  status: 'Success' | 'Pending';
}

const typeColors: Record<string, string> = {
  GAMING: 'bg-green-700 text-green-300',
  WALLET: 'bg-yellow-700 text-yellow-300',
  'ENTRY FEE': 'bg-red-700 text-red-300',
  PROMO: 'bg-yellow-900 text-yellow-400',
};

export default function ActivityList({ activities }: { activities: Activity[] }) {
  return (
    <section className="bg-green-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-green-300 text-lg font-semibold">Recent Activity</div>
        <button className="text-green-400 font-bold">View All History</button>
      </div>
      <ul>
        {activities.map((a, idx) => (
          <li key={idx} className="flex justify-between items-center py-2 border-b border-green-900 last:border-none">
            <div>
              <div className="font-semibold text-white">{a.title} <span className={`ml-2 px-2 py-1 rounded text-xs ${typeColors[a.type]}`}>{a.type}</span></div>
              <div className="text-green-200 text-xs">{a.date}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${a.chips > 0 ? 'text-green-400' : 'text-yellow-400'}`}>{a.chips > 0 ? '+' : '-'} {Math.abs(a.chips)} CHIPS</span>
              <span className={`text-xs ${a.status === 'Success' ? 'text-green-300' : 'text-yellow-300'}`}>{a.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
