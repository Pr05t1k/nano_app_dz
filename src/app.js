const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (для демонстрации)
let notes = [
  { id: 1, title: 'Первая заметка', content: 'Содержание первой заметки' },
  { id: 2, title: 'Вторая заметка', content: 'Содержание второй заметки' }
];

// ========== API Endpoints ==========

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Notes API'
  });
});

// Get all notes
app.get('/api/notes', (req, res) => {
  res.json({
    success: true,
    count: notes.length,
    data: notes
  });
});

// Get note by ID
app.get('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id);
  
  if (!note) {
    return res.status(404).json({
      success: false,
      error: `Note with ID ${id} not found`
    });
  }
  
  res.json({
    success: true,
    data: note
  });
});

// Create new note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: 'Title and content are required'
    });
  }
  
  const newNote = {
    id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
    title,
    content,
    createdAt: new Date().toISOString()
  };
  
  notes.push(newNote);
  
  res.status(201).json({
    success: true,
    data: newNote
  });
});

// Update note
app.put('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  
  const noteIndex = notes.findIndex(n => n.id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Note with ID ${id} not found`
    });
  }
  
  if (!title && !content) {
    return res.status(400).json({
      success: false,
      error: 'At least one field (title or content) must be provided'
    });
  }
  
  const updatedNote = {
    ...notes[noteIndex],
    title: title || notes[noteIndex].title,
    content: content || notes[noteIndex].content,
    updatedAt: new Date().toISOString()
  };
  
  notes[noteIndex] = updatedNote;
  
  res.json({
    success: true,
    data: updatedNote
  });
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = notes.length;
  
  notes = notes.filter(n => n.id !== id);
  
  if (notes.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: `Note with ID ${id} not found`
    });
  }
  
  res.json({
    success: true,
    message: `Note with ID ${id} deleted successfully`
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

module.exports = app;