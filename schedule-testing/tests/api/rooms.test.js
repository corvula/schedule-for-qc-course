'use strict';

/**
 * Task 2.1 — CRUD tests for the primary resource: Room.
 *
 * Covers:
 *  - GET all rooms
 *  - POST create room
 *  - GET room by ID
 *  - PUT update room
 *  - DELETE room
 *  - Verify 404 after DELETE
 *  - Negative: POST with empty name (400)
 *  - Negative: GET non-existing ID (404)
 *  - Negative: POST with name exceeding max length (400)
 *  - Negative: Unauthorized request (401)
 */

const axios = require('axios');
const config = require('./helpers/config');

const api = axios.create({
  baseURL: config.baseUrl,
  validateStatus: () => true, // never throw, so we can assert any status
});

describe('Rooms API — CRUD Tests (Task 2.1)', () => {
  let token;
  let createdRoomId = null;
  let deletedRoomId = null;
  const roomName = `TestRoom_${Date.now()}`;
  let updatedRoomName;

  const authHeaders = () => ({ Authorization: `Bearer_${token}` });

  // ─── Setup / Teardown ────────────────────────────────────────────────────

  beforeAll(async () => {
    const res = await api.post('/auth/sign-in', {
      email: config.auth.email,
      password: config.auth.password,
    });
    expect(res.status).toBe(200);
    token = res.data.token;
    expect(token).toBeTruthy();
  });

  afterAll(async () => {
    // Safety cleanup: remove the test room if a test left it behind
    if (createdRoomId) {
      await api.delete(`/rooms/${createdRoomId}`, { headers: authHeaders() });
    }
  });

  // ─── GET all ─────────────────────────────────────────────────────────────

  test('GET /rooms — returns 200 and an array', async () => {
    const res = await api.get('/rooms', { headers: authHeaders() });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test('GET /rooms — each element contains required fields', async () => {
    const res = await api.get('/rooms', { headers: authHeaders() });

    expect(res.status).toBe(200);
    if (res.data.length > 0) {
      const room = res.data[0];
      expect(room).toHaveProperty('id');
      expect(room).toHaveProperty('name');
      expect(room).toHaveProperty('disable');
    }
  });

  // ─── POST create ─────────────────────────────────────────────────────────

  test('POST /rooms — creates a room and returns 201 with the resource', async () => {
    const res = await api.post(
      '/rooms',
      { name: roomName, disable: false, type: { id: config.roomTypeId } },
      { headers: authHeaders() },
    );

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
    expect(typeof res.data.id).toBe('number');
    expect(res.data.name).toBe(roomName);
    expect(res.data.disable).toBe(false);

    createdRoomId = res.data.id;
  });

  // ─── GET by ID ────────────────────────────────────────────────────────────

  test('GET /rooms/:id — returns 200 with the correct room', async () => {
    expect(createdRoomId).not.toBeNull();

    const res = await api.get(`/rooms/${createdRoomId}`, { headers: authHeaders() });

    expect(res.status).toBe(200);
    expect(res.data.id).toBe(createdRoomId);
    expect(res.data.name).toBe(roomName);
  });

  // ─── PUT update ───────────────────────────────────────────────────────────

  test('PUT /rooms — updates the room name and returns 200', async () => {
    expect(createdRoomId).not.toBeNull();
    updatedRoomName = `Updated_Room_${Date.now()}`;

    const res = await api.put(
      '/rooms',
      {
        id: createdRoomId,
        name: updatedRoomName,
        disable: false,
        type: { id: config.roomTypeId },
      },
      { headers: authHeaders() },
    );

    expect(res.status).toBe(200);
    expect(res.data.id).toBe(createdRoomId);
    expect(res.data.name).toBe(updatedRoomName);
  });

  // ─── DELETE ───────────────────────────────────────────────────────────────

  test('DELETE /rooms/:id — returns 200', async () => {
    expect(createdRoomId).not.toBeNull();
    deletedRoomId = createdRoomId;

    const res = await api.delete(`/rooms/${createdRoomId}`, { headers: authHeaders() });

    expect(res.status).toBe(200);
    createdRoomId = null; // mark as deleted so afterAll skips cleanup
  });

  // ─── GET after DELETE ─────────────────────────────────────────────────────

  test('GET /rooms/:id after DELETE — returns 404', async () => {
    expect(deletedRoomId).not.toBeNull();

    const res = await api.get(`/rooms/${deletedRoomId}`, { headers: authHeaders() });

    expect(res.status).toBe(404);
  });

  // ─── Negative scenarios ───────────────────────────────────────────────────

  test('POST /rooms with empty name — returns 400', async () => {
    const res = await api.post(
      '/rooms',
      { name: '', disable: false, type: { id: config.roomTypeId } },
      { headers: authHeaders() },
    );

    expect(res.status).toBe(400);
  });

  test('POST /rooms with name longer than 35 chars — returns 400', async () => {
    const longName = 'A'.repeat(36); // exceeds @Size(max = 35)

    const res = await api.post(
      '/rooms',
      { name: longName, disable: false, type: { id: config.roomTypeId } },
      { headers: authHeaders() },
    );

    expect(res.status).toBe(400);
  });

  test('GET /rooms/999999 — returns 404 for non-existing room', async () => {
    const res = await api.get('/rooms/999999', { headers: authHeaders() });

    expect(res.status).toBe(404);
  });

  test('GET /rooms without token — returns 401 or 403', async () => {
    const res = await api.get('/rooms'); // no Authorization header

    expect([401, 403]).toContain(res.status);
  });
});
