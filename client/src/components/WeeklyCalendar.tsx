import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import instance from '../utils/axios';

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
        const parsedEvents = data.classes.map((event: any) => ({
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
      views={[Views.DAY, Views.WEEK, Views.AGENDA]}
      defaultView={"day"}
      min={new Date(2024, 10, 8, 9, 0)}
      max={new Date(2024, 10, 8, 18, 0)}
      onSelectEvent={handleEventSelect}
      className="custom-calendar"
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WeeklyCalendar;