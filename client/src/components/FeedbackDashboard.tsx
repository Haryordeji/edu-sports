import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import instance from '../utils/axios';
import { Event } from './WeeklyCalendar';


const GolferFeedback = () => {
    const { instructorid, golferid } = useParams<{ instructorid: string; golferid: string }>();

    const [notes, setNotes] = useState([]);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editNoteId, setEditNoteId] = useState<string | null>(null);
    const [editNoteContent, setEditNoteContent] = useState('');
    const [classes, setClasses] = useState<Event[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const navigate = useNavigate();


    // Fetch notes for the golfer
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await instance.get(`/golfers/${golferid}/notes`);
                setNotes(response.data.notes);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes();
    }, [golferid]);

    // Fetch available classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await instance.get('/classes', { withCredentials: true });
                const { data } = response;
                if (data.success) {
                    setClasses(data.classes);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);

    // Handle creating a new note
    const handleCreateNote = async () => {
        if (!newNoteContent.trim()) return alert('Note content cannot be empty.');
        if (!selectedClassId) return alert('Please select a class.');

        try {
            await instance.post('/notes', {
                instructor_id: instructorid,
                golfer_id: golferid,
                class_id: selectedClassId,
                note_content: newNoteContent,
            });
            setNewNoteContent('');
            const updatedNotes = await instance.get(`/golfers/${golferid}/notes`);
            setNotes(updatedNotes.data.notes);
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    const handleEditNote = async (noteId: string) => {
        if (!editNoteContent.trim()) return alert('Edited note content cannot be empty.');

        try {
            await instance.put(`/notes/${noteId}`, { note_content: editNoteContent });
            setEditNoteId(null);
            setEditNoteContent('');
            const updatedNotes = await instance.get(`/golfers/${golferid}/notes`);
            setNotes(updatedNotes.data.notes);
        } catch (error) {
            console.error('Error editing note:', error);
        }
    };

    return (
        <div>
          <div>
            <button onClick={() => navigate(-1)}>
            ← Back
            </button>
          </div>
            <h1>Golfer Feedback</h1>
            <h2>Instructor ID: {instructorid}</h2>
            <h2>Golfer ID: {golferid}</h2>

            <div>
                <h3>Create New Note</h3>
                <select
                    value={selectedClassId || ''}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                >
                    <option value="" disabled>Select a class</option>
                    {classes.map((cls) => (
                        <option key={cls.class_id} value={cls.class_id}>
                            {cls.title} ({cls.instructor})
                        </option>
                    ))}
                </select>
                <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Write your note here..."
                />
                <button onClick={handleCreateNote}>Submit Note</button>
            </div>

            <div>
                <h3>Existing Notes</h3>
                {notes.length === 0 ? (
                    <p>No notes available.</p>
                ) : (
                    notes.map((note: any) => (
                        <div key={note.note_id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                            {editNoteId === note.note_id ? (
                                <>
                                    <textarea
                                        value={editNoteContent}
                                        onChange={(e) => setEditNoteContent(e.target.value)}
                                    />
                                    <button onClick={() => handleEditNote(note.note_id)}>Save</button>
                                    <button onClick={() => setEditNoteId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <p>{note.note_content}</p>
                                    <button onClick={() => {
                                        setEditNoteId(note.note_id);
                                        setEditNoteContent(note.note_content);
                                    }}>Edit</button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GolferFeedback;
