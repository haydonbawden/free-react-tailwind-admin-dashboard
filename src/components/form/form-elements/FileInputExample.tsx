import ComponentCard from "../../common/ComponentCard";
import FileInput from "../input/FileInput";
import Label from "../Label";
import { useState } from "react";

export default function FileInputExample() {
  const [fileName, setFileName] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <ComponentCard title="File Input">
      <div>
        <Label>Upload file</Label>
        <FileInput onChange={handleFileChange} className="custom-class" />
        {fileName && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
            Selected file: {fileName}
          </p>
        )}
      </div>
    </ComponentCard>
  );
}
