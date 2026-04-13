require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

// ВАЖНО: CORS должен быть до всех маршрутов
app.use(cors());
app.use(express.json());

// Используем постоянное хранилище Railway если доступно
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH 
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'cosmos-data')
  : __dirname;

const DATA_FILE = path.join(DATA_DIR, 'data.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

console.log('📁 Data directory:', DATA_DIR);
console.log('📁 Data file:', DATA_FILE);
console.log('📁 Uploads directory:', UPLOADS_DIR);

// Создаём папки если их нет
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('✅ Created data directory');
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Если data.json не существует — создаём с начальными данными
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    shows: [
      { id: '1', title: 'Утренний кофе', host: 'Анна Петрова', time: '10:00', category: 'Утреннее шоу', isLive: true, location: 'Отель Cosmos Moscow', dayOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], duration: '60 мин' },
      { id: '2', title: 'Обеденный перерыв', host: 'Михаил Соколов', time: '12:00', category: 'Музыка', isLive: false, location: 'Студия 2', dayOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], duration: '60 мин' },
      { id: '3', title: 'Кофе-брейк', host: 'Елена Волкова', time: '15:00', category: 'Разговорное', isLive: false, location: 'Студия 1', dayOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], duration: '30 мин' },
    ],
    podcasts: [
      { id: '1', title: 'Истории отелей', host: 'Анна Петрова', episodes: 24, duration: '45 мин', description: 'Истории о лучших отелях мира', image: '' },
      { id: '2', title: 'Секреты консьержа', host: 'Михаил Соколов', episodes: 18, duration: '30 мин', description: 'Секреты от профессионалов', image: '' },
      { id: '3', title: 'Кухня шеф-повара', host: 'Елена Волкова', episodes: 32, duration: '60 мин', description: 'Кулинарные секреты', image: '' },
    ],
    hosts: [
      { id: '1', name: 'Анна Петрова', role: 'Ведущая утреннего шоу', bio: 'Журналист с 10-летним опытом в hospitality', image: '', shows: ['Утренний кофе'] },
      { id: '2', name: 'Михаил Соколов', role: 'Музыкальный редактор', bio: 'DJ и музыкальный продюсер', image: '', shows: ['Обеденный перерыв'] },
      { id: '3', name: 'Елена Волкова', role: 'Ведущая разговорных программ', bio: 'Психолог и коуч', image: '', shows: ['Кофе-брейк'] },
    ],
    pages: {},
    settings: {
      siteName: 'Cosmos FM',
      siteDescription: 'Официальное радио отеля Cosmos Moscow',
      streamUrl: '',
      contactEmail: '',
      contactPhone: '',
      contactAddress: '',
      social: { vk: '', telegram: '', mave: '' },
      seo: { title: 'Cosmos FM — Радио отеля Cosmos', description: 'Слушайте любимые шоу, подкасты и музыку 24/7', keywords: 'радио, отель, cosmos, музыка, подкасты' },
    },
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  console.log('✅ Created initial data.json');
}

// Раздача статических файлов из папки uploads
app.use('/uploads', express.static(UPLOADS_DIR));
console.log('✅ Static files served from /uploads');

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = allowedTypes.test(file.mimetype) && allowedTypes.test(ext);
    if (mime) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Чтение данных
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Ошибка чтения data.json:', err);
    return { shows: [], podcasts: [], hosts: [], pages: {}, settings: {} };
  }
}

// Запись данных
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Ошибка записи data.json:', err);
    return false;
  }
}

// ========== ЗАГРУЗКА ИЗОБРАЖЕНИЙ ==========
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не загружен' });
  }
  const baseUrl = process.env.BASE_URL || `https://cosmosfm-production.up.railway.app`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// ========== API ROUTES ==========
app.get('/api/health', (req, res) => {
  const data = readData();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    shows: data.shows?.length || 0,
    podcasts: data.podcasts?.length || 0,
    hosts: data.hosts?.length || 0,
  });
});

app.get('/api/shows', (req, res) => {
  const data = readData();
  res.json(data.shows || []);
});

app.get('/api/shows/current', (req, res) => {
  const data = readData();
  const current = data.shows?.find(s => s.isLive) || data.shows?.[0];
  res.json(current || null);
});

app.post('/api/shows', (req, res) => {
  const data = readData();
  const show = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  data.shows = data.shows || [];
  data.shows.push(show);
  writeData(data);
  res.status(201).json(show);
});

app.put('/api/shows/:id', (req, res) => {
  const data = readData();
  const index = data.shows?.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  data.shows[index] = { ...data.shows[index], ...req.body, updatedAt: new Date().toISOString() };
  writeData(data);
  res.json(data.shows[index]);
});

app.delete('/api/shows/:id', (req, res) => {
  const data = readData();
  data.shows = data.shows?.filter(s => s.id !== req.params.id) || [];
  writeData(data);
  res.json({ message: 'Deleted' });
});

app.get('/api/podcasts', (req, res) => {
  const data = readData();
  res.json(data.podcasts || []);
});

app.post('/api/podcasts', (req, res) => {
  const data = readData();
  const podcast = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  data.podcasts = data.podcasts || [];
  data.podcasts.push(podcast);
  writeData(data);
  res.status(201).json(podcast);
});

app.put('/api/podcasts/:id', (req, res) => {
  const data = readData();
  const index = data.podcasts?.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  data.podcasts[index] = { ...data.podcasts[index], ...req.body, updatedAt: new Date().toISOString() };
  writeData(data);
  res.json(data.podcasts[index]);
});

app.delete('/api/podcasts/:id', (req, res) => {
  const data = readData();
  data.podcasts = data.podcasts?.filter(p => p.id !== req.params.id) || [];
  writeData(data);
  res.json({ message: 'Deleted' });
});

app.get('/api/hosts', (req, res) => {
  const data = readData();
  res.json(data.hosts || []);
});

app.post('/api/hosts', (req, res) => {
  const data = readData();
  const host = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  data.hosts = data.hosts || [];
  data.hosts.push(host);
  writeData(data);
  res.status(201).json(host);
});

app.put('/api/hosts/:id', (req, res) => {
  const data = readData();
  const index = data.hosts?.findIndex(h => h.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  data.hosts[index] = { ...data.hosts[index], ...req.body, updatedAt: new Date().toISOString() };
  writeData(data);
  res.json(data.hosts[index]);
});

app.delete('/api/hosts/:id', (req, res) => {
  const data = readData();
  data.hosts = data.hosts?.filter(h => h.id !== req.params.id) || [];
  writeData(data);
  res.json({ message: 'Deleted' });
});

app.get('/api/pages/:page', (req, res) => {
  const data = readData();
  const page = data.pages?.[req.params.page];
  res.json(page || {});
});

app.put('/api/pages/:page', (req, res) => {
  const data = readData();
  data.pages = data.pages || {};
  data.pages[req.params.page] = { ...data.pages[req.params.page], ...req.body };
  writeData(data);
  res.json(data.pages[req.params.page]);
});

app.get('/api/settings', (req, res) => {
  const data = readData();
  res.json(data.settings || {});
});

app.put('/api/settings', (req, res) => {
  const data = readData();
  data.settings = { ...data.settings, ...req.body };
  writeData(data);
  res.json(data.settings);
});

app.get('/api/data', (req, res) => {
  res.json(readData());
});

app.post('/api/data', (req, res) => {
  if (writeData(req.body)) {
    res.json({ message: 'Data updated' });
  } else {
    res.status(500).json({ error: 'Failed to write data' });
  }
});

app.get('/api/debug/uploads', (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    res.json({ files, count: files.length, uploadsDir: UPLOADS_DIR });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер на порту ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`📁 Загрузки: http://localhost:${PORT}/uploads`);
});