export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  NAME: /^[A-Za-zÀ-ÿ'\-\s.]+$/,
  MIDDLE_INITIAL: /^[A-Za-z]$/,
  ZIPCODE: /^\d{5}$/,
  PHONE_PART: /^\d+$/,
  ADDRESS: /^[A-Za-z0-9\s#,\-\.\/]+$/,
  CITY: /^[A-Za-zÀ-ÿ\s\-]+$/,
  RELATIONSHIP: /^[A-Za-zÀ-ÿ\s.]+$/
};

export interface ValidationError {
  isValid: boolean;
  message: string;
}

export const validateEmail = (email: string): ValidationError => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  if (email.length > 255) {
    return { isValid: false, message: 'Email must not exceed 255 characters' };
  }
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

export const validatePassword = (password: string): ValidationError => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'Password must not exceed 128 characters' };
  }
  if (!VALIDATION_PATTERNS.PASSWORD.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    };
  }
  return { isValid: true, message: '' };
};

export const validateName = (name: string, fieldName: string): ValidationError => {
  if (!name) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  if (name.length > 50) {
    return { isValid: false, message: `${fieldName} must not exceed 50 characters` };
  }
  if (!VALIDATION_PATTERNS.NAME.test(name)) {
    return { isValid: false, message: `${fieldName} can only contain letters, hyphens, apostrophes, and dots` };
  }
  return { isValid: true, message: '' };
};

export const validateMiddleInitial = (initial: string): ValidationError => {
  if (initial && !VALIDATION_PATTERNS.MIDDLE_INITIAL.test(initial)) {
    return { isValid: false, message: 'Middle initial must be a single letter' };
  }
  return { isValid: true, message: '' };
};

export const validateDateOfBirth = (dob: string): ValidationError => {
  if (!dob) {
    return { isValid: false, message: 'Date of birth is required' };
  }
  
  const dobDate = new Date(dob);
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 100);
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 2);

  if (dobDate > today) {
    return { isValid: false, message: 'Date of birth cannot be in the future' };
  }
  if (dobDate < minDate) {
    return { isValid: false, message: 'Age cannot exceed 100 years' };
  }
  if (dobDate > maxDate) {
    return { isValid: false, message: 'Must be at least 2 years old' };
  }
  return { isValid: true, message: '' };
};

export const validateAddress = (address: string): ValidationError => {
  if (!address) {
    return { isValid: false, message: 'Address is required' };
  }
  if (address.length > 100) {
    return { isValid: false, message: 'Address must not exceed 100 characters' };
  }
  if (!VALIDATION_PATTERNS.ADDRESS.test(address)) {
    return { isValid: false, message: 'Address contains invalid characters' };
  }
  return { isValid: true, message: '' };
};

export const validateCity = (city: string): ValidationError => {
  if (!city) {
    return { isValid: false, message: 'City is required' };
  }
  if (city.length > 50) {
    return { isValid: false, message: 'City must not exceed 50 characters' };
  }
  if (!VALIDATION_PATTERNS.CITY.test(city)) {
    return { isValid: false, message: 'City can only contain letters, spaces, and hyphens' };
  }
  return { isValid: true, message: '' };
};

export const validateZipCode = (zipCode: string): ValidationError => {
  if (!zipCode) {
    return { isValid: false, message: 'Zip code is required' };
  }
  if (!VALIDATION_PATTERNS.ZIPCODE.test(zipCode)) {
    return { isValid: false, message: 'Zip code must be 5 digits' };
  }
  return { isValid: true, message: '' };
};

export const validatePhone = (phone: { areaCode: string; prefix: string; lineNumber: string }): ValidationError => {
  if (!phone.areaCode || !phone.prefix || !phone.lineNumber) {
    return { isValid: false, message: 'Complete phone number is required' };
  }
  if (!VALIDATION_PATTERNS.PHONE_PART.test(phone.areaCode) || 
      !VALIDATION_PATTERNS.PHONE_PART.test(phone.prefix) || 
      !VALIDATION_PATTERNS.PHONE_PART.test(phone.lineNumber)) {
    return { isValid: false, message: 'Phone number must contain only digits' };
  }
  if (phone.areaCode.length !== 3 || phone.prefix.length !== 3 || phone.lineNumber.length !== 4) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  return { isValid: true, message: '' };
};

export const validateRelationship = (relationship: string): ValidationError => {
  if (!relationship) {
    return { isValid: false, message: 'Relationship is required' };
  }
  if (relationship.length > 50) {
    return { isValid: false, message: 'Relationship must not exceed 50 characters' };
  }
  if (!VALIDATION_PATTERNS.RELATIONSHIP.test(relationship)) {
    return { isValid: false, message: 'Relationship can only contain letters, spaces, and dots' };
  }
  return { isValid: true, message: '' };
};
