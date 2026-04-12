const API_URL = 'https://cosmosfm-production.up.railway.app/api';

async function getShows() {
  const res = await fetch(`${API_URL}/shows`);
  return res.json();
}

async function getCurrentShow() {
  const res = await fetch(`${API_URL}/shows/current`);
  return res.json();
}

async function getPodcasts() {
  const res = await fetch(`${API_URL}/podcasts`);
  return res.json();
}

// Функция для отображения передач на сайте
async function loadShowsToPage() {
  try {
    const shows = await getShows();
    const container = document.getElementById('shows-container');
    
    if (!container) {
      console.log('Контейнер shows-container не найден');
      return;
    }
    
    container.innerHTML = shows.map(show => `
      <div class="show-card">
        <h3>${show.title}</h3>
        <p>${show.host} • ${show.time}</p>
        <span class="category">${show.category}</span>
        ${show.isLive ? '<span class="live-badge">LIVE</span>' : ''}
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Ошибка загрузки передач:', error);
  }
}

// Функция для отображения подкастов
async function loadPodcastsToPage() {
  try {
    const podcasts = await getPodcasts();
    const container = document.getElementById('podcasts-container');
    
    if (!container) {
      console.log('Контейнер podcasts-container не найден');
      return;
    }
    
    container.innerHTML = podcasts.map(podcast => `
      <div class="podcast-card">
        <h3>${podcast.title}</h3>
        <p>${podcast.host}</p>
        <span>${podcast.episodes} выпусков • ${podcast.duration}</span>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Ошибка загрузки подкастов:', error);
  }
}

// Функция для отображения текущего эфира
async function loadCurrentShow() {
  try {
    const show = await getCurrentShow();
    const container = document.getElementById('current-show');
    
    if (!container) {
      console.log('Контейнер current-show не найден');
      return;
    }
    
    container.innerHTML = `
      <h2>${show.title}</h2>
      <p>С ${show.host} • ${show.location || 'Отель Cosmos Moscow'}</p>
      ${show.isLive ? '<span class="live-badge">LIVE</span>' : ''}
    `;
    
  } catch (error) {
    console.error('Ошибка загрузки текущего эфира:', error);
  }
}

// Загрузить всё при открытии страницы
document.addEventListener('DOMContentLoaded', () => {
  loadCurrentShow();
  loadShowsToPage();
  loadPodcastsToPage();
});