import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class ClassInstructor extends Model {
  public instructor_id!: UUID;
  public class_id!: UUID;
  public assigned_at!: Date;
}

export const ClassInstructorModelInit = (sequelize: Sequelize) => {
  ClassInstructor.init(
    {
      instructor_id: { type: DataTypes.UUID, primaryKey: true },
      class_id: { type: DataTypes.UUID, primaryKey: true },
      assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'class_instructors' }
  );

  return ClassInstructor;
};