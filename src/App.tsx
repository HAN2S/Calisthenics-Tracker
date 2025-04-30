import { useState } from 'react';
import Calendar from './components/Calendar';
import WorkoutForm from './components/WorkoutForm';
import { initialExercises, ExerciseCategory } from './utils/exercises';

interface Workout {
  id: number;
  date: string;
  exercises: { name: string; sets: number; reps: number }[];
}

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [showDetails, setShowDetails] = useState<Workout | null>(null);

  const handleDateClick = (date: string) => {
    const existingWorkout = workouts.find(workout => workout.date === date);
    if (existingWorkout) {
      setShowDetails(existingWorkout);
    } else {
      setEditingWorkout(null);
      setSelectedDate(date);
    }
  };

  const handleEventClick = (workoutId: string) => {
    const existingWorkout = workouts.find(workout => String(workout.id) === workoutId);
    if (existingWorkout) {
      setShowDetails(existingWorkout);
    }
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setSelectedDate(workout.date);
    setShowDetails(null);
  };

  const handleDeleteWorkout = (workout: Workout) => {
    setWorkouts(prevWorkouts => prevWorkouts.filter(w => w.id !== workout.id));
    setShowDetails(null);
  };

  const handleFormSubmit = (newWorkouts: Workout[]) => {
    if (editingWorkout) {
      setWorkouts(prevWorkouts =>
        prevWorkouts.map(workout =>
          workout.id === editingWorkout.id
            ? { ...newWorkouts[0], id: editingWorkout.id, date: editingWorkout.date }
            : workout
        )
      );
    } else {
      setWorkouts(prevWorkouts => [...prevWorkouts, ...newWorkouts]);
    }
    setSelectedDate(null);
    setEditingWorkout(null);
  };

  const handleFormCancel = () => {
    setSelectedDate(null);
    setEditingWorkout(null);
  };

  const handleDetailsClose = () => {
    setShowDetails(null);
  };

  // Group exercises by category for the details modal
  const getGroupedExercises = (exercises: { name: string; sets: number; reps: number }[]) => {
    const grouped: { [key in ExerciseCategory]?: { name: string; sets: number; reps: number }[] } = {};
    Object.values(ExerciseCategory).forEach(category => {
      const categoryExercises = initialExercises[category];
      const matchingExercises = exercises.filter(ex => categoryExercises.includes(ex.name));
      if (matchingExercises.length > 0) {
        grouped[category] = matchingExercises;
      }
    });
    return grouped;
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-center my-4">Calisthenics Tracker</h1>
      <Calendar
        workouts={workouts}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />
      {selectedDate && (
        <WorkoutForm
          selectedDate={selectedDate}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialExercises={initialExercises}
          existingWorkout={editingWorkout}
        />
      )}
      {showDetails && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              width: '100%',
              maxWidth: '400px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {/* Close Icon */}
            <button
              onClick={handleDetailsClose}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                style={{ width: '24px', height: '24px', color: '#5f6368' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', marginBottom: '8px' }}>
              Workout of {showDetails.date}
            </h2>
            <hr style={{ border: 'none', borderTop: '1px solid #dadce0', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {Object.entries(getGroupedExercises(showDetails.exercises)).map(([category, exercises]) => (
                <div key={category}>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#202124', marginBottom: '8px' }}>
                    {category}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {exercises.map((exercise, index) => (
                      <div key={index} style={{ fontSize: '14px', color: '#202124' }}>
                        {exercise.name} - {exercise.sets} sets × {exercise.reps} reps
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => handleDeleteWorkout(showDetails)}
                style={{
                  fontSize: '14px',
                  color: '#d93025',
                  background: 'none',
                  border: '1px solid #d93025',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  padding: '8px 12px',
                }}
              >
                Delete
              </button>
              <button
                onClick={() => handleEditWorkout(showDetails)}
                style={{
                  fontSize: '14px',
                  color: '#1a73e8',
                  background: 'none',
                  border: '1px solid #1a73e8',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  padding: '8px 12px',
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;