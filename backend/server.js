require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { 
  loadData, 
  getShows, 
  getPodcasts, 
  updateShows, 
  updatePods 
} = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Загружаем данные при старте
loadData();

// API маршруты

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'JSON File',
    shows: getShows().length,
    podcasts: getPodcasts().length
  });
});

// SHOWS API

// Получить все передачи
app.get('/api/shows', (req, res) => {
  res.json(getShows());
});

// Получить текущий эфир
app.get('/api/shows/current', (req, res) => {
  const shows = getShows();
  const current = shows.find(s => s.isLive) || shows[0];
  res.json(current);
});

// Добавить передачу
app.post('/api/shows', (req, res) => {
  const shows = getShows();
  const show = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  shows.push(show);
  updateShows(shows);
  res.status(201).json(show);
});

// Обновить передачу
app.put('/api/shows/:id', (req, res) => {
  const shows = getShows();
  const index = shows.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  shows[index] = { ...shows[index], ...req.body };
  updateShows(shows);
  res.json(shows[index]);
});

// Удалить передачу
app.delete('/api/shows/:id', (req, res) => {
  let shows = getShows();
  shows = shows.filter(s => s.id !== req.params.id);
  updateShows(shows);
  res.json({ message: 'Deleted' });
});

// PODCASTS API

// Получить все подкасты
app.get('/api/podcasts', (req, res) => {
  res.json(getPodcasts());
});

// Добавить подкаст
app.post('/api/podcasts', (req, res) => {
  const podcasts = getPodcasts();
  const podcast = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  podcasts.push(podcast);
  updatePods(podcasts);
  res.status(201).json(podcast);
});

// Обновить подкаст
app.put('/api/podcasts/:id', (req, res) => {
  const podcasts = getPodcasts();
  const index = podcasts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  podcasts[index] = { ...podcasts[index], ...req.body };
  updatePods(podcasts);
  res.json(podcasts[index]);
});

// Удалить подкаст
app.delete('/api/podcasts/:id', (req, res) => {
  let podcasts = getPodcasts();
  podcasts = podcasts.filter(p => p.id !== req.params.id);
  updatePods(podcasts);
  res.json({ message: 'Deleted' });
});

// Запуск
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер на порту ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log('💾 Данные сохраняются в data.json');
});