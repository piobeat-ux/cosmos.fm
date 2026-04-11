const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Настройки
app.use(cors());
app.use(express.json());

// Подключение к MongoDB (пока закомментировано)
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('MongoDB error:', err.message));

// Тестовый API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date() });
});

app.get('/api/shows', (req, res) => {
  res.json([
    { id: 1, title: 'Утренний кофе', host: 'Анна Петрова', time: '10:00', category: 'Утреннее шоу' },
    { id: 2, title: 'Обеденный перерыв', host: 'Михаил Соколов', time: '12:00', category: 'Музыка' }
  ]);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});