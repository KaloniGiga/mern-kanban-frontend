import React, { useState, useEffect } from "react";
import { valueContainerCSS } from "react-select/dist/declarations/src/components/containers";

interface Props {
  setValues: React.Dispatch<
    React.SetStateAction<{
      labelName: string;
      labelColor: string;
    }>
  >;
  values: {
    labelName: string;
    labelColor: string;
  };
}

function SelectLabelColor({ setValues, values }: Props) {
  const [colors, setColors] = useState([
    "#dcb4cc",
    "#ffffdd",
    "#a2e2ff",
    "#df685f",
    "#aadb3a",
    "#904893",
  ]);
  const [currChoosen, setCurrChoosen] = useState("");

  useEffect(() => {
    if (!currChoosen && colors.length > 0) {
      setCurrChoosen(colors[0]);
    }
    setValues({ ...values, labelColor: currChoosen });
  }, [currChoosen]);

  return (
    <div className="flex items-center pb-2 w-full">
      {colors.map((color: string) => {
        return (
          <button
            type="button"
            aria-label="background-color-select"
            onClick={() => setCurrChoosen(color)}
            key={color}
            className={`h-10 rounded mr-1 ${
              currChoosen === color ? "border-2 border-primary" : ""
            }`}
            style={{
              background: color,
              minWidth: "60px",
            }}
          ></button>
        );
      })}
    </div>
  );
}

export default SelectLabelColor;
