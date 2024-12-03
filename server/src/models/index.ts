import { UserModelInit } from './user.model';
import { ClassModelInit } from './class.model';
import { ClassInstructorModelInit } from './class_instructor.model';
import { ClassRegistrationModelInit } from './class_registration.model';
import { CommentModelInit } from './comment.model';
import { FeedbackModelInit } from './feedback.model';
import { Sequelize } from 'sequelize';

export const initModels = (sequelize: Sequelize) => {
  const User = UserModelInit(sequelize);
  const Class = ClassModelInit(sequelize);
  const ClassInstructor = ClassInstructorModelInit(sequelize);
  const ClassRegistration = ClassRegistrationModelInit(sequelize);
  const Feedback = FeedbackModelInit(sequelize);
  const Comment = CommentModelInit(sequelize);

  // Define relationships
  ClassInstructor.belongsTo(User, { foreignKey: 'instructor_id' });
  ClassInstructor.belongsTo(Class, { foreignKey: 'class_id' });

  ClassRegistration.belongsTo(User, { foreignKey: 'user_id' });
  ClassRegistration.belongsTo(Class, { foreignKey: 'class_id' });

  // Feedback is associated with a golfer and a class
  // Comments are associated with feedback
  Feedback.belongsTo(User, {
    foreignKey: 'golfer_id',
    as: 'golfer',
  });

  User.hasMany(Feedback, {
    foreignKey: 'golfer_id',
    as: 'feedbacks',
    onDelete: 'CASCADE',
  });

  Feedback.belongsTo(Class, {
    foreignKey: 'class_id',
    as: 'class',
  });

  Class.hasMany(Feedback, {
    foreignKey: 'class_id',
    as: 'feedbacks',
    onDelete: 'CASCADE', 
  });

  Feedback.hasMany(Comment, {
    foreignKey: 'feedback_id',
    as: 'comments',
    onDelete: 'CASCADE', 
  });

  Comment.belongsTo(Feedback, {
    foreignKey: 'feedback_id',
    as: 'feedback',
  });

  return { User, Class, ClassInstructor, ClassRegistration, Comment, Feedback };
};