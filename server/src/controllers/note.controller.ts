import { Request, Response } from 'express';
import { models } from '../db';
import { UUID } from 'crypto';

interface NoteRequest {
    instructor_id: UUID;
    golfer_id: UUID;
    class_id: UUID;
    note_content: string;
}

// Create a new note
export const createNote = async (req: Request<{}, {}, NoteRequest>, res: Response) => {
    try {
        const { instructor_id, golfer_id, class_id, note_content } = req.body;

        if (!instructor_id || !golfer_id || !class_id || !note_content) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const note = await models.Note.create({
            note_id: crypto.randomUUID(),
            instructor_id,
            golfer_id,
            class_id,
            note_content,
            created_at: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note
        });
    } catch (error) {
        console.error('Create note error:', error); // Log full error
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};


// Retrieve a note by ID
export const getNoteById = async (req: Request<{ noteId: string }>, res: Response) => {
    try {
        const noteId = req.params.noteId as UUID;

        const note = await models.Note.findByPk(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({
            success: true,
            note
        });
    } catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a note
export const updateNote = async (req: Request<{ noteId: string }, {}, NoteRequest>, res: Response) => {
    try {
        const noteId = req.params.noteId as UUID;
        const { note_content } = req.body;

        if (!note_content) {
            return res.status(400).json({ message: 'Note content is required for update' });
        }

        const updated = await models.Note.update({ note_content }, {
            where: { note_id: noteId }
        });

        if (updated[0] === 0) {
            return res.status(404).json({ message: 'Note not found or no changes made' });
        }

        res.status(200).json({
            success: true,
            message: 'Note updated successfully'
        });
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a note
export const deleteNote = async (req: Request<{ noteId: string }>, res: Response) => {
    try {
        const noteId = req.params.noteId as UUID;

        const deleted = await models.Note.destroy({
            where: { note_id: noteId }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// List all notes
export const listNotes = async (req: Request, res: Response) => {
    try {
        const instructor_id: UUID | undefined = req.query.instructor_id as UUID;
        const golfer_id: UUID | undefined = req.query.golfer_id as UUID;
        const class_id: UUID | undefined = req.query.class_id as UUID;

        const where: {
            instructor_id?: UUID;
            golfer_id?: UUID;
            class_id?: UUID;
        } = {};

        if (instructor_id) where.instructor_id = instructor_id;
        if (golfer_id) where.golfer_id = golfer_id;
        if (class_id) where.class_id = class_id;

        const notes = await models.Note.findAll({ where });

        res.status(200).json({
            success: true,
            notes
        });
    } catch (error) {
        console.error('List notes error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
