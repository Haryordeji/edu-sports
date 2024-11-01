'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      profile_created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      middle_initial: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      zip_code: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      gender: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.STRING,
      },
      height: {
        type: Sequelize.STRING,
      },
      handedness: {
        type: Sequelize.STRING,
      },
      referral_source: {
        type: Sequelize.STRING,
      },
      referral_name: {
        type: Sequelize.STRING,
      },
      golf_experience: {
        type: Sequelize.STRING,
      },
      previous_lessons: {
        type: Sequelize.STRING,
      },
      lesson_duration: {
        type: Sequelize.STRING,
      },
      previous_instructor: {
        type: Sequelize.STRING,
      },
      emergency_contact_name: {
        type: Sequelize.STRING,
      },
      emergency_contact_phone: {
        type: Sequelize.STRING,
      },
      physician_name: {
        type: Sequelize.STRING,
      },
      physician_phone: {
        type: Sequelize.STRING,
      },
      medical_information: {
        type: Sequelize.STRING,
      },
      user_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};