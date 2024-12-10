'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedback', {
      feedback_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue:  Sequelize.UUIDV4
      },
      instructor_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      golfer_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      class_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      note_content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('feedback');
  }
};