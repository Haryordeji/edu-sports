import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  instructor: string;
  startTime: string;
  endTime: string;
  location: string;
  day: number; 
  level: number;
}

const WeeklyCalendar: React.FC = () => {
  const [currentWeek] = useState(startOfWeek(new Date()));
  
  // Some Mock data
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Practice your Swing',
      instructor: 'Daniel Jerome',
      startTime: '3:00 pm',
      endTime: '5:30 pm',
      location: '429 John F. Kennedy Way',
      day: 1,
      level: 1,
    },
    {
      id: '2',
      title: 'On the Golf Course',
      instructor: 'Sharon Camper',
      startTime: '3:00 pm',
      endTime: '5:30 pm',
      location: '429 John F. Kennedy Way',
      day: 5,
      level: 2,
    }
  ]);

  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 7);

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const getEventsForDayAndTime = (day: number, hour: number) => {
    return events.filter(event => {
      const eventHour = parseInt(event.startTime.split(':')[0]) + 
        (event.startTime.includes('pm') ? 12 : 0);
      return event.day === day && eventHour === hour;
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        {days.map((day, index) => (
          <div key={index} className="calendar-day-header">
            {format(day, 'EEE').toUpperCase()}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid">
        <div className="time-column">
          {timeSlots.map(hour => (
            <div key={hour} className="time-slot">
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour-12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>

        {days.map((_, dayIndex) => (
          <div key={dayIndex} className="day-column">
            {timeSlots.map(hour => {
              const dayEvents = getEventsForDayAndTime(dayIndex, hour);
              return (
                <div key={`${dayIndex}-${hour}`} className="calendar-cell">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={`event-card ${event.level}`}
                      style={{ height: '170px' }}
                    >
                      <div className="event-content">
                        <h4>{event.title}</h4>
                        <p>with - {event.instructor}</p>
                        <p>{event.startTime} - {event.endTime}</p>
                        <p>{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;