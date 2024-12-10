'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue:  Sequelize.UUIDV4
      },
      profile_created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middle_initial: {
        type: Sequelize.STRING,
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dob: {
        type: Sequelize.STRING,
        allowNull: true
      },
      height: {
        type: Sequelize.STRING,
        allowNull: true
      },
      handedness: {
        type: Sequelize.STRING,
        allowNull: true
      },
      referral_source: {
        type: Sequelize.STRING,
        allowNull: true
      },
      referral_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      golf_experience: {
        type: Sequelize.STRING,
        allowNull: true
      },
      previous_lessons: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lesson_duration: {
        type: Sequelize.STRING,
        allowNull: true
      },
      previous_instructor: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergency_contact_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergency_contact_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergency_contact_relationship: {
        type: Sequelize.STRING,
        allowNull: true
      },
      physician_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      physician_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      medical_information: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_type: {
        type: Sequelize.STRING,
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
      },
      level: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};