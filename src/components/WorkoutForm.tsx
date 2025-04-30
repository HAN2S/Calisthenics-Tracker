import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExerciseCategory } from '../utils/exercises';

interface Exercise {
  name: string;
  checked: boolean;
  sets: number;
  reps: number;
}

interface SelectedExercises {
  [category: string]: Exercise[];
}

interface Workout {
  id: number;
  date: string;
  exercises: { name: string; sets: number; reps: number }[];
}

interface WorkoutFormProps {
  selectedDate: string;
  onSubmit: (newWorkouts: Workout[]) => void;
  onCancel: () => void;
  initialExercises: { [key in ExerciseCategory]: string[] };
  existingWorkout?: Workout | null;
}

// Create a portal root if it doesn't exist
const portalRoot = document.createElement('div');
portalRoot.setAttribute('id', 'modal-root');
if (!document.getElementById('modal-root')) {
  document.body.appendChild(portalRoot);
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ selectedDate, onSubmit, onCancel, initialExercises, existingWorkout }) => {
  const isEditing = !!existingWorkout;

  // Initialize form state based on edit or create mode
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercises>(() => {
    const initialState = Object.values(ExerciseCategory).reduce((acc, category) => {
      acc[category] = initialExercises[category].map((name: string) => ({
        name,
        checked: false,
        sets: 3,
        reps: 8,
      }));
      return acc;
    }, {} as SelectedExercises);

    // Pre-fill form if editing an existing workout
    if (existingWorkout) {
      existingWorkout.exercises.forEach(ex => {
        Object.keys(initialState).forEach(category => {
          const exerciseIndex = initialState[category].findIndex(item => item.name === ex.name);
          if (exerciseIndex !== -1) {
            initialState[category][exerciseIndex] = {
              name: ex.name,
              checked: true,
              sets: ex.sets,
              reps: ex.reps,
            };
          }
        });
      });
    }
    return initialState;
  });

  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringWeeks, setRecurringWeeks] = useState<number>(1);
  const [expandedCategories, setExpandedCategories] = useState<{ [key in ExerciseCategory]?: boolean }>(() =>
    Object.values(ExerciseCategory).reduce((acc, category) => {
      acc[category] = false; // All categories start collapsed
      return acc;
    }, {} as { [key in ExerciseCategory]?: boolean })
  );
  const [focusedCategory, setFocusedCategory] = useState<ExerciseCategory | null>(null);

  // Add ESC key support
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  const handleExerciseChange = (
    category: string,
    index: number,
    field: keyof Exercise,
    value: boolean | number
  ) => {
    const updated = { ...selectedExercises };
    updated[category][index] = { ...updated[category][index], [field]: value };
    setSelectedExercises(updated);
  };

  const handleCategoryToggle = (category: ExerciseCategory) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleFocus = (category: ExerciseCategory) => {
    setFocusedCategory(category);
  };

  const handleBlur = () => {
    setFocusedCategory(null);
  };

  const handleSubmit = () => {
    const selected: { name: string; sets: number; reps: number }[] = [];
    Object.keys(selectedExercises).forEach(category => {
      selectedExercises[category].forEach(ex => {
        if (ex.checked) {
          selected.push({ name: ex.name, sets: ex.sets, reps: ex.reps });
        }
      });
    });

    if (selected.length === 0) {
      alert('Please select at least one exercise.');
      return;
    }

    const newWorkouts: Workout[] = [];
    const baseDate = new Date(selectedDate);
    newWorkouts.push({
      id: isEditing && existingWorkout ? existingWorkout.id : Date.now(),
      date: baseDate.toISOString().split('T')[0],
      exercises: selected,
    });

    if (isRecurring && !isEditing) {
      for (let i = 1; i <= recurringWeeks; i++) {
        const nextDate = new Date(baseDate);
        nextDate.setDate(baseDate.getDate() + i * 7);
        newWorkouts.push({
          id: Date.now() + i,
          date: nextDate.toISOString().split('T')[0],
          exercises: selected,
        });
      }
    }

    onSubmit(newWorkouts);
    setSelectedExercises(() => {
      return Object.values(ExerciseCategory).reduce((acc, category) => {
        acc[category] = initialExercises[category].map(name => ({
          name,
          checked: false,
          sets: 3,
          reps: 8,
        }));
        return acc;
      }, {} as SelectedExercises);
    });
    setIsRecurring(false);
    setRecurringWeeks(1);
  };

  // Format the date for display
  const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

  const modalContent = (
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
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Close Icon */}
        <button
          onClick={onCancel}
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

        {/* Form Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Centered Title */}
          <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#202124', marginBottom: '8px', textAlign: 'center' }}>
            {isEditing ? 'Edit Workout Session' : 'Add Workout Session'}
          </h2>
          {/* Chosen Day with Calendar Icon */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <svg
              style={{ width: '16px', height: '16px', color: 'rgb(95, 99, 104)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span style={{ fontSize: '14px', color: '#202124' }}>{formattedDate}</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #dadce0', marginBottom: '12px' }} />

          {/* Exercise Categories */}
          {Object.values(ExerciseCategory).map(category => (
            <div
              key={category}
              style={{
                border: `1px solid ${
                  expandedCategories[category] && focusedCategory === category ? '#1a73e8' : '#dadce0'
                }`,
                borderRadius: '4px',
                padding: '8px',
                transition: 'border-color 0.3s',
              }}
            >
              {/* Category Header with Toggle */}
              <button
                onClick={() => handleCategoryToggle(category)}
                onFocus={() => handleFocus(category)}
                onBlur={handleBlur}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 0',
                  outline: 'none',
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#202124' }}>{category}</h3>
                <svg
                  style={{
                    width: '16px',
                    height: '16px',
                    transform: expandedCategories[category] ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                    color: '#5f6368',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Exercises (shown only if category is expanded) */}
              <div
                style={{
                  maxHeight: expandedCategories[category] ? '500px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingTop: expandedCategories[category] ? '8px' : '0',
                }}
              >
                {initialExercises[category].map((exercise: string, index: number) => (
                  <div
                    key={exercise}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExercises[category][index].checked}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleExerciseChange(category, index, 'checked', e.target.checked)
                      }
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#1a73e8',
                        borderColor: '#dadce0',
                        borderRadius: '4px',
                      }}
                    />
                    <span style={{ fontSize: '14px', color: '#202124' }}>{exercise}</span>
                    {selectedExercises[category][index].checked && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="number"
                          min="1"
                          value={selectedExercises[category][index].sets}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleExerciseChange(category, index, 'sets', parseInt(e.target.value))
                          }
                          style={{
                            width: '56px',
                            padding: '4px',
                            border: '1px solid #dadce0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none',
                            boxShadow: 'none',
                          }}
                          placeholder="Sets"
                        />
                        <input
                          type="number"
                          min="1"
                          value={selectedExercises[category][index].reps}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleExerciseChange(category, index, 'reps', parseInt(e.target.value))
                          }
                          style={{
                            width: '56px',
                            padding: '4px',
                            border: '1px solid #dadce0',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none',
                            boxShadow: 'none',
                          }}
                          placeholder="Reps"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Recurring Option as Toggle Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#202124' }}>
                Repeat every week
              </span>
              <button
                onClick={() => setIsRecurring(prev => !prev)}
                style={{
                  width: '40px',
                  height: '20px',
                  backgroundColor: isRecurring ? '#1a73e8' : '#dadce0',
                  borderRadius: '10px',
                  border: 'none',
                  padding: '2px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.3s',
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: isRecurring ? '22px' : '2px',
                    transition: 'left 0.3s',
                  }}
                />
              </button>
            </div>
            {isRecurring && (
              <div style={{ marginLeft: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#202124' }}>
                  Number of weeks:
                </span>
                <input
                  type="number"
                  min="1"
                  value={recurringWeeks}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRecurringWeeks(parseInt(e.target.value))
                  }
                  style={{
                    width: '56px',
                    padding: '4px',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                  placeholder="Weeks"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div
            style={{
              paddingTop: '12px',
              borderTop: '1px solid #dadce0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            <button
              onClick={onCancel}
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
              Cancel
            </button>
            <button
              onClick={handleSubmit}
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
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, portalRoot);
};

export default WorkoutForm;