import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { HiOutlineCheck } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { VscUnfold } from "react-icons/vsc";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

interface Props {
  label: string;
  options: {
    value: string;
    name: string;
  }[];
  handleVisibilityChange: Function;
  visibility: string;
  defaultVisibility: string;
}

function WorkSpaceVisibility({
  label,
  options,
  visibility,
  handleVisibilityChange,
  defaultVisibility,
}: Props) {
  const [currChoosen, setCurrChoosen] = useState("");

  useEffect(() => {
    if (options && options.length > 0 && !visibility) {
      const isAvailable = defaultVisibility
        ? options.find((option) => option.value === defaultVisibility)
        : undefined;

      if (isAvailable) {
        setCurrChoosen(defaultVisibility);
      } else {
        setCurrChoosen(options[0].value);
      }
    } else if (
      visibility &&
      options.find((option) => option.value === visibility)
    ) {
      setCurrChoosen(visibility);
    }
  }, []);

  useEffect(() => {
    setCurrChoosen(visibility);
  }, [visibility]);

  return (
    <div className={`flex flex-col mb-3`}>
      <div className="flex flex-col justify-center">
        <label
          htmlFor="workspaceVisibility"
          className="font-md mb-2 font-semibold"
        >
          {label}
        </label>

        <select
          onChange={(e) => handleVisibilityChange(e)}
          value={currChoosen}
          name="workspaceVisibility"
          id="workspaceVisibility"
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

export default WorkSpaceVisibility;
