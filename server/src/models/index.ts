import { UserModelInit } from './user.model';
import { ClassModelInit } from './class.model';
import { CommentModelInit } from './comment.model';
import { FeedbackModelInit } from './feedback.model';
import { Sequelize } from 'sequelize';

export const initModels = (sequelize: Sequelize) => {
  const User = UserModelInit(sequelize);
  const Class = ClassModelInit(sequelize);
  const Feedback = FeedbackModelInit(sequelize);
  const Comment = CommentModelInit(sequelize);

  // Feedback to User relationships
Feedback.belongsTo(User, {
  foreignKey: 'golfer_id',
  as: 'golfer',
  onDelete: 'CASCADE',
});

Feedback.belongsTo(User, {
  foreignKey: 'instructor_id',
  as: 'instructor',
  onDelete: 'CASCADE',
});

// User to Feedback relationships
User.hasMany(Feedback, {
  foreignKey: 'golfer_id',
  as: 'golferFeedbacks',
  onDelete: 'CASCADE',
});

User.hasMany(Feedback, {
  foreignKey: 'instructor_id',
  as: 'instructorFeedbacks',
  onDelete: 'CASCADE',
});

// Feedback to Class relationships
Feedback.belongsTo(Class, {
  foreignKey: 'class_id',
  as: 'class',
  onDelete: 'CASCADE',
});

Class.hasMany(Feedback, {
  foreignKey: 'class_id',
  as: 'feedbacks',
  onDelete: 'CASCADE',
});

// Feedback to Comment relationships
Feedback.hasMany(Comment, {
  foreignKey: 'feedback_id',
  as: 'comments',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Feedback, {
  foreignKey: 'feedback_id',
  as: 'feedback',
  onDelete: 'CASCADE',
});

// Comment to User relationships
Comment.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author',
  onDelete: 'CASCADE',
});

User.hasMany(Comment, {
  foreignKey: 'author_id',
  as: 'authoredComments',
  onDelete: 'CASCADE',
});

  return { User, Class, Comment, Feedback };
};