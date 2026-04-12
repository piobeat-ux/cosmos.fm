import { useState } from 'react';
import { AudioProvider } from '@/context/AudioContext';
import { Header } from '@/components/Header';
import { MiniPlayer } from '@/components/MiniPlayer';
import { BottomNav } from '@/components/BottomNav';
import { HomeSection } from '@/sections/HomeSection';
import { ScheduleSection } from '@/sections/ScheduleSection';
import { HostsSection } from '@/sections/HostsSection';
import { PodcastsSection } from '@/sections/PodcastsSection';
import { AboutSection } from '@/sections/AboutSection';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection />;
      case 'schedule':
        return <ScheduleSection />;
      case 'hosts':
        return <HostsSection />;
      case 'podcasts':
        return <PodcastsSection />;
      case 'about':
        return <AboutSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <Header onTabChange={setActiveTab} activeTab={activeTab} />

      {/* Main Content */}
      <main className="pt-20 pb-32 section-padding max-w-6xl mx-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Mini Player */}
      <MiniPlayer />
    </div>
  );
}

function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}

export default App;
