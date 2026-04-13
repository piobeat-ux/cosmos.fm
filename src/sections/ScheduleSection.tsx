import { useState, useEffect } from 'react';
import { Clock, User, Play, Calendar, Bell } from 'lucide-react';

const API_URL = 'https://cosmosfm-production.up.railway.app/api';

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const fullDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

const categoryColors: Record<string, string> = {
  'Утреннее шоу': 'bg-[#f59e0b]/20 text-[#f59e0b]',
  'Новости': 'bg-[#3b82f6]/20 text-[#3b82f6]',
  'Музыка': 'bg-[#8b5cf6]/20 text-[#8b5cf6]',
  'Разговорное': 'bg-[#22c55e]/20 text-[#22c55e]',
  'Бизнес': 'bg-[#06b6d4]/20 text-[#06b6d4]',
  'Обучение': 'bg-[#ec4899]/20 text-[#ec4899]',
  'Кулинария': 'bg-[#f97316]/20 text-[#f97316]',
  'Подкаст': 'bg-[#6366f1]/20 text-[#6366f1]',
  'Развлечения': 'bg-[#ef4444]/20 text-[#ef4444]',
  'Обзор': 'bg-[#14b8a6]/20 text-[#14b8a6]',
};

export function ScheduleSection() {
  const [activeDay, setActiveDay] = useState('Пн');
  const [schedule, setSchedule] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const today = 'Пн';

  // Загрузка данных из API
  useEffect(() => {
    fetch(`${API_URL}/shows`)
      .then(r => r.json())
      .then(data => {
        // Преобразуем данные API в формат расписания по дням
        const newSchedule: Record<string, any[]> = {};
        
        days.forEach((day, index) => {
          const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          const dayKey = dayKeys[index];
          
          newSchedule[day] = data
            .filter((show: any) => {
              if (show.dayOfWeek) {
                return show.dayOfWeek.includes(dayKey) || show.dayOfWeek.includes('daily');
              }
              return true;
            })
            .map((show: any) => ({
              time: show.time || '10:00',
              title: show.title,
              host: show.host,
              category: show.category,
              duration: show.duration ? `${show.duration} мин` : '60 мин'
            }));
        });
        
        setSchedule(newSchedule);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки:', err);
        setLoading(false);
      });
  }, []);

  const currentSchedule = schedule[activeDay] || [];

  if (loading) {
    return (
      <div className="py-24 bg-[#0a0a0f]">
        <div className="section-padding max-w-7xl mx-auto text-center">
          <div className="animate-pulse text-white/60">Загрузка расписания...</div>
        </div>
      </div>
    );
  }

  return (
    <section id="schedule" className="py-24 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6366f1]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#22c55e]/5 rounded-full blur-3xl" />
      </div>

      <div className="section-padding max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 mb-6">
            <Calendar className="w-4 h-4 text-[#6366f1]" />
            <span className="text-sm text-[#6366f1]">Расписание</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Программа передач
          </h2>
          <p className="text-lg text-white/60">
            Слушайте любимые шоу в прямом эфире или в записи
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeDay === day
                  ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule Grid */}
        <div className="grid gap-4">
          {currentSchedule.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-[#6366f1]/30"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                {/* Time */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{item.time}</div>
                    <div className="text-sm text-white/40">{item.duration}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#6366f1] transition-colors">
                      {item.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[item.category] || 'bg-white/10 text-white/60'}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{item.host}</span>
                  </div>
                </div>

                {/* Action */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366f1]/10 text-[#6366f1] hover:bg-[#6366f1] hover:text-white transition-all duration-300">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Слушать</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/10">
            <Bell className="w-5 h-5" />
            <span>Получать уведомления о начале эфиров</span>
          </button>
        </div>
      </div>
    </section>
  );
}