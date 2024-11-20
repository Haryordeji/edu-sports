interface PhoneNumber {
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
    user_type: 'golfer' | 'instructor'
  }