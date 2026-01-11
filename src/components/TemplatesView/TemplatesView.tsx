import { useState } from "react";
import type { WorkoutTemplate } from "../../storage";
import {
  Button,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Divider,
  Input,
  TableCellLayout,
  type TableColumnDefinition,
} from "@fluentui/react-components";
import { AddRegular, DeleteRegular } from "@fluentui/react-icons";
import { EditTemplateDialog } from "./EditTemplateDialog";
import { useStyles } from "../../helpers/globalFunctions";

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
  const [selectedTemplateObject, setSelectedTemplateObject] = useState<
    WorkoutTemplate | undefined
  >();
  const [newTemplateName, setNewTemplateName] = useState<string>("");

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
        return "Anzahl Übungen";
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
      <div className={styles.box}>
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
            style={{
              padding: "5px",
            }}
          >
            <Input
              value={newTemplateName}
              onChange={(_, data) => setNewTemplateName(data.value)}
              placeholder="neuer Templatename"
              contentAfter={
                <Button
                  onClick={() => {
                    props.createTemplate(newTemplateName);
                    setNewTemplateName("");
                  }}
                  appearance="transparent"
                  icon={<AddRegular />}
                />
              }
            />
          </div>
          <Divider />
        </DataGrid>
      </div>
    </>
  );
}
