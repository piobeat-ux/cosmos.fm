const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Создаём папки для загрузок
const uploadsDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const audioDir = path.join(uploadsDir, 'audio');

[uploadsDir, imagesDir, audioDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('✅ Created directory:', dir);
  }
});

// Раздача статических файлов
app.use('/uploads', express.static(uploadsDir));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') cb(null, imagesDir);
    else if (file.fieldname === 'audio') cb(null, audioDir);
    else cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Database
const dataFile = path.join(__dirname, 'data.json');
const loadData = () => {
  if (!fs.existsSync(dataFile)) {
    const initial = { shows: [], podcasts: [], hosts: [], episodes: [], settings: {} };
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
};
const saveData = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Upload endpoints
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const url = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
  res.json({ url });
});

app.post('/api/upload/audio', upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio' });
  const url = `${req.protocol}://${req.get('host')}/uploads/audio/${req.file.filename}`;
  res.json({ url, size: req.file.size });
});

// Shows
app.get('/api/shows', (req, res) => res.json(loadData().shows));
app.get('/api/shows/current', (req, res) => {
  const shows = loadData().shows;
  const current = shows.find(s => s.isLive) || null;
  res.json(current);
});
app.post('/api/shows', (req, res) => {
  const data = loadData();
  const show = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  data.shows.push(show);
  saveData(data);
  res.json(show);
});
app.put('/api/shows/:id', (req, res) => {
  const data = loadData();
  const idx = data.shows.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.shows[idx] = { ...data.shows[idx], ...req.body };
  saveData(data);
  res.json(data.shows[idx]);
});
app.delete('/api/shows/:id', (req, res) => {
  const data = loadData();
  data.shows = data.shows.filter(s => s.id !== req.params.id);
  saveData(data);
  res.json({ success: true });
});

// Podcasts with episodes
app.get('/api/podcasts', (req, res) => {
  const data = loadData();
  const podcasts = data.podcasts.map(p => ({
    ...p,
    episodesCount: data.episodes.filter(e => e.podcastId === p.id).length
  }));
  res.json(podcasts);
});

app.get('/api/podcasts/:id', (req, res) => {
  const data = loadData();
  const podcast = data.podcasts.find(p => p.id === req.params.id);
  if (!podcast) return res.status(404).json({ error: 'Not found' });
  const episodes = data.episodes.filter(e => e.podcastId === req.params.id);
  res.json({ ...podcast, episodes });
});

app.post('/api/podcasts', (req, res) => {
  const data = loadData();
  const podcast = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  data.podcasts.push(podcast);
  saveData(data);
  res.json(podcast);
});

app.put('/api/podcasts/:id', (req, res) => {
  const data = loadData();
  const idx = data.podcasts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.podcasts[idx] = { ...data.podcasts[idx], ...req.body };
  saveData(data);
  res.json(data.podcasts[idx]);
});

app.delete('/api/podcasts/:id', (req, res) => {
  const data = loadData();
  data.podcasts = data.podcasts.filter(p => p.id !== req.params.id);
  data.episodes = data.episodes.filter(e => e.podcastId !== req.params.id);
  saveData(data);
  res.json({ success: true });
});

// Episodes
app.post('/api/podcasts/:podcastId/episodes', (req, res) => {
  const data = loadData();
  const episode = {
    id: Date.now().toString(),
    podcastId: req.params.podcastId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  data.episodes.push(episode);
  saveData(data);
  res.json(episode);
});

app.put('/api/podcasts/:podcastId/episodes/:episodeId', (req, res) => {
  const data = loadData();
  const idx = data.episodes.findIndex(e => e.id === req.params.episodeId);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.episodes[idx] = { ...data.episodes[idx], ...req.body };
  saveData(data);
  res.json(data.episodes[idx]);
});

app.delete('/api/podcasts/:podcastId/episodes/:episodeId', (req, res) => {
  const data = loadData();
  data.episodes = data.episodes.filter(e => e.id !== req.params.episodeId);
  saveData(data);
  res.json({ success: true });
});

// Hosts
app.get('/api/hosts', (req, res) => res.json(loadData().hosts));
app.post('/api/hosts', (req, res) => {
  const data = loadData();
  const host = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  data.hosts.push(host);
  saveData(data);
  res.json(host);
});
app.put('/api/hosts/:id', (req, res) => {
  const data = loadData();
  const idx = data.hosts.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.hosts[idx] = { ...data.hosts[idx], ...req.body };
  saveData(data);
  res.json(data.hosts[idx]);
});
app.delete('/api/hosts/:id', (req, res) => {
  const data = loadData();
  data.hosts = data.hosts.filter(h => h.id !== req.params.id);
  saveData(data);
  res.json({ success: true });
});

// Settings
app.get('/api/settings', (req, res) => res.json(loadData().settings || {}));
app.put('/api/settings', (req, res) => {
  const data = loadData();
  data.settings = { ...data.settings, ...req.body };
  saveData(data);
  res.json(data.settings);
});

// Data export/import
app.get('/api/data', (req, res) => res.json(loadData()));
app.post('/api/data', (req, res) => {
  saveData(req.body);
  res.json({ success: true });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Server running on port', PORT);
});