import * as React from "react";
import {
  FluentProvider,
  TabList,
  Tab,
  Title2,
} from "@fluentui/react-components";

import {
  type AppState,
  type WorkoutTemplate,
  type WorkoutSession,
  type ExerciseSet,
  loadState,
  saveState,
  newId,
} from "./storage";
import { useStyles } from "./helpers/globalFunctions";
import { WorkoutView } from "./components/WorkoutView";
import { TemplatesView } from "./components/TemplatesView/TemplatesView";
import { HistoryView } from "./components/HistoryView";
import { DarkmodeSwitch } from "./components/shared/DarkmodeSwitch";
import { useEffect, useMemo } from "react";
import { myDarkTheme, myLightTheme } from "./appTheme";

type View = "workout" | "templates" | "history";

export default function App() {
  const styles = useStyles();

  const [state, setState] = React.useState<AppState>(() => loadState());
  const [view, setView] = React.useState<View>("workout");

  const [activeTemplateId, setActiveTemplateId] = React.useState<string>(
    state.templates[0]?.id ?? "",
  );

  const [activeSessionId, setActiveSessionId] = React.useState<string>("");

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeTemplate = useMemo(
    () =>
      state.templates.find((t) => t.id === activeTemplateId) ??
      state.templates[0],
    [state.templates, activeTemplateId],
  );

  const activeSession = useMemo(
    () => state.sessions.find((s) => s.id === activeSessionId),
    [state.sessions, activeSessionId],
  );

  const startSession = () => {
    if (!activeTemplate) return;

    const session: WorkoutSession = {
      id: newId(),
      templateId: activeTemplate.id,
      templateName: activeTemplate.name,
      startedAt: new Date().toISOString(),
      exercises: activeTemplate.exercises.map((e) => ({
        id: newId(),
        name: e.name,
        sets: [],
      })),
    };

    setState((prev) => ({ ...prev, sessions: [session, ...prev.sessions] }));
    setActiveSessionId(session.id);
    setView("workout");
  };

  const endSession = () => {
    if (!activeSession) return;
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === activeSession.id
          ? { ...s, endedAt: new Date().toISOString() }
          : s,
      ),
    }));
    setActiveSessionId("");
  };

  const addSet = (exerciseId: string, weightKg: number, reps: number) => {
    if (!activeSession) return;
    const set: ExerciseSet = {
      id: newId(),
      weightKg: Number.isFinite(weightKg) ? weightKg : 0,
      reps: Number.isFinite(reps) ? reps : 0,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => {
        if (s.id !== activeSession.id) return s;
        return {
          ...s,
          exercises: s.exercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, sets: [...ex.sets, set] } : ex,
          ),
        };
      }),
    }));
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    if (!activeSession) return;
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => {
        if (s.id !== activeSession.id) return s;
        return {
          ...s,
          exercises: s.exercises.map((ex) =>
            ex.id === exerciseId
              ? { ...ex, sets: ex.sets.filter((st) => st.id !== setId) }
              : ex,
          ),
        };
      }),
    }));
  };

  const createTemplate = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const t: WorkoutTemplate = {
      id: newId(),
      name: trimmed,
      exercises: [],
    };
    setState((prev) => ({ ...prev, templates: [t, ...prev.templates] }));
    setActiveTemplateId(t.id);
    setView("templates");
  };

  const renameTemplate = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((t) =>
        t.id === id ? { ...t, name: trimmed } : t,
      ),
    }));
  };

  const addExerciseToTemplate = (
    templateId: string,
    exerciseName: string,
    setGoal: number,
    repsGoal: number,
  ) => {
    const trimmed = exerciseName.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((t) =>
        t.id === templateId
          ? {
              ...t,
              exercises: [
                ...t.exercises,
                { id: newId(), name: trimmed, setGoal, repsGoal },
              ],
            }
          : t,
      ),
    }));
  };

  const removeExerciseFromTemplate = (
    templateId: string,
    exerciseId: string,
  ) => {
    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((t) =>
        t.id === templateId
          ? { ...t, exercises: t.exercises.filter((e) => e.id !== exerciseId) }
          : t,
      ),
    }));
  };

  const deleteTemplate = (templateId: string) => {
    setState((prev) => ({
      ...prev,
      templates: prev.templates.filter((t) => t.id !== templateId),
    }));
    if (activeTemplateId === templateId) {
      const remaining = state.templates.filter((t) => t.id !== templateId);
      setActiveTemplateId(remaining[0]?.id ?? "");
    }
  };

  return (
    <FluentProvider
      theme={state.isDarkMode ? myDarkTheme : myLightTheme}
      style={{ height: "97.8vh", padding: "10px", overflow: "auto" }}
    >
      <div className={styles.shell}>
        {/* Header */}
        <div className={styles.topbar}>
          <Title2>Workout Tracker</Title2>
          <div className={styles.row}>
            <DarkmodeSwitch
              checked={state.isDarkMode}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  isDarkMode: event.target.checked,
                }))
              }
            />
          </div>
        </div>

        <TabList
          selectedValue={view}
          onTabSelect={(_, data) => setView(data.value as View)}
        >
          <Tab value="workout">Workout</Tab>
          <Tab value="templates">Templates</Tab>
          <Tab value="history">History</Tab>
        </TabList>

        {/* Content */}
        {view === "workout" && (
          <WorkoutView
            templates={state.templates}
            activeTemplateId={activeTemplateId}
            setActiveTemplateId={setActiveTemplateId}
            createTemplate={createTemplate}
            startSession={startSession}
            activeSession={activeSession}
            setActiveSessionId={setActiveSessionId}
            endSession={endSession}
            addSet={addSet}
            deleteSet={deleteSet}
          />
        )}

        {view === "templates" && (
          <TemplatesView
            templates={state.templates}
            activeTemplateId={activeTemplateId}
            setActiveTemplateId={setActiveTemplateId}
            createTemplate={createTemplate}
            renameTemplate={renameTemplate}
            addExerciseToTemplate={addExerciseToTemplate}
            removeExerciseFromTemplate={removeExerciseFromTemplate}
            deleteTemplate={deleteTemplate}
          />
        )}

        {view === "history" && (
          <HistoryView
            sessions={state.sessions}
            setActiveSessionId={(id) => {
              setActiveSessionId(id);
              setView("workout");
            }}
          />
        )}
      </div>
    </FluentProvider>
  );
}
