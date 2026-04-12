import { Play, Clock, Calendar, ChevronRight, Radio, Heart, Share2 } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const upcomingShows = [
  { time: '10:00', title: 'Доброе утро, Cosmos!', host: 'Анна Петрова', category: 'Утреннее шоу' },
  { time: '12:00', title: 'Обеденный перерыв', host: 'Михаил Соколов', category: 'Музыка' },
  { time: '15:00', title: 'Кофе-брейк', host: 'Елена Волкова', category: 'Разговорное' },
];

const popularPodcasts = [
  { title: 'Истории отелей', episodes: 24, duration: '45 мин' },
  { title: 'Секреты консьержа', episodes: 18, duration: '30 мин' },
  { title: 'Кухня шеф-повара', episodes: 32, duration: '60 мин' },
];

const categories = [
  { name: 'Музыка', count: 156 },
  { name: 'Новости', count: 48 },
  { name: 'Развлечения', count: 72 },
  { name: 'Обучение', count: 34 },
];

export function HomeSection() {
  const { isPlaying, togglePlay } = useAudio();

  return (
    <div className="space-y-8">
      {/* Hero - Now Playing */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/30 via-[#8b5cf6]/20 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        
        <div className="relative section-padding py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Cover */}
            <div className="relative">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center animate-pulse-glow">
                <Radio className="w-24 h-24 text-white" />
              </div>
              <div className="absolute -bottom-3 -right-3 px-4 py-2 rounded-full bg-[#ef4444] text-white text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <p className="text-[#a1a1aa] mb-2">Сейчас в эфире</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Утренний кофе</h1>
              <p className="text-[#71717a] mb-6">С Анной Петровой • Отель Cosmos Moscow</p>
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-5 bg-[#0a0a0f] rounded-full" />
                      <div className="w-1.5 h-5 bg-[#0a0a0f] rounded-full" />
                    </div>
                  ) : (
                    <Play className="w-6 h-6 text-[#0a0a0f] ml-1" />
                  )}
                </button>
                
                <button className="p-3 rounded-full bg-[#13131f] hover:bg-[#1e1e2e] transition-colors">
                  <Heart className="w-5 h-5 text-[#71717a]" />
                </button>
                <button className="p-3 rounded-full bg-[#13131f] hover:bg-[#1e1e2e] transition-colors">
                  <Share2 className="w-5 h-5 text-[#71717a]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-xl font-bold mb-4">Категории</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="flex-shrink-0 px-5 py-3 rounded-xl bg-[#13131f] border border-[#27273a] hover:border-[#6366f1]/50 transition-colors text-left"
            >
              <div className="font-medium">{cat.name}</div>
              <div className="text-xs text-[#71717a]">{cat.count} передач</div>
            </button>
          ))}
        </div>
      </section>

      {/* Upcoming Shows */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Ближайшие передачи</h2>
          <button className="flex items-center gap-1 text-sm text-[#6366f1] hover:underline">
            Все <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {upcomingShows.map((show, index) => (
            <div
              key={index}
              className="show-card flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-14 text-center">
                <Clock className="w-5 h-5 text-[#6366f1] mx-auto mb-1" />
                <span className="text-sm font-medium">{show.time}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{show.title}</h3>
                <p className="text-sm text-[#71717a]">{show.host}</p>
              </div>
              
              <span className="category-badge bg-[#6366f1]/10 text-[#6366f1] hidden sm:inline">
                {show.category}
              </span>
              
              <button className="p-2 rounded-xl hover:bg-[#1e1e2e] transition-colors">
                <Calendar className="w-5 h-5 text-[#71717a]" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Podcasts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Популярные подкасты</h2>
          <button className="flex items-center gap-1 text-sm text-[#6366f1] hover:underline">
            Все <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularPodcasts.map((podcast, index) => (
            <div
              key={index}
              className="show-card"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center mb-3">
                <Play className="w-5 h-5 text-white ml-0.5" />
              </div>
              <h3 className="font-medium mb-1">{podcast.title}</h3>
              <div className="flex items-center gap-3 text-xs text-[#71717a]">
                <span>{podcast.episodes} выпусков</span>
                <span>•</span>
                <span>{podcast.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
