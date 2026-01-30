import type { WorkoutSession, WorkoutTemplate } from "../../storage";
import { Button, Divider, Text, Subtitle1 } from "@fluentui/react-components";
import { formatTime, useStyles } from "../../helpers/globalFunctions";
import ExerciseLogger from "./ExerciseLogger";
import { SelectTemplate } from "./SelectTemplate";

export function WorkoutView(props: {
  templates: WorkoutTemplate[];
  activeTemplateId: string;
  setActiveTemplateId(id: string): void;
  createTemplate(name: string): void;
  startSession(): void;
  activeSession?: WorkoutSession;
  setActiveSessionId(id: string): void;
  endSession(): void;
  addSet(exerciseId: string, weightKg: number, reps: number): void;
  deleteSet(exerciseId: string, setId: string): void;
}) {
  const styles = useStyles();

  return (
    <div className={styles.box}>
      {!props.activeSession ? (
        <SelectTemplate
          activeTemplateId={props.activeTemplateId}
          templates={props.templates}
          startSession={props.startSession}
          setActiveTemplateId={props.setActiveTemplateId}
        />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <Subtitle1>{props.activeSession.templateName}</Subtitle1>

            <Text className={styles.tiny}>
              {props.activeSession.endedAt ? "Ended" : "In progress"} • Started{" "}
              {formatTime(props.activeSession.startedAt)}
            </Text>
          </div>

          <Divider />
          <br />

          {props.activeSession.exercises.map((ex) => (
            <ExerciseLogger
              key={ex.id}
              exercise={ex}
              disabled={!!props.activeSession?.endedAt}
              onAddSet={(w, r) => props.addSet(ex.id, w, r)}
              onDeleteSet={(setId) => props.deleteSet(ex.id, setId)}
              template={props.templates.find(
                (x) => x.name == props.activeSession?.templateName,
              )}
            />
          ))}

          <Button
            onClick={props.endSession}
            disabled={!props.activeSession || !!props.activeSession.endedAt}
          >
            Workout beenden
          </Button>
        </>
      )}
    </div>
  );
}
