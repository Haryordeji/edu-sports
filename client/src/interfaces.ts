export interface PhoneNumber {
    areaCode: string;
    prefix: string;
    lineNumber: string;
  }
  
  interface EmergencyContact {
    name: string;
    phone: PhoneNumber;
    relationship: string;
  }
  
  interface Physician {
    name: string;
    phone: PhoneNumber;
  }
  
  interface HeardFrom {
    source: 'event' | 'media' | 'school' | 'internet' | 'friend' | '';
    name?: string;
  }

export interface RegistrationFormData {
    firstName: string;
    middleInitial: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    Phone: PhoneNumber;
    email: string;
    gender: 'male' | 'female' | 'other' | '';
    dateOfBirth: string;
    height: string;
    handedness: 'right' | 'left' | '';
    heardFrom: HeardFrom;
    golfExperience: 'none' | 'veryLittle' | 'moderate' | 'aLot' | '';
    previousLessons: boolean;
    lessonDuration: string;
    previousInstructor: string;
    password: string;
    emergencyContact: EmergencyContact;
    physician: Physician;
    medicalInformation: string;
    agreeToTerms: boolean;

    // ! dynamic render registration form based on whether golfer or instructor
    user_type: 'golfer' | 'instructor' | 'admin';

    level: number[]
  }

  export enum GolfLevels {
    "Wee Golfer",
    "Academy Golfer Level 1",
    "Academy Golfer Level 2",
    "Club Golfer Level 3",
    "Club Golfer Level 4",
    "Tour Golfer Level 5",
    "Tour Golfer Level 6",
    "Unassigned"
  }