import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../utils/axios";
import ProfileDropdown from "./ProfileDropdown";

interface Note {
  note_id: string;
  instructor_id: string;
  golfer_id: string;
  class_id: string;
  note_content: string;
  created_at: Date;
}

interface Class {
  class_id: string;
  title: string;
  instructor: string;
  start: Date;
  end: Date;
  location: string;
  level: number;
}

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
}

const styles = {
  button: {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1rem",
  },
};

const FeedbackDashboard: React.FC = () => {
  const { golferid } = useParams<{ golferid: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [commentingNote, setCommentingNote] = useState<Note | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  const storedUserJson = localStorage.getItem("user");
  const storedUser = storedUserJson ? JSON.parse(storedUserJson) : {};
  const storedUserId = storedUser.user_id || "";
  const storedUserType = storedUser.user_type || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, classesRes, usersRes] = await Promise.all([
          instance.get(`/golfers/${golferid}/notes`),
          instance.get("/classes", { withCredentials: true }),
          instance.get("/users", { withCredentials: true }),
        ]);
        setNotes(notesRes.data.notes);
        setClasses(classesRes.data.classes || []);
        setUsers(usersRes.data.users || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [golferid]);

  const handleAddComment = async () => {
    if (!commentingNote || !newComment.trim()) return;

    try {
      await instance.post(`/notes/${commentingNote.note_id}/comments`, {
        content: newComment,
      });
      const response = await instance.get(`/golfers/${golferid}/notes`);
      setNotes(response.data.notes);
      setCommentingNote(null);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div 
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <div className="logo">
            <Link to={`/admin/dashboard/${storedUserId}/?tab=schedule`}>
              <img 
                src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg" 
                alt="Company Logo" 
                style={{ width: "200px", height: "auto" }}
              />
            </Link>
          </div>
          <div>
            <ProfileDropdown user_id={storedUserId} user_type={storedUserType} />
          </div>
        </div>

        <nav className="main-nav">
          <div className="nav-links">
            <button 
              onClick={() => navigate(-1)}
              className="nav-link text-gray-600 hover:text-black"
            >
              ← Back to Academy
            </button>
          </div>
        </nav>
      </header>

      <div style={{paddingTop: "2rem"}}>
        <div style={{ marginBottom: "1rem", padding: "20px" }}>
          <div className="mb-6 flex justify-between items-center">
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1F2937",
              }}
            >
              Feedback Management
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {notes.map((note) => {
              const instructor = users.find((u) => u.user_id === note.instructor_id);
              const classDetails = classes.find((cls) => cls.class_id === note.class_id);

              return (
                <div
                  key={note.note_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: "#ffffff",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #E5E7EB",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)")
                  }
                >
                  <div>
                    <span style={{ fontWeight: 500, color: "#111827" }}>
                      {classDetails?.title || "Class"} Feedback from{" "}
                      {format(new Date(note.created_at), "MMM do")}
                    </span>
                    <span
                      style={{
                        marginLeft: "1rem",
                        fontSize: "0.875rem",
                        color: "#6B7280",
                      }}
                    >
                      by {instructor?.first_name || "Unknown"} {instructor?.last_name || ""}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => setCommentingNote(note)}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        color: "#2563EB",
                        border: "1px solid #2563EB",
                        borderRadius: "0.375rem",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#EFF6FF")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      Add Comment
                    </button>
                    <button
                      onClick={() => setViewingNote(note)}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        color: "#2563EB",
                        border: "1px solid #2563EB",
                        borderRadius: "0.375rem",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#EFF6FF")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      View Feedback
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Popups */}
      {viewingNote && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={() => setViewingNote(null)}>
              &times;
            </span>
            <h2>
              {classes.find((cls) => cls.class_id === viewingNote.class_id)?.title ||
                "Feedback"}
            </h2>
            <p>{viewingNote.note_content}</p>
          </div>
        </div>
      )}
      {commentingNote && (
        <div className="popup">
          <div className="popup-content">
            <span
              className="close-btn"
              onClick={() => setCommentingNote(null)}
            >
              &times;
            </span>
            <h2>Add Comment</h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
            />
            <button
              style={{
                ...styles.button,
                backgroundColor: "#2563EB",
                color: "#ffffff",
                border: "none",
              }}
              onClick={handleAddComment}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Popup Styling */}
      <style>{`
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          position: relative;
          width: 80%;
          max-width: 500px;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          font-size: 20px;
        }
        textarea {
          width: 100%;
          height: 100px;
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
};

export default FeedbackDashboard;