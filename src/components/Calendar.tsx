import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';

interface Workout {
  id: number;
  date: string;
  exercises: { name: string; sets: number; reps: number }[];
}

interface CalendarProps {
  workouts: Workout[];
  onDateClick: (date: string) => void;
  onEventClick: (workoutId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ workouts, onDateClick, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const calendarRef = useRef<FullCalendar>(null);

  // Sync FullCalendar with currentDate when it changes
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(currentDate);
    }
  }, [currentDate]);

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
    <div style={{ marginBottom: '32px', position: 'relative', zIndex: 0 }}>
      {/* Custom Header with Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          padding: '0 16px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 400,
            color: '#202124',
            textTransform: 'capitalize',
          }}
        >
          {formattedMonthYear}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handlePrevMonth}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #dadce0',
              borderRadius: '50%',
              backgroundColor: '#fff',
              color: '#5f6368',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            &lt;
          </button>
          <button
            onClick={handleToday}
            style={{
              padding: '4px 12px',
              border: '1px solid #dadce0',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#5f6368',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #dadce0',
              borderRadius: '50%',
              backgroundColor: '#fff',
              color: '#5f6368',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            &gt;
          </button>
        </div>
      </div>

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
  );
};

export default Calendar;