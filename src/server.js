const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Notes API запущен на http://${HOST}:${PORT}`);
  console.log(`📌 Доступные эндпоинты:`);
  console.log(`   http://${HOST}:${PORT}/api/health - Проверка здоровья`);
  console.log(`   http://${HOST}:${PORT}/api/notes  - Все заметки`);
  console.log(`   GET /api/notes/:id - Получить заметку`);
  console.log(`   POST /api/notes - Создать заметку`);
  console.log(`   PUT /api/notes/:id - Обновить заметку`);
  console.log(`   DELETE /api/notes/:id - Удалить заметку`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = server;