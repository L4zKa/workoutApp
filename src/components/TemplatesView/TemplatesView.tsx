import React, { useState } from "react";
import { useStyles } from "../../helpers/globalFunctions";
import type { WorkoutTemplate } from "../../storage";
import {
  Button,
  Card,
  CardHeader,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Divider,
  Input,
  Label,
  Subtitle1,
  TableCellLayout,
  Text,
  type TableColumnDefinition,
} from "@fluentui/react-components";
import { AddRegular, DeleteRegular } from "@fluentui/react-icons";
import { EditTemplateDialog } from "./EditTemplateDialog";

export function TemplatesView(props: {
  templates: WorkoutTemplate[];
  activeTemplateId: string;
  setActiveTemplateId(id: string): void;
  createTemplate(name: string): void;
  renameTemplate(id: string, newName: string): void;
  addExerciseToTemplate(
    templateId: string,
    exerciseName: string,
    setGoal: number,
    repsGoal: number
  ): void;
  removeExerciseFromTemplate(templateId: string, exerciseId: string): void;
  deleteTemplate(templateId: string): void;
}) {
  const styles = useStyles();
  const [newTemplateName, setNewTemplateName] = React.useState("");
  const [exerciseName, setExerciseName] = React.useState("");
  const [selectedTemplateObject, setSelectedTemplateObject] = useState<
    WorkoutTemplate | undefined
  >();

  const active =
    props.templates.find((t) => t.id === props.activeTemplateId) ??
    props.templates[0];

  const columns: TableColumnDefinition<WorkoutTemplate>[] = [
    createTableColumn<WorkoutTemplate>({
      columnId: "Name",
      renderHeaderCell: () => {
        return "Name";
      },
      renderCell: (item) => <TableCellLayout>{item.name}</TableCellLayout>,
    }),
    createTableColumn<WorkoutTemplate>({
      columnId: "Übungen",
      renderHeaderCell: () => {
        return "Übungen";
      },
      renderCell: (item) => (
        <TableCellLayout>{item.exercises.length}</TableCellLayout>
      ),
    }),
    createTableColumn<WorkoutTemplate>({
      columnId: "deleteButton",
      renderHeaderCell: () => {
        return "";
      },
      renderCell: (item) => (
        <TableCellLayout>
          <Button
            appearance="transparent"
            icon={<DeleteRegular />}
            onClick={(e) => {
              props.deleteTemplate(item.id);
              e.stopPropagation();
            }}
          />
        </TableCellLayout>
      ),
    }),
  ];

  return (
    <>
      <EditTemplateDialog
        selectedTemplate={selectedTemplateObject}
        onClose={() => setSelectedTemplateObject(undefined)}
        onRename={(templateIdToChange: string, newVal: string) => {
          props.renameTemplate(templateIdToChange, newVal);
          setSelectedTemplateObject(undefined);
        }}
        onAddExercise={props.addExerciseToTemplate}
        onRemoveExercise={(exerciseId: string) => {
          props.removeExerciseFromTemplate(
            selectedTemplateObject?.id ?? "",
            exerciseId
          );
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataGrid items={props.templates} columns={columns}>
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<WorkoutTemplate>>
            {({ item, rowId }) => (
              <DataGridRow<WorkoutTemplate>
                key={rowId}
                onClick={() => setSelectedTemplateObject(item)}
              >
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Button appearance="transparent" icon={<AddRegular />}>
              Neues Template
            </Button>
          </div>
        </DataGrid>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Card>
          <CardHeader header={<Subtitle1>Templates</Subtitle1>} />
          <div className={styles.cardBody}>
            <Label>New template</Label>
            <Input
              value={newTemplateName}
              onChange={(_, d) => setNewTemplateName(d.value)}
              placeholder="e.g. Full Body"
            />
            <Button
              onClick={() => {
                props.createTemplate(newTemplateName);
                setNewTemplateName("");
              }}
            >
              Add
            </Button>

            <Divider />

            <Label>Pick template</Label>
            <select
              value={active?.id ?? ""}
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

            {active && (
              <>
                <Divider />
                <Label>Rename</Label>
                <Input
                  value={active.name}
                  onChange={(_, d) => props.renameTemplate(active.id, d.value)}
                />

                <div className={styles.row}>
                  <Button
                    onClick={() => props.deleteTemplate(active.id)}
                    disabled={props.templates.length <= 1}
                  >
                    Delete template
                  </Button>
                  <Text className={styles.tiny}>
                    (keeps at least 1 template)
                  </Text>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader header={<Subtitle1>Exercises</Subtitle1>} />
          <div className={styles.cardBody}>
            {!active ? (
              <Text className={styles.tiny}>Create a template first.</Text>
            ) : (
              <>
                <Label>Add exercise</Label>
                <Input
                  value={exerciseName}
                  onChange={(_, d) => setExerciseName(d.value)}
                  placeholder="e.g. Deadlift"
                />
                <Button
                  appearance="primary"
                  onClick={() => {
                    props.addExerciseToTemplate(active.id, exerciseName, 0, 0);
                    setExerciseName("");
                  }}
                >
                  Add
                </Button>

                <Divider />

                {active.exercises.length === 0 ? (
                  <Text className={styles.tiny}>No exercises yet.</Text>
                ) : (
                  active.exercises.map((e) => (
                    <div key={e.id} className={styles.exerciseRow}>
                      <Text>{e.name}</Text>
                      <Button
                        size="small"
                        onClick={() =>
                          props.removeExerciseFromTemplate(active.id, e.id)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
