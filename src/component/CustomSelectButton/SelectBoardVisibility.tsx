import React, { useEffect, useState } from "react";
import Options from "../Options/Options";

interface Props {
  label: string;

  options: {
    value: string;
    name: string;
  }[];
  value: string;
  defaultVisibility: string;
  handleVisibilityChange: Function;
}

function SelectBoardVisibility({
  label,
  options,
  defaultVisibility,
  value,
  handleVisibilityChange,
}: Props) {
  const [currChoosen, setCurrChoosen] = useState<string>("");

  useEffect(() => {
    if (options && options.length > 0 && !value) {
      const isAvailable = defaultVisibility
        ? options.find((option) => option.value === defaultVisibility)
        : undefined;

      if (isAvailable) {
        setCurrChoosen(defaultVisibility);
      } else {
        setCurrChoosen(options[0].value);
      }
    } else if (value) {
      setCurrChoosen(value);
    }
  }, [options]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrChoosen(e.target.value);
    handleVisibilityChange(e.target.value);
  };

  return (
    <div className={`flex flex-col mb-3`}>
      <div className="flex flex-col justify-center">
        <label htmlFor="boardVisibility" className="font-md mb-2 font-semibold">
          {label}
        </label>

        <select
          name="boardVisibility"
          id="boardVisibility"
          value={currChoosen}
          onChange={(e) => handleChange(e)}
          disabled={options.length === 0}
          className="px-2 py-1 border-2 border-black focus:boarder-2 focus:border-primary"
        >
          {options &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default SelectBoardVisibility;
