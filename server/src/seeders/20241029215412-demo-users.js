// run npm run sequelize db:seed:all
'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password_hash = await bcrypt.hash('password123', 10);

    return queryInterface.bulkInsert('users', [
      {
        username: 'admin_user',
        email: 'admin@example.com',
        password_hash: password_hash,
        phone_number: '123-456-7890',
        user_type: 'admin',
        profile_created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'instructor_jane',
        email: 'jane.instructor@example.com',
        password_hash: password_hash,
        phone_number: '123-456-7891',
        emergency_contact_name: 'John Doe',
        emergency_contact_phone: '123-555-0100',
        availability: 'Monday-Friday, 9AM-5PM',
        user_type: 'instructor',
        profile_created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'instructor_bob',
        email: 'bob.instructor@example.com',
        password_hash: password_hash,
        phone_number: '123-456-7892',
        emergency_contact_name: 'Jane Doe',
        emergency_contact_phone: '123-555-0101',
        availability: 'Weekends, 10AM-6PM',
        user_type: 'instructor',
        profile_created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'golfer_alice',
        email: 'alice.golfer@example.com',
        password_hash: password_hash,
        phone_number: '123-456-7893',
        emergency_contact_name: 'Bob Smith',
        emergency_contact_phone: '123-555-0102',
        skill_level: 'beginner',
        user_type: 'golfer',
        profile_created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'golfer_charlie',
        email: 'charlie.golfer@example.com',
        password_hash: password_hash,
        phone_number: '123-456-7894',
        emergency_contact_name: 'Diana Smith',
        emergency_contact_phone: '123-555-0103',
        skill_level: 'intermediate',
        user_type: 'golfer',
        profile_created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};