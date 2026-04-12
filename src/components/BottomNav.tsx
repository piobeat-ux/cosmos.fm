import { Home, Calendar, Mic2, Headphones, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Эфир', icon: Home },
  { id: 'schedule', label: 'Расписание', icon: Calendar },
  { id: 'hosts', label: 'Ведущие', icon: Mic2 },
  { id: 'podcasts', label: 'Подкасты', icon: Headphones },
  { id: 'about', label: 'О нас', icon: User },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-[80px] left-0 right-0 z-40 glass-player border-t border-[#27273a]/50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-[#6366f1]/20' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
