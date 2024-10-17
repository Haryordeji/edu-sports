import { Sequelize } from 'sequelize';
import { UserModelInit, User } from './user.model';
import { ClassModelInit, Class } from './class.model';
import { ClassInstructorModelInit, ClassInstructor } from './class_instructor.model';
import { ClassRegistrationModelInit, ClassRegistration } from './class_registration.model';
import { NoteModelInit, Note } from './note.model';

const initModels = (sequelize: Sequelize) => {
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

export { initModels };