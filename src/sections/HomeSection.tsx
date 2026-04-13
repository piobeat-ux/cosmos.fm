import { useSettings } from '../context/SettingsContext';
import { Play, Radio } from 'lucide-react';

export function HomeSection() {
  const { settings } = useSettings();

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16">
      <div className="section-padding max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 mb-8">
          <Radio className="w-4 h-4 text-[#22c55e]" />
          <span className="text-sm text-[#22c55e]">LIVE</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          {settings.siteName}
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12">
          {settings.siteDescription}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#schedule"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6366f1] text-white rounded-xl font-medium hover:bg-[#6366f1]/80 transition-colors"
          >
            <Play className="w-5 h-5" />
            Слушать эфир
          </a>
          <a
            href="#podcasts"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white rounded-xl font-medium border border-white/10 hover:bg-white/10 transition-colors"
          >
            Смотреть подкасты
          </a>
        </div>
      </div>
    </section>
  );
}