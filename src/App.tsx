import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './components/Calendar';
import WorkoutForm from './components/WorkoutForm';
import SideNav from './components/SideNav';
import { initialExercises, ExerciseCategory } from './utils/exercises';
import './App.css';

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
  const [isOpen, setIsOpen] = useState(true);

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

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

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
    <Router>
      <div className="App">
        <h1 className="text-3xl font-bold text-center my-4">Calisthenics Tracker</h1>
        <SideNav isOpen={isOpen} toggleNav={toggleNav} />
        <div className={`main-content ${isOpen ? '' : 'nav-closed'}`}>
          <Routes>
            <Route
              path="/training"
              element={
                <Calendar
                  workouts={workouts}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                  isOpen={isOpen} // Pass isOpen to Calendar
                />
              }
            />
            <Route
              path="*"
              element={
                <Calendar
                  workouts={workouts}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                  isOpen={isOpen} // Pass isOpen to Calendar
                />
              }
            />
          </Routes>
          
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
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="modal-close-button" onClick={handleDetailsClose}>
                  <svg
                    className="modal-close-icon"
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
                <h2 className="modal-title">Workout of {showDetails.date}</h2>
                <hr className="modal-divider" />
                <div className="modal-exercise-list">
                  {Object.entries(getGroupedExercises(showDetails.exercises)).map(([category, exercises]) => (
                    <div key={category} className="modal-exercise-category">
                      <h3 className="modal-category-title">{category}</h3>
                      <div className="modal-exercise-items">
                        {exercises.map((exercise, index) => (
                          <div key={index} className="modal-exercise-item">
                            {exercise.name} - {exercise.sets} sets × {exercise.reps} reps
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-actions">
                  <button className="modal-delete-button" onClick={() => handleDeleteWorkout(showDetails)}>
                    Delete
                  </button>
                  <button className="modal-edit-button" onClick={() => handleEditWorkout(showDetails)}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;