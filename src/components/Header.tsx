import { useState } from 'react';
import { Radio, Menu, X, Bell, Search } from 'lucide-react';

interface HeaderProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

const navItems = [
  { id: 'home', label: 'Эфир' },
  { id: 'schedule', label: 'Расписание' },
  { id: 'hosts', label: 'Ведущие' },
  { id: 'podcasts', label: 'Подкасты' },
  { id: 'about', label: 'О нас' },
];

export function Header({ onTabChange, activeTab }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-player">
      <div className="section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">Cosmos FM</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-[#6366f1]/20 text-[#6366f1]'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#13131f]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-[#13131f] transition-colors">
              <Search className="w-5 h-5 text-[#71717a]" />
            </button>
            <button className="p-2 rounded-xl hover:bg-[#13131f] transition-colors relative">
              <Bell className="w-5 h-5 text-[#71717a]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ef4444]" />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-[#13131f] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-[#71717a]" />
              ) : (
                <Menu className="w-5 h-5 text-[#71717a]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-player border-t border-[#27273a]/50">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-[#6366f1]/20 text-[#6366f1]'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#13131f]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
