const request = require('supertest');
const app = require('../app');

describe('Notes API Tests', () => {
  // Health check endpoint
  test('GET /api/health - should return API status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.status).toBe('OK');
    expect(response.body.service).toBe('Notes API');
  });

  // Get all notes
  test('GET /api/notes - should return all notes', async () => {
    const response = await request(app)
      .get('/api/notes')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.count).toBeDefined();
  });

  // Get note by ID
  test('GET /api/notes/:id - should return specific note', async () => {
    const response = await request(app)
      .get('/api/notes/1')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(1);
    expect(response.body.data.title).toBeDefined();
  });

  test('GET /api/notes/:id - should return 404 for non-existent note', async () => {
    const response = await request(app)
      .get('/api/notes/999')
      .expect(404);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('not found');
  });

  // Create new note
  test('POST /api/notes - should create a new note', async () => {
    const newNote = {
      title: 'Test Note',
      content: 'Test content for CI/CD demo'
    };
    
    const response = await request(app)
      .post('/api/notes')
      .send(newNote)
      .expect('Content-Type', /json/)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.title).toBe(newNote.title);
    expect(response.body.data.createdAt).toBeDefined();
  });

  test('POST /api/notes - should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/api/notes')
      .send({ title: 'Only title' })
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('required');
  });

  // Update note
  test('PUT /api/notes/:id - should update existing note', async () => {
    const updatedData = {
      title: 'Updated Title',
      content: 'Updated content'
    };
    
    const response = await request(app)
      .put('/api/notes/1')
      .send(updatedData)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(updatedData.title);
    expect(response.body.data.updatedAt).toBeDefined();
  });

  // Delete note
  test('DELETE /api/notes/:id - should delete note', async () => {
    const response = await request(app)
      .delete('/api/notes/2')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('deleted');
  });

  // 404 route handler
  test('Non-existent route - should return 404', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('not found');
  });
});