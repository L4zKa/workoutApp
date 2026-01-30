import { Button, Dropdown, Field, Option } from "@fluentui/react-components";
import type { WorkoutTemplate } from "../../storage";
import { useStyles } from "../../helpers/globalFunctions";

export const SelectTemplate = ({
  activeTemplateId,
  templates,
  startSession,
  setActiveTemplateId: setActiveTemplateId,
}: {
  activeTemplateId: string;
  templates: WorkoutTemplate[];
  startSession: () => void;
  setActiveTemplateId: (id: string) => void;
}) => {
  const styles = useStyles();
  return (
    <>
      <Field label={"Template auswählen"}>
        <Dropdown
          value={templates.find((x) => x.id == activeTemplateId)?.name ?? ""}
          defaultSelectedOptions={[activeTemplateId]}
          onOptionSelect={(_, data) => {
            setActiveTemplateId(data.optionValue ?? "");
          }}
        >
          {templates.map((t) => (
            <Option key={t.id} value={t.id}>
              {t.name}
            </Option>
          ))}
        </Dropdown>
      </Field>
      <div className={styles.row}>
        <Button
          appearance="primary"
          onClick={startSession}
          disabled={!templates.length}
        >
          Workout starten
        </Button>
      </div>
    </>
  );
};
