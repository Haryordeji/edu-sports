import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ClassRegistrationAttributes {
  registration_id: number;
  user_id: number;
  class_id: number;
  registered_at: Date;
}

interface ClassRegistrationCreationAttributes extends Optional<ClassRegistrationAttributes, 'registration_id'> {}

export class ClassRegistration extends Model<ClassRegistrationAttributes, ClassRegistrationCreationAttributes> {
  public registration_id!: number;
  public user_id!: number;
  public class_id!: number;
  public registered_at!: Date;
}

export const ClassRegistrationModelInit = (sequelize: Sequelize) => {
  ClassRegistration.init(
    {
      registration_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      class_id: { type: DataTypes.INTEGER, allowNull: false },
      registered_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'class_registrations' }
  );

  return ClassRegistration;
};