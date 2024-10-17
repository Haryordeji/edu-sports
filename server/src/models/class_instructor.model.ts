import { DataTypes, Model, Sequelize } from 'sequelize';

export class ClassInstructor extends Model {
  public instructor_id!: number;
  public class_id!: number;
  public assigned_at!: Date;
}

export const ClassInstructorModelInit = (sequelize: Sequelize) => {
  ClassInstructor.init(
    {
      instructor_id: { type: DataTypes.INTEGER, primaryKey: true },
      class_id: { type: DataTypes.INTEGER, primaryKey: true },
      assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'class_instructors' }
  );

  return ClassInstructor;
};