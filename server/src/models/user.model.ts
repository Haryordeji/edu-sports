import { UUID } from 'crypto';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Define User attributes and creation attributes
interface UserAttributes {
  // db attributes
  user_id: UUID;
  profile_created_at: Date;
  password_hash: string;


  // user input
  first_name: string;
  middle_initial?: string;
  last_name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  gender: string;
  dob: string;
  height: string;
  handedness: string;

  referral_source: string;
  referral_name: string;
  golf_experience: string;
  previous_lessons: string;
  lesson_duration?: string;
  previous_instructor?: string;
  emergency_contact_phone: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  physician_name: string;
  physician_phone: string;
  medical_information: string;
  user_type: string;

  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: UUID;
  public profile_created_at!: Date;
  public password_hash!: string;

  public first_name!: string;
  public middle_initial?: string;
  public last_name!: string;
  public street!: string;
  public city!: string;
  public state!: string;
  public zip_code!: string;
  public phone!: string;
  public email!: string;
  public gender!: string;
  public dob!: string;
  public height!: string;
  public handedness!: string;

  public referral_source!: string;
  public referral_name!: string;
  public golf_experience!: string;
  public previous_lessons!: string;
  public lesson_duration?: string;
  public previous_instructor?: string;
  public emergency_contact_name!: string;
  public emergency_contact_phone!: string;
  public emergency_contact_relationship!: string;
  public physician_name!: string;
  public physician_phone!: string;
  public medical_information!: string;
  public user_type!: string;

  public createdAt!: Date;
  public updatedAt!: Date;
}

export const UserModelInit = (sequelize: Sequelize) => {
  User.init(
    {
      user_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      profile_created_at: { type: DataTypes.DATE },
      password_hash: { type: DataTypes.STRING, allowNull: false },

      first_name: { type: DataTypes.STRING, allowNull: false },
      middle_initial: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING, allowNull: false },
      street: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      zip_code: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      dob: { type: DataTypes.STRING },
      height: { type: DataTypes.STRING },
      handedness: { type: DataTypes.STRING },
      referral_source: { type: DataTypes.STRING },
      referral_name: { type: DataTypes.STRING },
      golf_experience: { type: DataTypes.STRING },
      previous_lessons: { type: DataTypes.STRING },
      lesson_duration: { type: DataTypes.STRING },
      previous_instructor: { type: DataTypes.STRING },
      emergency_contact_name: { type: DataTypes.STRING },
      emergency_contact_phone: { type: DataTypes.STRING },
      emergency_contact_relationship: { type: DataTypes.STRING },
      physician_name: { type: DataTypes.STRING },
      physician_phone: { type: DataTypes.STRING },
      medical_information: { type: DataTypes.STRING },
      user_type: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    { sequelize, tableName: 'users' }
  );

  return User;
};