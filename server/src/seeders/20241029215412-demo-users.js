'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password_hash = await bcrypt.hash('password123', 10);
    const now = new Date();

    return queryInterface.bulkInsert('users', [
      {
        user_id: '550e8400-e29b-41d4-a716-446655440000', // Admin
        first_name: 'Admin',
        middle_initial: 'A',
        last_name: 'User',
        street: '123 Admin St',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701',
        phone: '5125550100',
        email: 'admin@example.com',
        password_hash,
        gender: 'other',
        dob: '1980-01-01',
        height: "5'10\"",
        handedness: 'right',
        referral_source: 'internal',
        referral_name: 'System',
        golf_experience: 'aLot',
        previous_lessons: 'yes',
        lesson_duration: '5+ years',
        previous_instructor: 'Various',
        emergency_contact_name: 'Emergency Admin',
        emergency_contact_phone: '5125550101',
        physician_name: 'Dr. Admin',
        physician_phone: '5125550102',
        medical_information: 'None',
        user_type: 'admin',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440001', // Instructor 1
        first_name: 'Jane',
        middle_initial: 'M',
        last_name: 'Smith',
        street: '456 Golf Dr',
        city: 'Austin',
        state: 'TX',
        zip_code: '78702',
        phone: '5125550200',
        email: 'jane.instructor@example.com',
        password_hash,
        gender: 'female',
        dob: '1985-02-15',
        height: "5'6\"",
        handedness: 'right',
        referral_source: 'event',
        referral_name: 'Golf Expo 2023',
        golf_experience: 'aLot',
        previous_lessons: 'yes',
        lesson_duration: '10+ years',
        previous_instructor: 'PGA Professional',
        emergency_contact_name: 'John Smith',
        emergency_contact_phone: '5125550201',
        physician_name: 'Dr. Johnson',
        physician_phone: '5125550202',
        medical_information: 'None',
        user_type: 'instructor',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440002', // Student 1
        first_name: 'Alice',
        middle_initial: 'K',
        last_name: 'Johnson',
        street: '789 Beginner Lane',
        city: 'Austin',
        state: 'TX',
        zip_code: '78703',
        phone: '5125550300',
        email: 'alice.student@example.com',
        password_hash,
        gender: 'female',
        dob: '1990-03-20',
        height: "5'4\"",
        handedness: 'right',
        referral_source: 'friend',
        referral_name: 'Jane Smith',
        golf_experience: 'veryLittle',
        previous_lessons: 'no',
        lesson_duration: 'N/A',
        previous_instructor: 'N/A',
        emergency_contact_name: 'Bob Johnson',
        emergency_contact_phone: '5125550301',
        physician_name: 'Dr. Williams',
        physician_phone: '5125550302',
        medical_information: 'Minor back pain',
        user_type: 'student',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440003', // Student 2
        first_name: 'Bob',
        middle_initial: 'R',
        last_name: 'Wilson',
        street: '321 Progress Way',
        city: 'Austin',
        state: 'TX',
        zip_code: '78704',
        phone: '5125550400',
        email: 'bob.student@example.com',
        password_hash,
        gender: 'male',
        dob: '1988-07-12',
        height: "6'0\"",
        handedness: 'left',
        referral_source: 'internet',
        referral_name: 'Google Search',
        golf_experience: 'moderate',
        previous_lessons: 'yes',
        lesson_duration: '6 months',
        previous_instructor: 'Local Club Pro',
        emergency_contact_name: 'Sarah Wilson',
        emergency_contact_phone: '5125550401',
        physician_name: 'Dr. Brown',
        physician_phone: '5125550402',
        medical_information: 'None',
        user_type: 'student',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};