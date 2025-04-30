export enum ExerciseCategory {
  PUSH = 'Push',
  PULL = 'Pull',
  LEGS = 'Legs',
  CORE = 'Core'
}

export const initialExercises: { [key in ExerciseCategory]: string[] } = {
  [ExerciseCategory.PUSH]: ['Push-ups', 'Dips', 'Handstand Push-ups'],
  [ExerciseCategory.PULL]: ['Pull-ups', 'Chin-ups', 'Rows'],
  [ExerciseCategory.LEGS]: ['Squats', 'Lunges', 'Pistol Squats'],
  [ExerciseCategory.CORE]: ['Plank', 'L-sit', 'Leg Raises']
};