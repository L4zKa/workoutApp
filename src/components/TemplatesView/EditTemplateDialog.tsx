import { useEffect, useState } from "react";
import type { TemplateExercise, WorkoutTemplate } from "../../storage";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Divider,
  Field,
  Input,
  Subtitle2,
  Text,
} from "@fluentui/react-components";
import { useStyles } from "../../helpers/globalFunctions";

type IEditTemplateDialogProps = {
  selectedTemplate: WorkoutTemplate | undefined;
  onClose: () => void;
  onRename: (templateId: string, newVal: string) => void;
  onAddExercise: (
    templateId: string,
    name: string,
    setGoal: number,
    repsGoal: number
  ) => void;
  onRemoveExercise: (exerciseId: string) => void;
};
export function EditTemplateDialog(props: IEditTemplateDialogProps) {
  const styles = useStyles();
  const template = props.selectedTemplate;
  const emptyExercise: TemplateExercise = {
    name: "",
    id: "",
    setGoal: 0,
    repsGoal: 0,
  };

  const [name, setName] = useState<string>("");
  const [newExercise, setNewExercise] =
    useState<TemplateExercise>(emptyExercise);
  const [newExercises, setNewExercises] = useState<TemplateExercise[]>();

  useEffect(() => {
    if (template != undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(template.name);
      setNewExercises([...template.exercises]);
    }
  }, [props.selectedTemplate]);

  return (
    <Dialog open={props.selectedTemplate != undefined}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Template bearbeiten</DialogTitle>
          <DialogContent
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <Field label={"Name"}>
              <Input value={name ?? ""} onChange={(_, d) => setName(d.value)} />
            </Field>
            <Divider />
            <Subtitle2>Übungen</Subtitle2>
            <div>
              {newExercises?.map((e) => (
                <div key={e.id} className={styles.exerciseRow}>
                  <Text>{e.name}</Text>
                  <Text>
                    {e.setGoal ?? "0"} x {e.repsGoal ?? "0"}
                  </Text>
                  <Button
                    size="small"
                    onClick={() => {
                      const newE = newExercises?.filter((x) => x.id != e.id);
                      setNewExercises(newE);
                    }}
                  >
                    Löschen
                  </Button>
                </div>
              ))}
            </div>
            <Divider />
            <Subtitle2>Übung hinzufügen</Subtitle2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              <Field label={"Name"}>
                <Input
                  value={newExercise?.name}
                  onChange={(_, d) =>
                    setNewExercise({ ...newExercise, name: d.value ?? "" })
                  }
                  placeholder="bsp. Deadlift"
                />
              </Field>
              <Field label={"Sätze"}>
                <Input
                  value={
                    newExercise?.setGoal > 0
                      ? newExercise.setGoal.toString()
                      : ""
                  }
                  onChange={(_, d) =>
                    setNewExercise({
                      ...newExercise,
                      setGoal: Number(d.value) as number,
                    })
                  }
                  placeholder="bsp. 3"
                />
              </Field>
              <Field label={"Wiederholungen"}>
                <Input
                  value={
                    newExercise?.repsGoal > 0
                      ? newExercise.repsGoal.toString()
                      : ""
                  }
                  onChange={(_, d) =>
                    setNewExercise({
                      ...newExercise,
                      repsGoal: Number(d.value) as number,
                    })
                  }
                  placeholder="bsp. 12"
                />
              </Field>
            </div>
            <Button
              appearance="primary"
              onClick={() => {
                newExercises?.push(newExercise);
                setNewExercise(emptyExercise);
              }}
            >
              Hinzufügen
            </Button>{" "}
            <Divider />
          </DialogContent>

          <DialogActions>
            <Button
              appearance="primary"
              onClick={() => {
                props.onRename(template?.id ?? "", name);

                newExercises?.forEach((e) => {
                  if (
                    !props.selectedTemplate?.exercises.find((x) => x.id == e.id)
                  ) {
                    props.onAddExercise(
                      template?.id ?? "",
                      e.name,
                      e.setGoal,
                      e.repsGoal
                    );
                  }
                });
                props.selectedTemplate?.exercises.forEach((e) => {
                  if (!newExercises?.find((x) => x.id == e.id)) {
                    props.onRemoveExercise(e.id);
                  }
                });
              }}
            >
              Speichern
            </Button>
            <Button onClick={() => props.onClose()}>Schließen</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
