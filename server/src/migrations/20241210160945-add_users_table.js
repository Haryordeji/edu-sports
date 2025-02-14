'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      profile_created_at: {
        type: Sequelize.DATE
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
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      street: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zip_code: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.STRING
      },
      handedness: {
        type: Sequelize.STRING
      },
      referral_source: {
        type: Sequelize.STRING
      },
      referral_name: {
        type: Sequelize.STRING
      },
      golf_experience: {
        type: Sequelize.STRING
      },
      previous_lessons: {
        type: Sequelize.STRING
      },
      lesson_duration: {
        type: Sequelize.STRING
      },
      previous_instructor: {
        type: Sequelize.STRING
      },
      emergency_contact_name: {
        type: Sequelize.STRING
      },
      emergency_contact_phone: {
        type: Sequelize.STRING
      },
      emergency_contact_relationship: {
        type: Sequelize.STRING
      },
      physician_name: {
        type: Sequelize.STRING
      },
      physician_phone: {
        type: Sequelize.STRING
      },
      medical_information: {
        type: Sequelize.STRING
      },
      user_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      level: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
