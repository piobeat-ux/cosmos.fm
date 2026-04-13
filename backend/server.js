require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

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

// ========== API ROUTES ==========

// Health check
app.get('/api/health', (req, res) => {
  const data = readData();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    shows: data.shows?.length || 0,
    podcasts: data.podcasts?.length || 0,
    hosts: data.hosts?.length || 0
  });
});

// ========== SHOWS ==========
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

// ========== PODCASTS ==========
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

// ========== HOSTS ==========
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

// ========== PAGES CONTENT ==========
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

// ========== SETTINGS ==========
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

// ========== FULL DATA EXPORT/IMPORT ==========
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер на порту ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`💾 Данные в data.json`);
});