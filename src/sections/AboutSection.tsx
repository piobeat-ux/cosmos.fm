import { useSettings } from '../context/SettingsContext';
import { Info } from 'lucide-react';

export function AboutSection() {
  const { settings } = useSettings();

  return (
    <section id="about" className="py-24 bg-[#0a0a0f]">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-500">О нас</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            О {settings.siteName}
          </h2>
          <p className="text-lg text-white/60">
            {settings.siteDescription} — мы работаем 24/7, чтобы радовать вас лучшей музыкой и интересными передачами.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <p className="text-white/60">Круглосуточное вещание</p>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-white mb-2">100+</div>
            <p className="text-white/60">Эксклюзивных подкастов</p>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-white mb-2">10+</div>
            <p className="text-white/60">Профессиональных ведущих</p>
          </div>
        </div>
      </div>
    </section>
  );
}