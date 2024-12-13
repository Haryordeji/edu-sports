export interface FormErrors {
  [key: string]: string | undefined | {
    [key: string]: string | undefined;
  };
  email?: string;
  password?: string;
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  gender?: string;
  height?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  physician?: {
    name?: string;
    phone?: string;
  };
}
