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

      // Instructors
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
        user_id: '550e8400-e29b-41d4-a716-446655440009',
        first_name: 'Michael',
        middle_initial: 'T',
        last_name: 'Johnson',
        street: '789 Teaching Lane',
        city: 'Austin',
        state: 'TX',
        zip_code: '78710',
        phone: '5125550418',
        email: 'michael.instructor@example.com',
        password_hash,
        gender: 'male',
        dob: '1982-06-20',
        height: "6'1\"",
        handedness: 'right',
        referral_source: 'professional',
        referral_name: 'PGA Network',
        golf_experience: 'aLot',
        previous_lessons: 'yes',
        lesson_duration: '15+ years',
        previous_instructor: 'LPGA Master Professional',
        emergency_contact_name: 'Lisa Johnson',
        emergency_contact_phone: '5125550419',
        physician_name: 'Dr. Anderson',
        physician_phone: '5125550420',
        medical_information: 'None',
        user_type: 'instructor',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440010',
        first_name: 'Sarah',
        middle_initial: 'E',
        last_name: 'Martinez',
        street: '101 Pro Circle',
        city: 'Austin',
        state: 'TX',
        zip_code: '78711',
        phone: '5125550421',
        email: 'sarah.instructor@example.com',
        password_hash,
        gender: 'female',
        dob: '1988-09-12',
        height: "5'8\"",
        handedness: 'right',
        referral_source: 'referral',
        referral_name: 'Golf Academy',
        golf_experience: 'aLot',
        previous_lessons: 'yes',
        lesson_duration: '12+ years',
        previous_instructor: 'Top 100 Teacher',
        emergency_contact_name: 'Robert Martinez',
        emergency_contact_phone: '5125550422',
        physician_name: 'Dr. Phillips',
        physician_phone: '5125550423',
        medical_information: 'Minor wrist injury - healed',
        user_type: 'instructor',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440011',
        first_name: 'David',
        middle_initial: 'L',
        last_name: 'Thompson',
        street: '202 Instructor Way',
        city: 'Austin',
        state: 'TX',
        zip_code: '78712',
        phone: '5125550424',
        email: 'david.instructor@example.com',
        password_hash,
        gender: 'male',
        dob: '1979-11-30',
        height: "5'11\"",
        handedness: 'left',
        referral_source: 'professional',
        referral_name: 'Golf Digest',
        golf_experience: 'aLot',
        previous_lessons: 'yes',
        lesson_duration: '20+ years',
        previous_instructor: 'European Tour Pro',
        emergency_contact_name: 'Mary Thompson',
        emergency_contact_phone: '5125550425',
        physician_name: 'Dr. Roberts',
        physician_phone: '5125550426',
        medical_information: 'None',
        user_type: 'instructor',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440012',
        first_name: 'Rachel',
        middle_initial: 'K',
        last_name: 'Wilson',
        street: '303 Coach Road',
        city: 'Austin',
        state: 'TX',
        zip_code: '78713',
        phone: '5125550427',
        email: 'rachel.instructor@example.com',
        password_hash,
        gender: 'female',
        dob: '1984-03-25',
        height: "5'7\"",
        handedness: 'right',
        referral_source: 'professional',
        referral_name: 'Teaching Professional Network',
        golf_experience: 'aLot',
        previous_lessons: 'yes',
        lesson_duration: '18+ years',
        previous_instructor: 'PGA Master Professional',
        emergency_contact_name: 'Thomas Wilson',
        emergency_contact_phone: '5125550428',
        physician_name: 'Dr. Chang',
        physician_phone: '5125550429',
        medical_information: 'None',
        user_type: 'instructor',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },


      // golfers
      {
        user_id: '550e8400-e29b-41d4-a716-446655440002',
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
        user_type: 'golfer',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440003',
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
        user_type: 'golfer',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440004',
        first_name: 'Emma',
        middle_initial: 'J',
        last_name: 'Thompson',
        street: '456 Fairway Lane',
        city: 'Austin',
        state: 'TX',
        zip_code: '78705',
        phone: '5125550403',
        email: 'emma.student@example.com',
        password_hash,
        gender: 'female',
        dob: '1992-03-15',
        height: "5'7\"",
        handedness: 'right',
        referral_source: 'friend',
        referral_name: 'John Smith',
        golf_experience: 'beginner',
        previous_lessons: 'no',
        lesson_duration: 'none',
        previous_instructor: 'none',
        emergency_contact_name: 'Michael Thompson',
        emergency_contact_phone: '5125550404',
        physician_name: 'Dr. Davis',
        physician_phone: '5125550405',
        medical_information: 'None',
        user_type: 'golfer',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440005',
        first_name: 'Carlos',
        middle_initial: 'M',
        last_name: 'Rodriguez',
        street: '789 Birdie Circle',
        city: 'Austin',
        state: 'TX',
        zip_code: '78706',
        phone: '5125550406',
        email: 'carlos.student@example.com',
        password_hash,
        gender: 'male',
        dob: '1995-09-22',
        height: "5'11\"",
        handedness: 'right',
        referral_source: 'social media',
        referral_name: 'Instagram Ad',
        golf_experience: 'advanced',
        previous_lessons: 'yes',
        lesson_duration: '1 year',
        previous_instructor: 'Golf Academy Pro',
        emergency_contact_name: 'Maria Rodriguez',
        emergency_contact_phone: '5125550407',
        physician_name: 'Dr. Wilson',
        physician_phone: '5125550408',
        medical_information: 'Mild knee pain',
        user_type: 'golfer',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440006',
        first_name: 'Sarah',
        middle_initial: 'L',
        last_name: 'Chen',
        street: '101 Eagle Drive',
        city: 'Austin',
        state: 'TX',
        zip_code: '78707',
        phone: '5125550409',
        email: 'sarah.student@example.com',
        password_hash,
        gender: 'female',
        dob: '1990-11-30',
        height: "5'5\"",
        handedness: 'right',
        referral_source: 'website',
        referral_name: 'Golf Club Website',
        golf_experience: 'intermediate',
        previous_lessons: 'yes',
        lesson_duration: '3 months',
        previous_instructor: 'Private Coach',
        emergency_contact_name: 'David Chen',
        emergency_contact_phone: '5125550410',
        physician_name: 'Dr. Martinez',
        physician_phone: '5125550411',
        medical_information: 'None',
        user_type: 'golfer',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440007',
        first_name: 'James',
        middle_initial: 'K',
        last_name: 'Patel',
        street: '202 Bunker Road',
        city: 'Austin',
        state: 'TX',
        zip_code: '78708',
        phone: '5125550412',
        email: 'james.student@example.com',
        password_hash,
        gender: 'male',
        dob: '1987-04-15',
        height: "5'9\"",
        handedness: 'left',
        referral_source: 'event',
        referral_name: 'Golf Expo 2023',
        golf_experience: 'moderate',
        previous_lessons: 'yes',
        lesson_duration: '2 months',
        previous_instructor: 'Golf Club Instructor',
        emergency_contact_name: 'Priya Patel',
        emergency_contact_phone: '5125550413',
        physician_name: 'Dr. Thompson',
        physician_phone: '5125550414',
        medical_information: 'Back strain - recovered',
        user_type: 'golfer',
        profile_created_at: now,
        createdAt: now,
        updatedAt: now
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440008',
        first_name: 'Michelle',
        middle_initial: 'A',
        last_name: 'Kim',
        street: '303 Par Lane',
        city: 'Austin',
        state: 'TX',
        zip_code: '78709',
        phone: '5125550415',
        email: 'michelle.student@example.com',
        password_hash,
        gender: 'female',
        dob: '1993-08-25',
        height: "5'6\"",
        handedness: 'right',
        referral_source: 'recommendation',
        referral_name: 'Golf Club Member',
        golf_experience: 'beginner',
        previous_lessons: 'no',
        lesson_duration: 'none',
        previous_instructor: 'none',
        emergency_contact_name: 'John Kim',
        emergency_contact_phone: '5125550416',
        physician_name: 'Dr. Garcia',
        physician_phone: '5125550417',
        medical_information: 'None',
        user_type: 'golfer',
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