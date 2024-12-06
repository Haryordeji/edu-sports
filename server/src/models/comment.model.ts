import { UUID } from 'crypto';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CommentAttributes {
  comment_id: UUID;
  feedback_id: UUID;
  author_id: UUID;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'comment_id'> {}

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public comment_id!: UUID;
  public feedback_id!: UUID;
  public author_id!: UUID;
  public content!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const CommentModelInit = (sequelize: Sequelize) => {
  Comment.init(
    {
      comment_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      feedback_id: { type: DataTypes.UUID, allowNull: false },
      author_id: { type: DataTypes.UUID, allowNull: false }, // could be any type of user
      content: { type: DataTypes.TEXT, allowNull: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'comments', timestamps: false }
  );

  return Comment;
};
