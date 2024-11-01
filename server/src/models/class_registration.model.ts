import { UUID } from 'crypto';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ClassRegistrationAttributes {
  registration_id: UUID;
  user_id: UUID;
  class_id: UUID;
  registered_at: Date;
}

interface ClassRegistrationCreationAttributes extends Optional<ClassRegistrationAttributes, 'registration_id'> {}

export class ClassRegistration extends Model<ClassRegistrationAttributes, ClassRegistrationCreationAttributes> {
  public registration_id!: UUID;
  public user_id!: UUID;
  public class_id!: UUID;
  public registered_at!: Date;
}

export const ClassRegistrationModelInit = (sequelize: Sequelize) => {
  ClassRegistration.init(
    {
      registration_id: { type: DataTypes.UUID, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      class_id: { type: DataTypes.UUID, allowNull: false },
      registered_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'class_registrations' }
  );

  return ClassRegistration;
};