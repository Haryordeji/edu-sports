'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('classes', 'name', 'title');
    await queryInterface.renameColumn('classes', 'start_time', 'start');
    await queryInterface.renameColumn('classes', 'end_time', 'end');

    await queryInterface.addColumn('classes', 'instructor', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.removeColumn('classes', 'skill_level');
    await queryInterface.addColumn('classes', 'level', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('classes', 'title', 'name');
    await queryInterface.renameColumn('classes', 'start', 'start_time');
    await queryInterface.renameColumn('classes', 'end', 'end_time');
    
    await queryInterface.removeColumn('classes', 'instructor');
    
    await queryInterface.removeColumn('classes', 'level');
    await queryInterface.addColumn('classes', 'skill_level', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};