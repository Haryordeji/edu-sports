import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
}

interface Note {
  note_id: string;
  instructor_id: string;
  golfer_id: string;
  class_id: string;
  note_content: string;
  created_at: string;
  instructor?: {
    first_name: string;
    last_name: string;
  };
}

const FeedbackSection: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGolfer, setSelectedGolfer] = useState<string | null>(null);
  const [golferNotes, setGolferNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedGolfer) {
      fetchGolferNotes(selectedGolfer);
    }
  }, [selectedGolfer]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.users.filter((user: User) => user.user_type === 'golfer'));
      }
    } catch (err) {
      setError('Error loading users');
      console.error(err);
    }
  };
  // Get a golfer's notes
  const fetchGolferNotes = async (golferId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/notes?golfer_id=${golferId}`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      
      if (data.success) {
        // Sort notes by creation date, newest first
        const sortedNotes = data.notes.sort((a: Note, b: Note) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setGolferNotes(sortedNotes);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes');
    }
  };
  // Create note for golfer
  const handleCreateNote = async () => {
    if (!selectedGolfer || !newNote.trim()) return;

    try {
      const response = await fetch('http://localhost:5001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructor_id: '550e8400-e29b-41d4-a716-446655440000', // Admin's ID
          golfer_id: selectedGolfer,
          class_id: '00000000-0000-0000-0000-000000000000', // Default class ID
          note_content: newNote,
        }),
      });

      if (!response.ok) throw new Error('Failed to create note');
      
      // Refetch notes to get the updated list
      await fetchGolferNotes(selectedGolfer);
      setNewNote(''); // Clear the input
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note');
    }
  };

    // Delete a note
  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');
      
      // Remove the deleted note from state
      setGolferNotes(golferNotes.filter(note => note.note_id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* Golfers List */}
      <div className="col-span-1 border-r pr-4">
        <h2 className="text-xl font-semibold mb-4">Golfers</h2>
        <div className="space-y-2">
          {users.map(golfer => (
            <div
              key={golfer.user_id} 
              className="p-4 bg-white rounded shadow"
            >
              <div className="font-medium">{golfer.first_name} {golfer.last_name}</div>
              <div className="text-gray-600 mb-2">{golfer.email}</div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/profile/${golfer.user_id}`)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => setSelectedGolfer(golfer.user_id)}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100"
                >
                  View Notes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Display */}
      <div className="col-span-2 pl-4">
        <h2 className="text-xl font-semibold mb-4">
          {selectedGolfer 
            ? `Feedback Notes for ${users.find(u => u.user_id === selectedGolfer)?.first_name || ''}`
            : 'Select a golfer to view feedback'
          }
        </h2>

        {selectedGolfer && (
          <div className="mb-6">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note..."
              className="w-full p-3 border rounded-lg mb-2"
              rows={4}
            />
            <button
              onClick={handleCreateNote}
              disabled={!newNote.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Note
            </button>
          </div>
        )}

        {selectedGolfer ? (
          golferNotes.length > 0 ? (
            <div className="space-y-4">
              {golferNotes.map(note => (
                <div 
                  key={note.note_id} 
                  className="p-4 bg-white rounded-lg shadow relative group"
                >
                  <button
                    onClick={() => handleDeleteNote(note.note_id)}
                    className="absolute top-2 right-2 p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete note"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">
                      From: {note.instructor?.first_name} {note.instructor?.last_name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(note.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{note.note_content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No feedback notes available for this golfer.</p>
          )
        ) : (
          <p className="text-gray-600">Select a golfer to view feedback.</p>
        )}
        
        {error && (
          <div className="text-red-600 mt-4 p-3 bg-red-50 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection;