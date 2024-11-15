import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { useParams } from "react-router-dom";

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
  note_content: string;
  created_at: Date;
}

Modal.setAppElement('#root');

export const FeedbackDashboard: React.FC = () => {
    const { instructorId } = useParams()
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/users/?user_type=golfer');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } 
    } catch (err) {
      setError('Error loading users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewNotes = async (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    try {
      const response = await fetch(`/api/golfers/${user.user_id}/notes`, {method: "GET"});
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Error loading notes');
    }
  };

  const handleSubmitNote = async () => {
    if (!selectedUser || !newNote.trim()) return;

    try {
      const newNoteData = {
        instructor_id: instructorId,
        golfer_id: selectedUser.user_id,
        note_content: newNote
      };

      const response = await fetch('http://localhost:5001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNoteData),
      });

      if (!response.ok) throw new Error('Failed to submit note');
      const data = await response.json();

      if (data.success) {
        setNotes([
          {
            ...newNoteData,
            note_id: data.note_id,
            created_at: new Date(),
          } as Note,
          ...notes
        ]);
        setNewNote('');
      }
    } catch (err) {
      console.error('Error submitting note:', err);
      setError('Error submitting note');
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
            <div>
              <span className="font-medium">
                {user.first_name} {user.last_name}
              </span>
            </div>
            
            <button
              onClick={() => handleViewNotes(user)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add/View Notes
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setNewNote('');
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {selectedUser && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Notes for {selectedUser.first_name} {selectedUser.last_name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <textarea
                  placeholder="Enter new note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full min-h-[100px] p-2 border rounded resize-y"
                />
                <button
                  onClick={handleSubmitNote}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Note
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Previous Notes</h3>
                <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-gray-500">No notes yet</p>
                  ) : (
                    <div className="space-y-4">
                      {notes.map((note) => (
                        <div key={note.note_id} className="border-b pb-2">
                          <p className="text-sm text-gray-600">
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                          <p className="mt-1">{note.note_content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackDashboard;