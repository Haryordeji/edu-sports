import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface NoteAttributes {
  note_id: number;
  instructor_id: number;
  golfer_id: number;
  class_id: number;
  note_content: string;
  created_at: Date;
}

interface NoteCreationAttributes extends Optional<NoteAttributes, 'note_id'> {}

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  public note_id!: number;
  public instructor_id!: number;
  public golfer_id!: number;
  public class_id!: number;
  public note_content!: string;
  public created_at!: Date;
}

export const NoteModelInit = (sequelize: Sequelize) => {
  Note.init(
    {
      note_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      instructor_id: { type: DataTypes.INTEGER, allowNull: false },
      golfer_id: { type: DataTypes.INTEGER, allowNull: false },
      class_id: { type: DataTypes.INTEGER, allowNull: false },
      note_content: { type: DataTypes.TEXT, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'notes' }
  );

  return Note;
};