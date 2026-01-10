export type Id = string;

export type ExerciseSet = {
  id: Id;
  weightKg: number;
  reps: number;
  createdAt: string; // ISO
};

export type Exercise = {
  id: Id;
  name: string;
  sets: ExerciseSet[];
};

export type TemplateExercise = {
  id: Id;
  name: string;
  setGoal: number;
  repsGoal: number;
};

export type WorkoutTemplate = {
  id: Id;
  name: string;
  exercises: TemplateExercise[];
};

export type WorkoutSession = {
  id: Id;
  templateId: Id;
  templateName: string;
  startedAt: string; // ISO
  endedAt?: string; // ISO
  exercises: Exercise[];
};

export type AppState = {
  version: 1;
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
};

const STORAGE_KEY = "workout-tracker.v1";

export function newId(): Id {
  // Good-enough local ID. If you later add sync, switch to uuid.
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || parsed.version !== 1) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function defaultState(): AppState {
  // A few starter templates so the app is immediately usable.
  const pushId = newId();
  const pullId = newId();
  const legsId = newId();

  return {
    version: 1,
    templates: [
      {
        id: pushId,
        name: "Push",
        exercises: [
          {
            id: newId(),
            name: "Bench Press",
            setGoal: 0,
            repsGoal: 0,
          },
          {
            id: newId(),
            name: "Incline DB Press",
            setGoal: 0,
            repsGoal: 0,
          },
          {
            id: newId(),
            name: "Shoulder Press",
            setGoal: 0,
            repsGoal: 0,
          },
          {
            id: newId(),
            name: "Triceps Pushdown",
            setGoal: 0,
            repsGoal: 0,
          },
        ],
      },
      {
        id: pullId,
        name: "Pull",
        exercises: [
          {
            id: newId(),
            name: "Pull-Ups",
            setGoal: 0,
            repsGoal: 0,
          },
          {
            id: newId(),
            name: "Barbell Row",
            setGoal: 0,
            repsGoal: 0,
          },
          {
            id: newId(),
            name: "Lat Pulldown",
            setGoal: 0,
            repsGoal: 0,
          },
          {
            id: newId(),
            name: "Biceps Curl",
            setGoal: 0,
            repsGoal: 0,
          },
        ],
      },
      {
        id: legsId,
        name: "Legs",
        exercises: [
          {
            id: newId(),
            name: "Squat",
            setGoal: 0,
            repsGoal: 0,
          },
          {
            id: newId(),
            name: "Romanian Deadlift",
            setGoal: 0,
            repsGoal: 0,
          },
          {
            id: newId(),
            name: "Leg Press",
            setGoal: 0,
            repsGoal: 0,
          },
          {
            id: newId(),
            name: "Calf Raise",
            setGoal: 0,
            repsGoal: 0,
          },
        ],
      },
    ],
    sessions: [],
  };
}
