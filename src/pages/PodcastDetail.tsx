import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Clock, Calendar, ArrowLeft, Headphones } from 'lucide-react';
import { podcastsAPI } from '../api/client';

interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  publishedAt: string;
}

interface Podcast {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  host: string;
  episodes: Episode[];
}

export function PodcastDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadPodcast();
  }, [id]);

  const loadPodcast = async () => {
    try {
      const data = await podcastsAPI.getById(id!);
      setPodcast(data);
    } catch (error) {
      console.error('Failed to load podcast:', error);
    } finally {
      setLoading(false);
    }
  };

  const playEpisode = (episode: Episode) => {
    if (currentEpisode?.id === episode.id) {
      if (isPlaying) {
        audio?.pause();
        setIsPlaying(false);
      } else {
        audio?.play();
        setIsPlaying(true);
      }
    } else {
      audio?.pause();
      const newAudio = new Audio(episode.audioUrl);
      newAudio.play();
      setAudio(newAudio);
      setCurrentEpisode(episode);
      setIsPlaying(true);
      
      newAudio.onended = () => setIsPlaying(false);
      newAudio.onerror = () => {
        setIsPlaying(false);
        alert('Ошибка воспроизведения');
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Подкаст не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Назад
          </button>
        </div>
      </div>

      {/* Podcast Info */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex gap-6">
            <img
              src={podcast.coverImage}
              alt={podcast.title}
              className="w-48 h-48 rounded-lg object-cover shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{podcast.title}</h1>
              <p className="text-gray-600 mb-4">{podcast.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Headphones size={16} />
                  {podcast.episodes.length} эпизодов
                </span>
                <span>Ведущий: {podcast.host}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6">Все эпизоды</h2>
        <div className="space-y-4">
          {podcast.episodes.map((episode, index) => (
            <div
              key={episode.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{episode.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{episode.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {episode.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(episode.publishedAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => playEpisode(episode)}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    currentEpisode?.id === episode.id && isPlaying
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {currentEpisode?.id === episode.id && isPlaying ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Player for Episode */}
      {currentEpisode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={() => playEpisode(currentEpisode)}
              className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="flex-1">
              <p className="font-medium text-sm">{currentEpisode.title}</p>
              <p className="text-xs text-gray-500">{podcast.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}