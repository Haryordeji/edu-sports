import { UserModelInit } from './user.model';
import { ClassModelInit } from './class.model';
import { ClassInstructorModelInit } from './class_instructor.model';
import { ClassRegistrationModelInit } from './class_registration.model';
import { NoteModelInit } from './note.model';
import { Sequelize } from 'sequelize';

export const initModels = (sequelize: Sequelize) => {
  const User = UserModelInit(sequelize);
  const Class = ClassModelInit(sequelize);
  const ClassInstructor = ClassInstructorModelInit(sequelize);
  const ClassRegistration = ClassRegistrationModelInit(sequelize);
  const Note = NoteModelInit(sequelize);

  // Define relationships
  ClassInstructor.belongsTo(User, { foreignKey: 'instructor_id' });
  ClassInstructor.belongsTo(Class, { foreignKey: 'class_id' });

  ClassRegistration.belongsTo(User, { foreignKey: 'user_id' });
  ClassRegistration.belongsTo(Class, { foreignKey: 'class_id' });

  Note.belongsTo(User, { as: 'instructor', foreignKey: 'instructor_id' });
  Note.belongsTo(User, { as: 'golfer', foreignKey: 'golfer_id' });
  Note.belongsTo(Class, { foreignKey: 'class_id' });

  return { User, Class, ClassInstructor, ClassRegistration, Note };
};