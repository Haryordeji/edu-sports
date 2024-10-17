import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Define User attributes and creation attributes
interface UserAttributes {
  user_id: number;
  username: string;
  password_hash: string;
  email: string;
  phone_number: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  availability?: string;
  skill_level?: string;
  user_type: string;
  profile_created_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public username!: string;
  public password_hash!: string;
  public email!: string;
  public phone_number!: string;
  public emergency_contact_name?: string;
  public emergency_contact_phone?: string;
  public availability?: string;
  public skill_level?: string;
  public user_type!: string;
  public profile_created_at!: Date;
}

export const UserModelInit = (sequelize: Sequelize) => {
  User.init(
    {
      user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: DataTypes.STRING, allowNull: false },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone_number: { type: DataTypes.STRING },
      emergency_contact_name: { type: DataTypes.STRING },
      emergency_contact_phone: { type: DataTypes.STRING },
      availability: { type: DataTypes.TEXT },
      skill_level: { type: DataTypes.STRING },
      user_type: { type: DataTypes.STRING, allowNull: false },
      profile_created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'users' }
  );

  return User;
};