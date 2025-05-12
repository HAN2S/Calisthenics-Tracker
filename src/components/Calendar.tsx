import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import './Calendar.css';

interface Workout {
  id: number;
  date: string;
  exercises: { name: string; sets: number; reps: number }[];
}

interface CalendarProps {
  workouts: Workout[];
  onDateClick: (date: string) => void;
  onEventClick: (workoutId: string) => void;
  isOpen: boolean; // Add isOpen prop
}

const Calendar: React.FC<CalendarProps> = ({ workouts, onDateClick, onEventClick, isOpen }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const calendarRef = useRef<FullCalendar>(null);

  // Sync FullCalendar with currentDate when it changes
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(currentDate);
    }
  }, [currentDate]);

  // Update calendar size when isOpen changes with a slight delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.updateSize(); // Force size update
      }
    }, 100); // Small delay to ensure DOM updates
    return () => clearTimeout(timer); // Cleanup timer
  }, [isOpen]);

  // Map workouts to FullCalendar events, considering recurring workouts
  const events = workouts.map(workout => {
    const baseDate = new Date(workout.date);
    return {
      id: String(workout.id),
      title: workout.exercises.map(ex => ex.name).join(', '),
      start: baseDate,
      end: baseDate,
      backgroundColor: '#1a73e8',
      borderColor: '#1a73e8',
      textColor: '#fff',
      allDay: true,
    };
  });

  // Handle date click to open the form
  const handleDateClick = (arg: DateClickArg) => {
    onDateClick(arg.dateStr);
  };

  // Handle event click to edit the workout
  const handleEventClick = (arg: EventClickArg) => {
    onEventClick(arg.event.id);
  };

  // Navigation: Previous month
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // Navigation: Next month
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Navigation: Today
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Format the month and year for the header
  const formattedMonthYear = currentDate.toLocaleString('en-EN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="calendar-wrapper">
      {/* Custom Header with Navigation */}
      <div className="calendar-header">
        <h2 className="calendar-title">{formattedMonthYear}</h2>
        <div className="calendar-nav-buttons">
          <button className="nav-button prev-button" onClick={handlePrevMonth}>
            &lt;
          </button>
          <button className="nav-button today-button" onClick={handleToday}>
            Today
          </button>
          <button className="nav-button next-button" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          initialDate={currentDate}
          dayHeaderFormat={{ weekday: 'short' }}
          locale="en"
          headerToolbar={false}
          height="auto"
          eventTimeFormat={{ hour: undefined, minute: undefined }}
        />
      </div>
    </div>
  );
};

export default Calendar;