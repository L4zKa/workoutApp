import React from "react";
import type { WorkoutSession, WorkoutTemplate } from "../storage";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Input,
  Label,
  Subtitle1,
  Text,
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
  const [newTemplateName, setNewTemplateName] = React.useState("");

  return (
    <div className={styles.grid}>
      <Card>
        <CardHeader header={<Subtitle1>Quick start</Subtitle1>} />
        <div className={styles.cardBody}>
          <Label>Template</Label>
          <select
            value={props.activeTemplateId}
            onChange={(e) => props.setActiveTemplateId(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.15)",
              background: "transparent",
              color: "inherit",
            }}
          >
            {props.templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <div className={styles.row}>
            <Button
              appearance="primary"
              onClick={props.startSession}
              disabled={!props.templates.length}
            >
              Start workout
            </Button>
            <Button
              onClick={props.endSession}
              disabled={!props.activeSession || !!props.activeSession.endedAt}
            >
              End workout
            </Button>
          </div>

          <Divider />

          <Label>Create template</Label>
          <Input
            value={newTemplateName}
            onChange={(_, data) => setNewTemplateName(data.value)}
            placeholder="e.g. Upper"
          />
          <Button
            onClick={() => {
              props.createTemplate(newTemplateName);
              setNewTemplateName("");
            }}
          >
            Add
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader header={<Subtitle1>Current workout</Subtitle1>} />
        <div className={styles.cardBody}>
          {!props.activeSession ? (
            <Text className={styles.tiny}>Start a workout to log sets.</Text>
          ) : (
            <>
              <div className={styles.row}>
                <Text weight="semibold">
                  {props.activeSession.templateName}
                </Text>
                <Text className={styles.tiny}>
                  {props.activeSession.endedAt ? "Ended" : "In progress"} •
                  Started {formatTime(props.activeSession.startedAt)}
                </Text>
              </div>
              <Divider />

              {props.activeSession.exercises.map((ex) => (
                <ExerciseLogger
                  key={ex.id}
                  exercise={ex}
                  disabled={!!props.activeSession?.endedAt}
                  onAddSet={(w, r) => props.addSet(ex.id, w, r)}
                  onDeleteSet={(setId) => props.deleteSet(ex.id, setId)}
                />
              ))}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
