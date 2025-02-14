import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import instance from '../utils/axios';
import { GolfLevels } from '../interfaces';

const localizer = momentLocalizer(moment);

export interface Event {
  class_id: string;
  title: string;
  instructor: string;
  start: Date;
  end: Date;
  location: string;
  level: number;
}

export interface EventResponse {
  success: boolean;
  classes: Event[];
}

interface WeeklyCalendarProps {
  levelProp: number[];
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ levelProp }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultView, setDefaultView] = useState("");

  const storedUserJson = localStorage.getItem('user');
  const userType = storedUserJson ? JSON.parse(storedUserJson).user_type : '';

  useEffect(() => {
    const updateDefaultView = () => {
      const isMobile = window.innerWidth < 760; 
      if (isMobile) {
        setDefaultView(Views.DAY)
      }
      else {
        setDefaultView(Views.WEEK)
      }
    };

    updateDefaultView();
    window.addEventListener('resize', updateDefaultView);

    return () => {
      window.removeEventListener('resize', updateDefaultView);
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await instance.get<EventResponse>('/classes', {
          params: {
            level: (levelProp ?? []).join(','),
          },
          withCredentials: true
        });
        const { data } = response;
        const parsedEvents = data.classes.map((event: any) => {
          const startDate = moment.utc(event.start).local().toDate();
          const endDate = moment.utc(event.end).local().toDate();
          return { ...event,
            start: startDate,
            end: endDate,
          };
        });

        setEvents(parsedEvents);
        setError(null);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('There was an issue fetching events. Contact Admin');
      }
    };

    fetchEvents();
  }, [levelProp]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const EventComponent: React.FC<{ event: Event }> = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <div>Instructor: {event.instructor}</div>
      <div>Time: {moment(event.start).format('h:mm a')} - {moment(event.end).format('h:mm a')}</div>
    </div>
  );

  const minTime = moment().set({ hour: 9, minute: 0 }).toDate();
  const maxTime = moment().set({ hour: 18, minute: 0 }).toDate();

  return (
    <div style={{ height: '500px' }}>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
          {error}
        </div>
      )}
     <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '100%' }}
      components={{
        event: EventComponent,
      }}
      views={[Views.DAY, Views.WEEK, Views.AGENDA]}
      defaultView={"day"}
      min={minTime}
      max={maxTime}
      onSelectEvent={handleEventSelect}
      className="custom-calendar"
    />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Event Details"
        ariaHideApp={false}
        className="class-card event-modal"
        overlayClassName="modal-overlay"
        style={{
          content: {
            padding: '1.5rem',
            width: '90%',
            maxWidth: '450px',
            margin: 'auto',
            fontFamily: 'Inter, sans-serif'
          }
        }}
      >
        <button onClick={closeModal} className="close-btn">&times;</button>
        {selectedEvent && (
          <div>
            <div className="class-title" style={{ paddingRight: '2.5rem', marginBottom: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{selectedEvent.title}</div>
            <div className="class-info" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="info-row">
                <span className="info-label">Instructor:</span>
                <span>{selectedEvent.instructor}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Time:</span>
                <span>{moment(selectedEvent.start).format('h:mm a')} - {moment(selectedEvent.end).format('h:mm a')}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Location:</span>
                <span>{selectedEvent.location}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Level:</span>
                <span>{GolfLevels[selectedEvent.level]}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
      {userType === 'golfer' && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderTop: '1px solid #ddd',
          textAlign: 'center',
          fontSize: '14px',
          color: '#666'
        }}>
          <p>If attending lessons at Willingboro location, please use the following link to register: <a href="http://willingbororec.com/" target="_blank" rel="noopener noreferrer">http://willingbororec.com/</a></p>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;