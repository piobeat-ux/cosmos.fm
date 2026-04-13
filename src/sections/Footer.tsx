import { useSettings } from '../context/SettingsContext';
import { Radio, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-6 h-6 text-[#6366f1]" />
              <span className="text-lg font-bold text-white">{settings.siteName}</span>
            </div>
            <p className="text-white/60 text-sm">{settings.siteDescription}</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-medium mb-4">Контакты</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              {settings.contactEmail && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.contactPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-white">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.contactAddress && (
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{settings.contactAddress}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-medium mb-4">Соцсети</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              {settings.social?.facebook && (
                <li><a href={settings.social.facebook} target="_blank" rel="noopener" className="hover:text-white">Facebook</a></li>
              )}
              {settings.social?.instagram && (
                <li><a href={settings.social.instagram} target="_blank" rel="noopener" className="hover:text-white">Instagram</a></li>
              )}
              {settings.social?.telegram && (
                <li><a href={settings.social.telegram} target="_blank" rel="noopener" className="hover:text-white">Telegram</a></li>
              )}
              {settings.social?.youtube && (
                <li><a href={settings.social.youtube} target="_blank" rel="noopener" className="hover:text-white">YouTube</a></li>
              )}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Навигация</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="#home" className="hover:text-white">Эфир</a></li>
              <li><a href="#schedule" className="hover:text-white">Расписание</a></li>
              <li><a href="#podcasts" className="hover:text-white">Подкасты</a></li>
              <li><a href="#hosts" className="hover:text-white">Ведущие</a></li>
              <li><a href="#about" className="hover:text-white">О нас</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-white/40 text-sm">
          © {year} {settings.siteName}. Все права защищены.
        </div>
      </div>
    </footer>
  );
}