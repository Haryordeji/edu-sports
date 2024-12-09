import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { models } from '../db';
import { UUID } from 'crypto';
import { Op } from 'sequelize';

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
  level: number[]
}

// format phone numbers as strings
// sets 0000000000 if bad input is provided
const formatPhoneNumber = (phone: { areaCode: string; prefix: string; lineNumber: string }) => {
  let phoneStr = `${phone.areaCode}${phone.prefix}${phone.lineNumber}`;
  if (phoneStr && phoneStr.length !== 10) {
    return "000000000"
  }

return `${phone.areaCode}${phone.prefix}${phone.lineNumber}`;
};

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
      user_type,
      level
    } = req.body;

    // required fields
    if (!firstName || !lastName || !email || !password || !agreeToTerms) {
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

    const user = await models.User.create({
      user_id: crypto.randomUUID(),
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
      emergency_contact_relationship: emergencyContact.relationship,
      physician_name: physician.name,
      physician_phone: formatPhoneNumber(physician.phone),
      medical_information: medicalInformation,
      user_type: user_type,
      createdAt: new Date(),
      updatedAt: new Date(),
      level: level
    });

    // return data
    const userData = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_type: user.user_type,
      level: user.level
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

// Update controller
export const updateProfile = async (req: Request<{ userId: string }, {}, Partial<RegisterRequest>>, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await models.User.findOne({ where: { user_id: userId }});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (updates.email && updates.email !== user.email) {
      const existingUser = await models.User.findOne({ where: { email: updates.email }});
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    let password_hash;
    if (updates.password) {
      password_hash = await bcrypt.hash(updates.password, 10);
    }

    const updateData: any = {
      ...(updates.firstName && { first_name: updates.firstName }),
      ...(updates.middleInitial && { middle_initial: updates.middleInitial }),
      ...(updates.lastName && { last_name: updates.lastName }),
      ...(updates.address && { street: updates.address }),
      ...(updates.city && { city: updates.city }),
      ...(updates.state && { state: updates.state }),
      ...(updates.zipCode && { zip_code: updates.zipCode }),
      ...(updates.Phone && { phone: formatPhoneNumber(updates.Phone) }),
      ...(updates.email && { email: updates.email }),
      ...(updates.gender && { gender: updates.gender }),
      ...(updates.dateOfBirth && { dob: updates.dateOfBirth }),
      ...(updates.height && { height: updates.height }),
      ...(updates.handedness && { handedness: updates.handedness }),
      ...(updates.heardFrom && { 
        referral_source: updates.heardFrom.source,
        referral_name: updates.heardFrom.name || ""
      }),
      ...(updates.golfExperience && { golf_experience: updates.golfExperience }),
      ...(updates.previousLessons !== undefined && { previous_lessons: updates.previousLessons ? 'yes' : 'no' }),
      ...(updates.lessonDuration && { lesson_duration: updates.lessonDuration }),
      ...(updates.previousInstructor && { previous_instructor: updates.previousInstructor }),
      ...(password_hash && { password_hash }),
      ...(updates.emergencyContact && {
        emergency_contact_name: updates.emergencyContact.name,
        emergency_contact_phone: formatPhoneNumber(updates.emergencyContact.phone)
      }),
      ...(updates.physician && {
        physician_name: updates.physician.name,
        physician_phone: formatPhoneNumber(updates.physician.phone)
      }),
      ...(updates.medicalInformation && { medical_information: updates.medicalInformation }),
      updated_at: new Date(),
      ...(updates.level ? { level: updates.level } : { level: [7] }),
    };

    // update user
    await models.User.update(updateData, {
      where: { user_id: userId }
    });

    // get updated user
    const updatedUser = await models.User.findOne({ where: { user_id: userId }});
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userData = {
      user_id: updatedUser.user_id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      user_type: updatedUser.user_type,
      level: updatedUser.level
    };

    res.json({
      success: true,
      user: userData,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete controller
export const deleteProfile = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await models.User.findOne({ where: { user_id: userId }});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await models.User.destroy({
      where: { user_id: userId }
    });

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get profile controller
export const getProfile = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await models.User.findOne({ 
      where: { user_id: userId },
      attributes: { 
        exclude: ['password_hash'] 
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const formatPhoneForResponse = (phoneStr: string) => {
      if (phoneStr && phoneStr.length === 10) {
        return {
          areaCode: phoneStr.substring(0, 3),
          prefix: phoneStr.substring(3, 6),
          lineNumber: phoneStr.substring(6)
        };
      }
      return {
        areaCode: "000",
          prefix: "000",
          lineNumber: "000"
      };
    };

    // format in same interface paradigm
    const userResponse = {
      userId: user.user_id,
      firstName: user.first_name,
      middleInitial: user.middle_initial,
      lastName: user.last_name,
      address: user.street,
      city: user.city,
      state: user.state,
      zipCode: user.zip_code,
      Phone: formatPhoneForResponse(user.phone),
      email: user.email,
      gender: user.gender,
      dateOfBirth: user.dob,
      height: user.height,
      handedness: user.handedness,
      heardFrom: {
        source: user.referral_source,
        name: user.referral_name
      },
      golfExperience: user.golf_experience,
      previousLessons: user.previous_lessons === 'yes',
      lessonDuration: user.lesson_duration,
      previousInstructor: user.previous_instructor,
      emergencyContact: {
        name: user.emergency_contact_name,
        phone: formatPhoneForResponse(user.emergency_contact_phone),
        relationship: user.emergency_contact_relationship
      },
      physician: {
        name: user.physician_name,
        phone: formatPhoneForResponse(user.physician_phone)
      },
      medicalInformation: user.medical_information,
      user_type: user.user_type,
      profileCreatedAt: user.profile_created_at,
      updatedAt: user.updatedAt,
      level: user.level
    };

    res.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

interface User {
  user_id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  level: number[];
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const user_type = req.query.user_type as string | undefined;
    const levelQuery = req.query.level as string | undefined; 
    const where: any = {};
    
    if (user_type) {
      where.user_type = user_type;
    } else {
      where.user_type = { [Op.ne]: 'admin' }; // hide admin lol
    }
    
    if (levelQuery) {
      const levels = levelQuery.split(',').map(Number);
      where.level = { [Op.overlap]: levels };
    }

    const users = await models.User.findAll({ 
      where,
      attributes: ['user_id', 'first_name', 'last_name', 'email', 'user_type', 'level'],
      order: [['first_name', 'ASC']],
    });

    const formattedUsers: User[] = users.map(user => ({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_type: user.user_type,
      level: user.level
    }));

    return res.status(200).json({
      success: true,
      users: formattedUsers
    });

  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};


interface RegisterInstructorRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  user_type: string;
  golf_experience: string;
  level: number[];
}

export const registerInstructor = async (req: Request<{}, {}, RegisterInstructorRequest>, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      user_type,
      golf_experience,
      level
    } = req.body;

    // Check if email is already registered
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Create user with dummy placeholders
    const user = await models.User.create({
      user_id: crypto.randomUUID(),
      profile_created_at: new Date(),
      password_hash,
      first_name: firstName,
      last_name: lastName,
      street: 'N/A',
      city: 'N/A',
      state: 'N/A',
      zip_code: '00000',
      phone:phone,
      email,
      gender: 'N/A',
      dob: '1900-01-01',
      height: 'N/A',
      handedness: 'N/A',
      referral_source: 'N/A',
      referral_name: '',
      golf_experience: golf_experience,
      previous_lessons: 'no',
      lesson_duration: 'N/A',
      previous_instructor: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      physician_name: '',
      physician_phone: '',
      medical_information: 'N/A',
      user_type,
      createdAt: new Date(),
      updatedAt: new Date(),

      level: level
    });

    // Return user data
    const userData = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      user_type: user.user_type,
      golf_experience: user.golf_experience,
      level: level
    };

    res.status(201).json({
      success: true,
      user: userData,
      message: 'Instructor registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getInstructorsNameList = async (req: Request, res: Response) => {
  try {
    // Fetch all users with user_type 'instructor'
    const instructors = await models.User.findAll({
      where: { user_type: 'instructor' },
      attributes: ['user_id', 'first_name', 'last_name', 'level']
    });

    const formattedInstructors = instructors.map(instructor => ({
      id: instructor.user_id,
      firstName: instructor.first_name,
      lastName: instructor.last_name,
      level: instructor.level
    }));

    return res.status(200).json({
      success: true,
      instructors: formattedInstructors
    });
  } catch (error) {
    console.error('Get instructors error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// return full name and level of user
export const getUserFeedbackInfo = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await models.User.findOne({
      where: { user_id: userId },
      attributes: ['first_name', 'last_name', 'level']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const fullName = `${user.first_name} ${user.last_name}`;

    return res.status(200).json({
      success: true,
      info: {
        name: fullName,
        level: user.level,
      },
    });
  } catch (error) {
    console.error('Get user info for feedback error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


