import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { models } from '../db';

const uuid = require('uuid/v4');


interface RegisterRequest {
  firstName: string;
  middleInitial: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  Phone: {
    areaCode: string;
    prefix: string;
    lineNumber: string;
  };
  email: string;
  gender: 'male' | 'female' | 'other' | '';
  dateOfBirth: string;
  height: string;
  handedness: 'right' | 'left' | '';
  heardFrom: {
    source: 'event' | 'media' | 'school' | 'internet' | 'friend' | '';
    name?: string;
  };
  golfExperience: 'none' | 'veryLittle' | 'moderate' | 'aLot' | '';
  previousLessons: boolean;
  lessonDuration: string;
  previousInstructor: string;
  password: string;
  emergencyContact: {
    name: string;
    phone: {
      areaCode: string;
      prefix: string;
      lineNumber: string;
    };
    relationship: string;
  };
  physician: {
    name: string;
    phone: {
      areaCode: string;
      prefix: string;
      lineNumber: string;
    };
  };
  medicalInformation: string;
  agreeToTerms: boolean;
  user_type: string;
}

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
  try {
    const {
      firstName,
      middleInitial,
      lastName,
      address,
      city,
      state,
      zipCode,
      Phone,
      email,
      gender,
      dateOfBirth,
      height,
      handedness,
      heardFrom,
      golfExperience,
      previousLessons,
      lessonDuration,
      previousInstructor,
      password,
      emergencyContact,
      physician,
      medicalInformation,
      agreeToTerms,
      user_type
    } = req.body;

    // required fields
    if (!firstName || !lastName || !email || !password || !user_type || !agreeToTerms) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    // Check if email is already registered
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Format phone numbers as strings
    const formatPhoneNumber = (phone: { areaCode: string; prefix: string; lineNumber: string }) => {
      return `${phone.areaCode}${phone.prefix}${phone.lineNumber}`;
    };

    const user = await models.User.create({
      user_id: uuid(), // Let Sequelize generate UUID
      profile_created_at: new Date(),
      password_hash,
      first_name: firstName,
      middle_initial: middleInitial,
      last_name: lastName,
      street: address,
      city,
      state,
      zip_code: zipCode,
      phone: formatPhoneNumber(Phone),
      email,
      gender,
      dob: dateOfBirth,
      height,
      handedness,
      referral_source: heardFrom.source || "",
      referral_name: heardFrom.name || "",
      golf_experience: golfExperience,
      previous_lessons: previousLessons ? 'yes' : 'no',
      lesson_duration: lessonDuration,
      previous_instructor: previousInstructor,
      emergency_contact_name: emergencyContact.name,
      emergency_contact_phone: formatPhoneNumber(emergencyContact.phone),
      physician_name: physician.name,
      physician_phone: formatPhoneNumber(physician.phone),
      medical_information: medicalInformation,
      user_type
    });

    // Return minimal user data
    const userData = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_type: user.user_type
    };

    res.status(201).json({
      success: true,
      user: userData,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};