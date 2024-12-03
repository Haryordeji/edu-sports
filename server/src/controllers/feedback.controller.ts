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

    const feedback = await models.Feedback.create({
      feedback_id: crypto.randomUUID(),
      instructor_id,
      golfer_id,
      class_id,
      note_content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      feedback,
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
      ],
    });

    if (!feedbacks.length) {
      return res.status(404).json({
        success: false,
        message: 'No feedback found for this student',
      });
    }

    const formattedFeedback = feedbacks.map((feedback: any) => ({
      feedback_id: feedback.feedback_id,
      note_content: feedback.note_content,
      class: feedback.class?.title || 'Unknown Class',
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
      const { note_content } = req.body;
  
      const feedback = await models.Feedback.findOne({ where: { feedback_id: feedbackId } });
      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found',
        });
      }
  
      feedback.note_content = note_content || feedback.note_content;
      feedback.updatedAt = new Date();
      await feedback.save();
  
      res.json({
        success: true,
        feedback,
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
  
