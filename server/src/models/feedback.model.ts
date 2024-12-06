import { UUID } from 'crypto';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface FeedbackAttributes {
  feedback_id: UUID;
  instructor_id: UUID;
  golfer_id: UUID;
  class_id: UUID;
  note_content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteCreationAttributes extends Optional<FeedbackAttributes, 'feedback_id'> {}

export class Feedback extends Model<FeedbackAttributes, NoteCreationAttributes> implements FeedbackAttributes {
  public feedback_id!: UUID;
  public instructor_id!: UUID;
  public golfer_id!: UUID;
  public class_id!: UUID;
  public note_content!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const FeedbackModelInit = (sequelize: Sequelize) => {
  Feedback.init(
    {
      feedback_id: { type: DataTypes.UUID, primaryKey: true },
      instructor_id: { type: DataTypes.UUID, allowNull: false },
      golfer_id: { type: DataTypes.UUID, allowNull: false },
      class_id: { type: DataTypes.UUID, allowNull: false },
      note_content: { type: DataTypes.TEXT, allowNull: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'feedback' }
  );

  return Feedback;
};