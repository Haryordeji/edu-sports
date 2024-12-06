'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notes');

    // Create the 'feedback' table
    await queryInterface.createTable('feedback', {
      feedback_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      instructor_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      golfer_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      class_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      note_content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      edited_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create the 'comments' table
    await queryInterface.createTable('comments', {
      comment_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      feedback_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'feedback',
          key: 'feedback_id',
        },
        onDelete: 'CASCADE',
      },
      author_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('comments');
    await queryInterface.dropTable('feedback');
  },
};
