import { useState, useEffect } from 'react';
import { podcastsAPI } from '../api/client';
import { Headphones, Play, Clock, User } from 'lucide-react';

export function PodcastsSection() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    podcastsAPI.getAll()
      .then(data => {
        setPodcasts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки подкастов:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="podcasts" className="py-24 bg-[#0a0a0f]">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="animate-pulse text-white/60 text-center">Загрузка подкастов...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="podcasts" className="py-24 bg-[#0a0a0f]">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Headphones className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-purple-500">Подкасты</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Популярные подкасты
          </h2>
          <p className="text-lg text-white/60">
            Слушайте эксклюзивные подкасты от ведущих Cosmos FM
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast: any) => (
            <div key={podcast.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="flex items-start gap-4">
                {podcast.image ? (
                  <img src={podcast.image} alt={podcast.title} className="w-20 h-20 rounded-xl object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Headphones className="w-10 h-10 text-purple-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">{podcast.title}</h3>
                  <p className="text-white/60 text-sm mb-3">{podcast.description}</p>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {podcast.host}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {podcast.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm text-purple-400">{podcast.episodes} выпусков</span>
                <button className="p-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}