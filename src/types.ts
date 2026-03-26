export type Goal = 'Lose Weight' | 'Build Muscle' | 'Stay Fit' | 'Improve Endurance';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type Gender = 'Male' | 'Female' | 'Other';

export interface UserProfile {
  name: string;
  goal: Goal;
  height: number;
  weight: number;
  age: number;
  gender: Gender;
  experience: ExperienceLevel;
  onboarded: boolean;
}

export interface Workout {
  id: string;
  title: string;
  category: string;
  duration: number;
  calories: number;
  difficulty: ExperienceLevel;
  image: string;
  exercises: string[];
}

export interface DailyStats {
  steps: number;
  caloriesBurned: number;
  workoutTime: number;
  waterIntake: number;
}
