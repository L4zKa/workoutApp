import React from "react";
import type { Exercise } from "../storage";
import {
  formatTime,
  isFiniteNumber,
  useStyles,
} from "../helpers/globalFunctions";
import {
  Button,
  Card,
  CardPreview,
  Divider,
  Input,
  Label,
  Text,
} from "@fluentui/react-components";

export default function ExerciseLogger(props: {
  exercise: Exercise;
  disabled: boolean;
  onAddSet(weightKg: number, reps: number): void;
  onDeleteSet(setId: string): void;
}) {
  const styles = useStyles();
  const [weight, setWeight] = React.useState("20");
  const [reps, setReps] = React.useState("8");

  const canAdd =
    !props.disabled && isFiniteNumber(weight) && isFiniteNumber(reps);

  return (
    <Card>
      <CardPreview>
        <div className={styles.cardBody}>
          <div className={styles.exerciseRow}>
            <Text weight="semibold">{props.exercise.name}</Text>
            <Text className={styles.tiny}>
              {props.exercise.sets.length} sets
            </Text>
          </div>

          <div className={styles.setRow}>
            <div>
              <Label>kg</Label>
              <Input
                value={weight}
                onChange={(_, d) => setWeight(d.value)}
                inputMode="decimal"
              />
            </div>
            <div>
              <Label>reps</Label>
              <Input
                value={reps}
                onChange={(_, d) => setReps(d.value)}
                inputMode="numeric"
              />
            </div>
            <Button
              appearance="primary"
              disabled={!canAdd}
              onClick={() => props.onAddSet(Number(weight), Number(reps))}
            >
              + Set
            </Button>
          </div>

          {props.exercise.sets.length > 0 && (
            <>
              <Divider />
              {props.exercise.sets
                .slice()
                .reverse()
                .map((s) => (
                  <div key={s.id} className={styles.exerciseRow}>
                    <Text>
                      {s.weightKg} kg × {s.reps}
                    </Text>
                    <div className={styles.row}>
                      <Text className={styles.tiny}>
                        {formatTime(s.createdAt)}
                      </Text>
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
        </div>
      </CardPreview>
    </Card>
  );
}
