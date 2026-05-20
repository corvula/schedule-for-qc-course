'use strict';

/**
 * Task 2.2 — Tests for the additional resource: Schedule.
 *
 * Schedule depends on pre-existing entities:
 *   - Lesson   (scheduleLessonId, from initial DB migration)
 *   - Period   (schedulePeriodId, from initial DB migration)
 *   - Room     (scheduleRoomId,   from initial DB migration)
 *   - Semester (semesterId,       from initial DB migration)
 *   - Group    (groupId,          from initial DB migration)
 *
 * Covers:
 *  - GET all schedules for default semester
 *  - GET schedules filtered by semester ID
 *  - POST create schedule
 *  - GET full schedule for a group
 *  - GET full schedule for a semester
 *  - Negative: POST duplicate schedule — conflict (400)
 *  - DELETE schedule
 *  - Negative: POST schedule with non-existing lessonId — relationship validation (404)
 */

const axios = require('axios');
const config = require('./helpers/config');

const api = axios.create({
  baseURL: config.baseUrl,
  validateStatus: () => true,
});

describe('Schedules API — Tests (Task 2.2)', () => {
  let token;
  let createdScheduleId = null;

  const SCHEDULE_BODY = {
    lessonId: config.schedule.lessonId,
    periodId: config.schedule.periodId,
    roomId: config.schedule.roomId,
    dayOfWeek: 'WEDNESDAY',
    evenOdd: 'ODD',
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
    // Safety cleanup: remove the test schedule if any test left it behind
    if (createdScheduleId) {
      await api.delete(`/schedules/${createdScheduleId}`, { headers: authHeaders() });
    }
  });

  // ─── GET all (default semester) ───────────────────────────────────────────

  test('GET /schedules — returns 200 and an array for the default semester', async () => {
    const res = await api.get('/schedules', { headers: authHeaders() });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  // ─── GET by semester ID ───────────────────────────────────────────────────

  test('GET /schedules/semester?semesterId — returns 200 and an array', async () => {
    const res = await api.get('/schedules/semester', {
      headers: authHeaders(),
      params: { semesterId: config.semesterId },
    });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  // ─── POST create ─────────────────────────────────────────────────────────

  test('POST /schedules — creates schedule and returns 201 with array of saved entries', async () => {
    const res = await api.post('/schedules', SCHEDULE_BODY, { headers: authHeaders() });

    expect(res.status).toBe(201);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);

    const entry = res.data[0];
    expect(entry).toHaveProperty('id');
    expect(typeof entry.id).toBe('number');
    expect(entry.dayOfWeek).toBe(SCHEDULE_BODY.dayOfWeek);
    expect(entry.evenOdd).toBe(SCHEDULE_BODY.evenOdd);

    createdScheduleId = entry.id;
  });

  // ─── GET full schedule for group ──────────────────────────────────────────

  test('GET /schedules/full/groups — returns 200 with semester and schedule fields', async () => {
    const res = await api.get('/schedules/full/groups', {
      headers: authHeaders(),
      params: { semesterId: config.semesterId, groupId: config.groupId },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('semester');
    expect(res.data).toHaveProperty('schedule');
  });

  // ─── GET full schedule for semester ───────────────────────────────────────

  test('GET /schedules/full/semester — returns 200', async () => {
    const res = await api.get('/schedules/full/semester', {
      headers: authHeaders(),
      params: { semesterId: config.semesterId },
    });

    expect(res.status).toBe(200);
    expect(res.data).not.toBeNull();
  });

  // ─── Negative: duplicate schedule ────────────────────────────────────────

  test('POST /schedules with same params — returns 400 (conflict)', async () => {
    // The schedule created above still exists; posting the same body must fail.
    expect(createdScheduleId).not.toBeNull();

    const res = await api.post('/schedules', SCHEDULE_BODY, { headers: authHeaders() });

    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('message');
  });

  // ─── DELETE ───────────────────────────────────────────────────────────────

  test('DELETE /schedules/:id — returns 200 with array of deleted IDs', async () => {
    expect(createdScheduleId).not.toBeNull();

    const res = await api.delete(`/schedules/${createdScheduleId}`, {
      headers: authHeaders(),
    });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);

    createdScheduleId = null;
  });

  // ─── Negative: relationship validation ────────────────────────────────────

  test('POST /schedules with non-existing lessonId — returns 404 (relationship validation)', async () => {
    const res = await api.post(
      '/schedules',
      {
        lessonId: 999999, // does not exist
        periodId: config.schedule.periodId,
        roomId: config.schedule.roomId,
        dayOfWeek: 'MONDAY',
        evenOdd: 'EVEN',
      },
      { headers: authHeaders() },
    );

    expect(res.status).toBe(404);
  });
});
