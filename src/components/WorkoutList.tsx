interface Workout {
    id: number;
    date: string;
    exercises: { name: string; sets: number; reps: number }[];
  }
  
  interface WorkoutListProps {
    workouts: Workout[];
  }
  
  const WorkoutList: React.FC<WorkoutListProps> = ({ workouts }) => {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Mes séances</h2>
        {workouts.length === 0 ? (
          <p>Aucune séance planifiée.</p>
        ) : (
          <div className="grid gap-4">
            {workouts
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(workout => (
                <div key={workout.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium">Séance du {workout.date}</h3>
                  <ul className="list-disc pl-5">
                    {workout.exercises.map((ex, index) => (
                      <li key={index}>
                        {ex.name} - {ex.sets} séries x {ex.reps} répétitions
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };
  
  export default WorkoutList;