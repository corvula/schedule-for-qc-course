'use strict';

module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:8081',

  auth: {
    email: process.env.TEST_EMAIL || 'manager@gmail.com',
    password: process.env.TEST_PASSWORD || 'Qwerty!123',
  },

  // ID of an existing RoomType (created by initial DB migration)
  roomTypeId: parseInt(process.env.ROOM_TYPE_ID || '1', 10),

  // Fixed IDs used as dependencies in Schedule tests
  semesterId: parseInt(process.env.SEMESTER_ID || '1', 10),
  groupId: parseInt(process.env.GROUP_ID || '1', 10),
  schedule: {
    lessonId: parseInt(process.env.SCHEDULE_LESSON_ID || '1', 10),
    periodId: parseInt(process.env.SCHEDULE_PERIOD_ID || '1', 10),
    roomId: parseInt(process.env.SCHEDULE_ROOM_ID || '1', 10),
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'appdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
};
