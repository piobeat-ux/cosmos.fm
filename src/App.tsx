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
import { PodcastDetail } from './pages/PodcastDetail';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
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
              <Route path="/schedule" element={<ScheduleSection />} />
              <Route path="/podcasts" element={<PodcastsSection />} />
              <Route path="/podcast/:id" element={<PodcastDetail />} />
              <Route path="/hosts" element={<HostsSection />} />
              <Route path="/about" element={<AboutSection />} />
            </Routes>
          </main>
          <Footer />
          <AudioPlayer />
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;