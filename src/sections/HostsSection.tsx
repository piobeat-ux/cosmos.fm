import { useState, useEffect } from 'react';
import { hostsAPI } from '../api/client';
import { Users, Mic } from 'lucide-react';

export function HostsSection() {
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hostsAPI.getAll()
      .then(data => {
        setHosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки ведущих:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="hosts" className="py-24 bg-[#0a0a0f]">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="animate-pulse text-white/60 text-center">Загрузка ведущих...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="hosts" className="py-24 bg-[#0a0a0f]">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">Ведущие</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Наши ведущие
          </h2>
          <p className="text-lg text-white/60">
            Профессионалы, которые создают атмосферу Cosmos FM
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hosts.map((host: any) => (
            <div key={host.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-green-500/30 transition-all text-center">
              <div className="mb-4">
                {host.image ? (
                  <img src={host.image} alt={host.name} className="w-24 h-24 rounded-full object-cover mx-auto" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                    <Users className="w-12 h-12 text-green-500" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-white text-xl mb-1">{host.name}</h3>
              <p className="text-green-400 text-sm mb-3">{host.role}</p>
              <p className="text-white/60 text-sm mb-4">{host.bio}</p>
              {host.shows && host.shows.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1">
                  {host.shows.map((show: string, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded-full text-xs text-white/60">
                      <Mic className="w-3 h-3" /> {show}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}