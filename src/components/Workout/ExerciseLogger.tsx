import { useState } from "react";
import type {
  Exercise,
  TemplateExercise,
  WorkoutTemplate,
} from "../../storage";
import {
  formatTime,
  isFiniteNumber,
  useStyles,
} from "../../helpers/globalFunctions";
import {
  Button,
  Divider,
  Field,
  Input,
  Subtitle2,
  Text,
} from "@fluentui/react-components";

export default function ExerciseLogger(props: {
  template: WorkoutTemplate | undefined;
  exercise: Exercise;
  disabled: boolean;
  onAddSet(weightKg: number, reps: number): void;
  onDeleteSet(setId: string): void;
}) {
  const styles = useStyles();
  const templateExercise: TemplateExercise | undefined =
    props.template?.exercises.find((x) => x.name == props.exercise.name);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState<string>(
    templateExercise?.repsGoal.toString() ?? "",
  );

  const canAdd =
    !props.disabled && isFiniteNumber(weight) && isFiniteNumber(reps);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <Subtitle2>{props.exercise.name}</Subtitle2>
        <Text className={styles.tiny}>
          {props.exercise.sets.length} / {templateExercise?.setGoal}
          sets
        </Text>
      </div>
      {props.exercise.sets.length > 0 && (
        <>
          {props.exercise.sets
            .slice()
            .reverse()
            .map((s) => (
              <div key={s.id} className={styles.exerciseRow}>
                <Text>
                  {s.weightKg} kg × {s.reps}
                </Text>
                <div className={styles.row}>
                  <Text className={styles.tiny}>{formatTime(s.createdAt)}</Text>
                  <Button
                    size="small"
                    onClick={() => props.onDeleteSet(s.id)}
                    disabled={props.disabled}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
        </>
      )}
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <Field label={"kg"} style={{ maxWidth: "15%" }}>
          <Input
            style={{ maxWidth: "25%" }}
            type="number"
            value={weight}
            onChange={(_, d) => setWeight(d.value)}
            inputMode="decimal"
          />
        </Field>
        <Field label={"reps"} style={{ maxWidth: "15%" }}>
          <Input
            style={{ maxWidth: "25%" }}
            type="number"
            value={reps}
            onChange={(_, d) => setReps(d.value)}
            inputMode="numeric"
          />
        </Field>
        <Button
          appearance="primary"
          disabled={!canAdd}
          onClick={() => props.onAddSet(Number(weight), Number(reps))}
        >
          + Satz hinzufügen
        </Button>
      </div>
      <br />
      <Divider />
      <br />
    </div>
  );
}
