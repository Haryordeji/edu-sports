import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ClassAttributes {
  class_id: number;
  name: string;
  skill_level: string;
  start_time: Date;
  end_time: Date;
  location: string;
}

interface ClassCreationAttributes extends Optional<ClassAttributes, 'class_id'> {}

export class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  public class_id!: number;
  public name!: string;
  public skill_level!: string;
  public start_time!: Date;
  public end_time!: Date;
  public location!: string;
}

export const ClassModelInit = (sequelize: Sequelize) => {
  Class.init(
    {
      class_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      skill_level: { type: DataTypes.STRING },
      start_time: { type: DataTypes.DATE, allowNull: false },
      end_time: { type: DataTypes.DATE, allowNull: false },
      location: { type: DataTypes.STRING },
    },
    { sequelize, tableName: 'classes' }
  );

  return Class;
};