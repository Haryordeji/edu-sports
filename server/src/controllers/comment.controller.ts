import { Request, Response } from 'express';
import { models } from '../db';
import { UUID } from 'crypto';

// Add Comment to Feedback
export const addComment = async (req: Request, res: Response) => {
    try {
      const { feedback_id, author_id, content } = req.body;
  
      if (!feedback_id || !author_id || !content) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }
  
      const feedback = await models.Feedback.findOne({ where: { feedback_id } });
      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found',
        });
      }
  
      const comment = await models.Comment.create({
        comment_id: crypto.randomUUID(),
        feedback_id,
        author_id,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      res.status(201).json({
        success: true,
        comment,
        message: 'Comment added successfully',
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  // Get Comments for Feedback
  export const getCommentsForFeedback = async (req: Request<{ feedbackId: string }>, res: Response) => {
    try {
      const { feedbackId } = req.params;
  
      const comments = await models.Comment.findAll({
        where: { feedback_id: feedbackId },
        order: [['createdAt', 'ASC']],
      });
  
      if (!comments.length) {
        return res.status(404).json({
          success: false,
          message: 'No comments found for this feedback',
        });
      }
  
      res.json({
        success: true,
        comments: comments,
      });
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  // Delete Comment
  export const deleteComment = async (req: Request<{ commentId: string }>, res: Response) => {
    try {
      const { commentId } = req.params;
  
      const comment = await models.Comment.findOne({ where: { comment_id: commentId } });
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found',
        });
      }
  
      await models.Comment.destroy({ where: { comment_id: commentId } });
  
      res.json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  