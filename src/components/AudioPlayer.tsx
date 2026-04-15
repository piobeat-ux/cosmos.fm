import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function AudioPlayer() {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Auto-play when stream URL is available
    if (settings.streamUrl && audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = settings.streamUrl;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
        .finally(() => setIsLoading(false));
    }
  }, [settings.streamUrl]);

  const togglePlay = async () => {
    if (!audioRef.current || !settings.streamUrl) return;

    try {
      setIsLoading(true);
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (err) {
      setError('Не удалось воспроизвести поток');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  if (!settings.streamUrl) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <audio
        ref={audioRef}
        src={settings.streamUrl}
        preload="none"
        onError={() => setError('Ошибка подключения к потоку')}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Radio size={16} className={isPlaying ? 'text-red-500 animate-pulse' : 'text-gray-400'} />
            <span className="text-sm font-medium text-gray-900 truncate">
              {isPlaying ? '🔴 В эфире' : 'Остановлено'}
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900 truncate">
            {settings.siteName}
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}