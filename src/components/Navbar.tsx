import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Radio } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();

  const navLinks = [
    { name: 'Эфир', href: '#home' },
    { name: 'Расписание', href: '#schedule' },
    { name: 'Подкасты', href: '#podcasts' },
    { name: 'Ведущие', href: '#hosts' },
    { name: 'О нас', href: '#about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Radio className="w-8 h-8 text-[#6366f1]" />
            <span className="text-xl font-bold text-white">
              {settings.siteName}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}