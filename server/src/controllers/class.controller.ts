import { Request, Response } from 'express';
import { models } from '../db';
import { UUID } from 'crypto';

interface ClassAttributes {
  class_id: UUID;
  title: string;
  start: Date;
  end: Date;
  location: string;
  instructor: string;
  level: number;
}

interface CreateClassRequest {
  title: string;
  start: string;
  end: string;
  location: string;
  instructor: string;
  level: number;
}

// Create class controller
export const createClass = async (req: Request<{}, {}, CreateClassRequest>, res: Response) => {
  try {
    const {
      title,
      start,
      end,
      location,
      instructor,
      level
    } = req.body;

    // Required fields 
    if (!title || !start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const newClass = await models.Class.create({
      class_id: crypto.randomUUID(),
      title,
      start: new Date(start),
      end: new Date(end),
      location,
      instructor,
      level
    });

    const classData = {
      class_id: newClass.class_id,
      title: newClass.title,
      start: newClass.start,
      end: newClass.end,
      location: newClass.location,
      instructor: newClass.instructor,
      level: newClass.level
    };

    res.status(201).json({
      success: true,
      class: classData,
      message: 'Class created successfully'
    });

  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Update class controller
export const updateClass = async (req: Request<{ classId: string }, {}, Partial<CreateClassRequest>>, res: Response) => {
  try {
    const { classId } = req.params;
    const updates = req.body;

    const classRecord = await models.Class.findOne({ where: { class_id: classId }});
    if (!classRecord) {
      return res.status(404).json({ 
        success: false,
        message: 'Class not found' 
      });
    }

    const updateData: any = {
      ...(updates.title && { title: updates.title }),
      ...(updates.start && { start: new Date(updates.start) }),
      ...(updates.end && { end: new Date(updates.end) }),
      ...(updates.location && { location: updates.location }),
      ...(updates.instructor && { instructor: updates.instructor }),
      ...(updates.level !== undefined && { level: updates.level })
    };

    // Update class
    await models.Class.update(updateData, {
      where: { class_id: classId }
    });

    // Get updated class
    const updatedClass = await models.Class.findOne({ where: { class_id: classId }});
    if (!updatedClass) {
      return res.status(404).json({ 
        success: false,
        message: 'Class not found' 
      });
    }

    const classData = {
      class_id: updatedClass.class_id,
      title: updatedClass.title,
      start: updatedClass.start,
      end: updatedClass.end,
      location: updatedClass.location,
      instructor: updatedClass.instructor,
      level: updatedClass.level
    };

    res.json({
      success: true,
      class: classData,
      message: 'Class updated successfully'
    });

  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Delete class controller
export const deleteClass = async (req: Request<{ classId: string }>, res: Response) => {
  try {
    const { classId } = req.params;

    const classRecord = await models.Class.findOne({ where: { class_id: classId }});
    if (!classRecord) {
      return res.status(404).json({ 
        success: false,
        message: 'Class not found' 
      });
    }

    await models.Class.destroy({
      where: { class_id: classId }
    });

    res.json({
      success: true,
      message: 'Class deleted successfully'
    });

  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Get single class controller
export const getClass = async (req: Request<{ classId: string }>, res: Response) => {
  try {
    const { classId } = req.params;

    const classRecord = await models.Class.findOne({ 
      where: { class_id: classId }
    });

    if (!classRecord) {
      return res.status(404).json({ 
        success: false,
        message: 'Class not found' 
      });
    }

    const classData = {
      class_id: classRecord.class_id,
      title: classRecord.title,
      start: classRecord.start,
      end: classRecord.end,
      location: classRecord.location,
      instructor: classRecord.instructor,
      level: classRecord.level
    };

    res.json({
      success: true,
      class: classData
    });

  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Get all classes controller
export const getClasses = async (req: Request, res: Response) => {
  try {
    const { instructor, startDate, endDate } = req.query;
    const where: any = {};
    
    if (instructor) {
      where.instructor = instructor;
    }
    
    // not sure how to do this correctly
    // if (startDate && endDate) {
    //   where.start = {
    //     [models.Sequelize.Op.between]: [
    //       new Date(startDate as string),
    //       new Date(endDate as string)
    //     ]
    //   };
    // }

    const classes = await models.Class.findAll({ 
      where,
      order: [['start', 'ASC']]
    });

    const formattedClasses = classes.map(classRecord => ({
      class_id: classRecord.class_id,
      title: classRecord.title,
      start: classRecord.start,
      end: classRecord.end,
      location: classRecord.location,
      instructor: classRecord.instructor,
      level: classRecord.level
    }));

    return res.status(200).json({
      success: true,
      classes: formattedClasses
    });

  } catch (error) {
    console.error('Get classes error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};