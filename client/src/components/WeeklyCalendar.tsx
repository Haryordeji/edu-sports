import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

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

const WeeklyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('YOUR_API_ENDPOINT_HERE');
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        const parsedEvents = data.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(parsedEvents);
        setError(null);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('There was an issue fetching events. Contact Admin');
      }
    };

    fetchEvents();
  }, []);

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
        views={[Views.WEEK, Views.AGENDA]}
        defaultView={Views.WEEK}
        min={new Date(2024, 10, 8, 12, 0)}
        max={new Date(2024, 10, 8, 18, 0)}
        onSelectEvent={handleEventSelect} 
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Event Details"
        ariaHideApp={false}
        style={{
          content: {
            width: '400px',
            height: '300px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '10px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {selectedEvent && (
          <div>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Instructor:</strong> {selectedEvent.instructor}</p>
            <p><strong>Time:</strong> {moment(selectedEvent.start).format('h:mm a')} - {moment(selectedEvent.end).format('h:mm a')}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Level:</strong> {selectedEvent.level}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WeeklyCalendar;
