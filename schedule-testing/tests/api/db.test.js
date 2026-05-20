'use strict';

/**
 * Task 2.3 — Database verification after API operations.
 *
 * Each test makes an API call and then queries PostgreSQL directly
 * to confirm the database state matches the API response.
 *
 * Covers:
 *  - Room: POST  → row appears in rooms table with correct data
 *  - Room: PUT   → row is updated in rooms table
 *  - Room: DELETE → row is removed from rooms table
 *  - Schedule: POST   → row appears in schedules table with correct data
 *  - Schedule: DELETE → row is removed from schedules table
 */

const axios = require('axios');
const { Pool } = require('pg');
const config = require('./helpers/config');

const api = axios.create({
  baseURL: config.baseUrl,
  validateStatus: () => true,
});

const pool = new Pool(config.db);

describe('Database Verification (Task 2.3)', () => {
  let token;
  let createdRoomId = null;
  let createdScheduleId = null;

  const roomName = `DBTest_Room_${Date.now()}`;
  const updatedRoomName = `DBTest_Updated_${Date.now()}`;

  const SCHEDULE_BODY = {
    lessonId: config.schedule.lessonId,
    periodId: config.schedule.periodId,
    roomId: config.schedule.roomId,
    dayOfWeek: 'THURSDAY',
    evenOdd: 'EVEN',
  };

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
    // API-level safety cleanup
    if (createdRoomId) {
      await api.delete(`/rooms/${createdRoomId}`, { headers: authHeaders() });
    }
    if (createdScheduleId) {
      await api.delete(`/schedules/${createdScheduleId}`, { headers: authHeaders() });
    }
    await pool.end();
  });

  // ─── Room: POST ───────────────────────────────────────────────────────────

  test('POST /rooms — created room is persisted in the database', async () => {
    const res = await api.post(
      '/rooms',
      { name: roomName, disable: false, type: { id: config.roomTypeId } },
      { headers: authHeaders() },
    );

    expect(res.status).toBe(201);
    createdRoomId = res.data.id;

    const result = await pool.query(
      'SELECT id, name, disable FROM rooms WHERE id = $1',
      [createdRoomId],
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].name).toBe(roomName);
    expect(result.rows[0].disable).toBe(false);
  });

  // ─── Room: PUT ────────────────────────────────────────────────────────────

  test('PUT /rooms — updated room name is reflected in the database', async () => {
    expect(createdRoomId).not.toBeNull();

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

    const result = await pool.query(
      'SELECT name FROM rooms WHERE id = $1',
      [createdRoomId],
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].name).toBe(updatedRoomName);
  });

  // ─── Room: DELETE ─────────────────────────────────────────────────────────

  test('DELETE /rooms/:id — row is removed from the database', async () => {
    expect(createdRoomId).not.toBeNull();

    const res = await api.delete(`/rooms/${createdRoomId}`, { headers: authHeaders() });

    expect(res.status).toBe(200);

    const result = await pool.query(
      'SELECT id FROM rooms WHERE id = $1',
      [createdRoomId],
    );

    expect(result.rows).toHaveLength(0);
    createdRoomId = null;
  });

  // ─── Schedule: POST ───────────────────────────────────────────────────────

  test('POST /schedules — created schedule is persisted in the database', async () => {
    const res = await api.post('/schedules', SCHEDULE_BODY, { headers: authHeaders() });

    expect(res.status).toBe(201);
    expect(res.data.length).toBeGreaterThan(0);
    createdScheduleId = res.data[0].id;

    const result = await pool.query(
      `SELECT id, lesson_id, period_id, room_id, day_of_week, evenodd
         FROM schedules
        WHERE id = $1`,
      [createdScheduleId],
    );

    expect(result.rows).toHaveLength(1);

    const row = result.rows[0];
    expect(Number(row.lesson_id)).toBe(SCHEDULE_BODY.lessonId);
    expect(Number(row.period_id)).toBe(SCHEDULE_BODY.periodId);
    expect(Number(row.room_id)).toBe(SCHEDULE_BODY.roomId);
    expect(row.day_of_week).toBe(SCHEDULE_BODY.dayOfWeek);
    expect(row.evenodd).toBe(SCHEDULE_BODY.evenOdd);
  });

  // ─── Schedule: DELETE ─────────────────────────────────────────────────────

  test('DELETE /schedules/:id — row is removed from the database', async () => {
    expect(createdScheduleId).not.toBeNull();

    const res = await api.delete(`/schedules/${createdScheduleId}`, {
      headers: authHeaders(),
    });

    expect(res.status).toBe(200);

    const result = await pool.query(
      'SELECT id FROM schedules WHERE id = $1',
      [createdScheduleId],
    );

    expect(result.rows).toHaveLength(0);
    createdScheduleId = null;
  });
});
