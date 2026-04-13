import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function AudioPlayer() {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!settings.streamUrl) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/5 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <audio ref={audioRef} src={settings.streamUrl} />

        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-[#6366f1] text-white flex items-center justify-center hover:bg-[#6366f1]/80 transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <div>
            <p className="font-medium text-white">Сейчас в эфире</p>
            <p className="text-sm text-white/60">{settings.siteName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="p-2 text-white/70 hover:text-white">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-[#6366f1]"
          />
        </div>
      </div>
    </div>
  );
}