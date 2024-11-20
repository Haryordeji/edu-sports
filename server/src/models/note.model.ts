import { UUID } from 'crypto';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface NoteAttributes {
  note_id: UUID;
  instructor_id: UUID;
  golfer_id: UUID;
  class_id: UUID;
  note_content: string;
  created_at: Date;
}

interface NoteCreationAttributes extends Optional<NoteAttributes, 'note_id'> {}

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  public note_id!: UUID;
  public instructor_id!: UUID;
  public golfer_id!: UUID;
  public class_id!: UUID;
  public note_content!: string;
  public created_at!: Date;
}

export const NoteModelInit = (sequelize: Sequelize) => {
  Note.init(
    {
      note_id: { type: DataTypes.UUID, primaryKey: true },
      instructor_id: { type: DataTypes.UUID, allowNull: false },
      golfer_id: { type: DataTypes.UUID, allowNull: false },
      class_id: { type: DataTypes.UUID, allowNull: false },
      note_content: { type: DataTypes.TEXT, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'notes' }
  );

  return Note;
};