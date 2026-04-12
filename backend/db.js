const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

let memoryStore = {
  shows: [
    { id: '1', title: 'Утренний кофе', host: 'Анна Петрова', time: '10:00', category: 'Утреннее шоу', isLive: true, location: 'Отель Cosmos Moscow' },
    { id: '2', title: 'Обеденный перерыв', host: 'Михаил Соколов', time: '12:00', category: 'Музыка', isLive: false, location: 'Студия 2' },
    { id: '3', title: 'Кофе-брейк', host: 'Елена Волкова', time: '15:00', category: 'Разговорное', isLive: false, location: 'Студия 1' }
  ],
  podcasts: [
    { id: '1', title: 'Истории отелей', host: 'Анна Петрова', episodes: 24, duration: '45 мин', description: 'Истории о лучших отелях мира' },
    { id: '2', title: 'Секреты консьержа', host: 'Михаил Соколов', episodes: 18, duration: '30 мин', description: 'Секреты от профессионалов' },
    { id: '3', title: 'Кухня шеф-повара', host: 'Елена Волкова', episodes: 32, duration: '60 мин', description: 'Кулинарные секреты' }
  ]
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      memoryStore = { ...memoryStore, ...data };
      console.log('✅ Данные загружены из файла');
    } else {
      console.log('📁 Создан новый файл данных');
      saveData();
    }
  } catch (err) {
    console.log('⚠️ Ошибка загрузки:', err.message);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2));
  } catch (err) {
    console.log('⚠️ Ошибка сохранения:', err.message);
  }
}

function getShows() {
  return memoryStore.shows;
}

function getPodcasts() {
  return memoryStore.podcasts;
}

function updateShows(shows) {
  memoryStore.shows = shows;
  saveData();
}

function updatePods(podcasts) {
  memoryStore.podcasts = podcasts;
  saveData();
}

module.exports = { 
  loadData, 
  getShows, 
  getPodcasts, 
  updateShows, 
  updatePods 
};