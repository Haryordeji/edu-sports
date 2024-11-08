'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const classes = [
      {
        class_id: crypto.randomUUID(),
        title: 'Beginner Golf Fundamentals',
        start: new Date('2024-11-10T09:00:00'),
        end: new Date('2024-11-10T10:30:00'),
        location: 'Practice Range',
        instructor: 'Mike Wilson',
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        class_id: crypto.randomUUID(),
        title: 'Short Game Mastery',
        start: new Date('2024-11-11T14:00:00'),
        end: new Date('2024-11-11T15:30:00'),
        location: 'Putting Green',
        instructor: 'James Peterson',
        level: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        class_id: crypto.randomUUID(),
        title: 'Advanced Swing Analysis',
        start: new Date('2024-11-12T11:00:00'),
        end: new Date('2024-11-12T12:30:00'),
        location: 'Indoor Simulator',
        instructor: 'Sarah Martinez',
        level: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        class_id: crypto.randomUUID(),
        title: 'Junior Golf Development',
        start: new Date('2024-11-13T16:00:00'),
        end: new Date('2024-11-13T17:00:00'),
        location: 'Junior Course',
        instructor: 'Tom Bradley',
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('classes', classes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('classes', null, {});
  }
};