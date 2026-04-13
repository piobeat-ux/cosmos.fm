import { useState, useEffect } from 'react';
import { podcastsAPI } from '@/api/client';
import { Headphones, Play, Clock, User } from 'lucide-react';

export function PodcastsSection() {
  const [podcasts, setPodcasts] = useState([]);
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
    return <div className="animate-pulse text-[#71717a]">Загрузка подкастов...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Подкасты</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {podcasts.map((podcast: any) => (
          <div key={podcast.id} className="bg-[#13131f] rounded-2xl p-6 border border-[#27273a] hover:border-[#6366f1]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#6366f1]/20 flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6 text-[#6366f1]" />
            </div>
            <h3 className="font-bold text-lg mb-2">{podcast.title}</h3>
            <p className="text-[#71717a] text-sm mb-4">{podcast.description}</p>
            <div className="flex items-center gap-4 text-sm text-[#71717a]">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {podcast.host}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {podcast.duration}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-[#6366f1]">{podcast.episodes} выпусков</span>
              <button className="p-2 rounded-xl bg-[#6366f1]/20 hover:bg-[#6366f1]/30 transition-colors">
                <Play className="w-4 h-4 text-[#6366f1]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}