import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { HomeSection } from './sections/HomeSection';
import { ScheduleSection } from './sections/ScheduleSection';
import { PodcastsSection } from './sections/PodcastsSection';
import { HostsSection } from './sections/HostsSection';
import { AboutSection } from './sections/AboutSection';
import { Footer } from './sections/Footer';
import { Navbar } from './components/Navbar';
import { AudioPlayer } from './components/AudioPlayer';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0a0a0f] text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <HomeSection />
                <ScheduleSection />
                <PodcastsSection />
                <HostsSection />
                <AboutSection />
              </>
            } />
          </Routes>
          <Footer />
          <AudioPlayer />
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;