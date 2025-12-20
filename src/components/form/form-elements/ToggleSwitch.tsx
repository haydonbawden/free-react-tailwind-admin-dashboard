import ComponentCard from "../../common/ComponentCard";
import Switch from "../switch/Switch";
import { useState } from "react";

export default function ToggleSwitch() {
  const [status, setStatus] = useState("ON");
  const handleSwitchChange = (checked: boolean) => {
    setStatus(checked ? "ON" : "OFF");
  };
  return (
    <ComponentCard title="Toggle switch input">
      <div className="flex gap-4">
        <Switch
          label="Default"
          defaultChecked={true}
          onChange={handleSwitchChange}
        />
        <Switch
          label="Checked"
          defaultChecked={true}
          onChange={handleSwitchChange}
        />
        <Switch label="Disabled" disabled={true} />
      </div>{" "}
      <div className="flex gap-4">
        <Switch
          label="Default"
          defaultChecked={true}
          onChange={handleSwitchChange}
          color="gray"
        />
        <Switch
          label="Checked"
          defaultChecked={true}
          onChange={handleSwitchChange}
          color="gray"
        />
        <Switch label="Disabled" disabled={true} color="gray" />
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
        Current status: {status}
      </p>
    </ComponentCard>
  );
}
