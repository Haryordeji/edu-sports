import { Request, Response } from 'express';
import { models } from '../db';
import { UUID } from 'crypto';

// Add Feedback for a Student in a Specific Class
export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { instructor_id, golfer_id, class_id, note_content } = req.body;

    if (!instructor_id || !golfer_id || !class_id || !note_content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Create the feedback
    const feedback = await models.Feedback.create({
      feedback_id: crypto.randomUUID(),
      instructor_id,
      golfer_id,
      class_id,
      note_content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Fetch the feedback with class title and instructor name
    const feedbackDetails: any = await models.Feedback.findOne({
      where: { feedback_id: feedback.feedback_id },
      include: [
        {
          model: models.Class,
          as: 'class',
          attributes: ['title'],
        },
        {
          model: models.User,
          as: 'instructor',
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    if (!feedbackDetails) {
      return res.status(404).json({
        success: false,
        message: 'Feedback created but could not retrieve details',
      });
    }

    res.status(201).json({
      success: true,
      feedback: {
        feedback_id: feedbackDetails.feedback_id,
        note_content: feedbackDetails.note_content,
        class: feedbackDetails.class?.title || 'Unknown Class',
        instructor_name: feedbackDetails.instructor
          ? `${feedbackDetails.instructor.first_name} ${feedbackDetails.instructor.last_name}`
          : 'Unknown Instructor',
        createdAt: feedbackDetails.createdAt,
        updatedAt: feedbackDetails.updatedAt,
      },
      message: 'Feedback added successfully',
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
// Get All Feedback for a Student with Class Details
export const getFeedbackForStudent = async (req: Request<{ golferId: string }>, res: Response) => {
  try {
    const { golferId } = req.params;

    const feedbacks = await models.Feedback.findAll({
      where: { golfer_id: golferId },
      include: [
        {
          model: models.Class,
          as: 'class',
          attributes: ['class_id', 'title'],
        },
        {
          model: models.User,
          as: 'instructor', 
          attributes: ['first_name', 'last_name'], 
        },
      ],
    });

    if (!feedbacks.length) {
      return res.status(200).json({
        success: false,
        message: 'No feedback found for this student',
        feedbacks: [],
      });
    }

    const formattedFeedback = feedbacks.map((feedback: any) => ({
      feedback_id: feedback.feedback_id,
      note_content: feedback.note_content,
      class: feedback.class?.title || 'Unknown Class',
      class_id: feedback.class?.class_id,
      instructor_name: feedback.instructor
        ? `${feedback.instructor.first_name} ${feedback.instructor.last_name}`
        : 'Unknown Instructor',
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));    

    res.json({
      success: true,
      feedbacks: formattedFeedback,
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete Feedback
export const deleteFeedback = async (req: Request<{ feedbackId: string }>, res: Response) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await models.Feedback.findOne({ where: { feedback_id: feedbackId } });
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    await models.Feedback.destroy({ where: { feedback_id: feedbackId } });

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update Feedback
export const updateFeedback = async (req: Request<{ feedbackId: string }>, res: Response) => {
  try {
    const { feedbackId } = req.params;
    const { note_content, class_id } = req.body;

    const feedback = await models.Feedback.findOne({ where: { feedback_id: feedbackId } });
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    feedback.note_content = note_content || feedback.note_content;
    feedback.class_id = class_id || feedback.class_id;
    feedback.updatedAt = new Date();
    await feedback.save();

    const updatedFeedback: any = await models.Feedback.findOne({
      where: { feedback_id: feedback.feedback_id },
      include: [
        {
          model: models.Class,
          as: 'class',
          attributes: ['title'],
        },
        {
          model: models.User,
          as: 'instructor',
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    res.json({
      success: true,
      feedback: {
        feedback_id: updatedFeedback.feedback_id,
        note_content: updatedFeedback.note_content,
        class: updatedFeedback.class?.title || 'Unknown Class',
        instructor_name: updatedFeedback.instructor
          ? `${updatedFeedback.instructor.first_name} ${updatedFeedback.instructor.last_name}`
          : 'Unknown Instructor',
        createdAt: updatedFeedback.createdAt,
        updatedAt: updatedFeedback.updatedAt,
      },
      message: 'Feedback updated successfully',
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

  
