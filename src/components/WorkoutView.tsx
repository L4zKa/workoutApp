import type { WorkoutSession, WorkoutTemplate } from "../storage";
import {
  Button,
  Divider,
  Dropdown,
  Text,
  Option,
  Field,
  Subtitle1,
} from "@fluentui/react-components";
import { formatTime, useStyles } from "../helpers/globalFunctions";
import ExerciseLogger from "./ExerciseLogger";

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
        <>
          <Field label={"Template auswählen"}>
            <Dropdown
              value={
                props.templates.find((x) => x.id == props.activeTemplateId)
                  ?.name ?? ""
              }
              defaultSelectedOptions={[props.activeTemplateId]}
              onOptionSelect={(ev, data) => {
                props.setActiveTemplateId(data.optionValue ?? "");
              }}
            >
              {props.templates.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <div className={styles.row}>
            <Button
              appearance="primary"
              onClick={props.startSession}
              disabled={!props.templates.length}
            >
              Workout starten
            </Button>
          </div>
        </>
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
            />
          ))}
          <Divider />
          <br />
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
