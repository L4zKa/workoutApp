import { Text, Button } from "@fluentui/react-components";
import {
  formatDateTime,
  formatTime,
  useStyles,
} from "../../helpers/globalFunctions";
import type { WorkoutSession } from "../../storage";

export function HistoryView(props: {
  sessions: WorkoutSession[];
  setActiveSessionId(id: string): void;
}) {
  const styles = useStyles();

  const sessions = props.sessions;

  return (
    <div className={styles.box}>
      {sessions.length === 0 ? (
        <Text className={styles.tiny}>No sessions yet.</Text>
      ) : (
        sessions.slice(0, 20).map((s) => {
          const totalSets = s.exercises.reduce(
            (acc, ex) => acc + ex.sets.length,
            0,
          );
          return (
            <div key={s.id}>
              <div className={styles.exerciseRow}>
                <Text weight="semibold">{s.templateName}</Text>
                <Text className={styles.tiny}>{totalSets} sets</Text>
              </div>

              <Text className={styles.tiny}>
                {formatDateTime(s.startedAt)}
                {s.endedAt ? ` → ${formatTime(s.endedAt)}` : ""}
              </Text>
              <Button onClick={() => props.setActiveSessionId(s.id)}>
                Open
              </Button>
            </div>
          );
        })
      )}
    </div>
  );
}
