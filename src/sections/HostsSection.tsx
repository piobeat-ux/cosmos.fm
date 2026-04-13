import { useState, useEffect } from 'react';
import { hostsAPI } from '@/api/client';
import { User, Mic } from 'lucide-react';

export function HostsSection() {
  const [hosts, setHosts] = useState([]);
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
    return <div className="animate-pulse text-[#71717a]">Загрузка ведущих...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Наши ведущие</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hosts.map((host: any) => (
          <div key={host.id} className="bg-[#13131f] rounded-2xl p-6 border border-[#27273a] hover:border-[#6366f1]/30 transition-all">
            <div className="w-16 h-16 rounded-full bg-[#6366f1]/20 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-[#6366f1]" />
            </div>
            <h3 className="font-bold text-lg">{host.name}</h3>
            <p className="text-[#6366f1] text-sm mb-2">{host.role}</p>
            <p className="text-[#71717a] text-sm mb-4">{host.bio}</p>
            <div className="flex items-center gap-2 text-sm text-[#71717a]">
              <Mic className="w-4 h-4" />
              <span>{host.shows?.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}