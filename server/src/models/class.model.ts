import { UUID } from 'crypto';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ClassAttributes {
  class_id: UUID;
  title: string;
  start: Date;
  end: Date;
  location: string;
  instructor: string;
  level: number;
}

interface ClassCreationAttributes extends Optional<ClassAttributes, 'class_id'> {}

export class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  public class_id!: UUID;
  public title!: string;
  public start!: Date;
  public end!: Date;
  public location!: string;
  public instructor!: string;
  public level!: number;
}

export const ClassModelInit = (sequelize: Sequelize) => {
  Class.init(
    {
      class_id: { type: DataTypes.UUID, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      start: { type: DataTypes.DATE, allowNull: false },
      end: { type: DataTypes.DATE, allowNull: false },
      location: { type: DataTypes.STRING },
      instructor: {type: DataTypes.STRING},
      level: {type: DataTypes.INTEGER}
    },
    { sequelize, tableName: 'classes' }
  );

  return Class;
};