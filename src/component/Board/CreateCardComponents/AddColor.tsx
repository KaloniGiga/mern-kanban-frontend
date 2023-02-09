import React, { useState, useEffect } from "react";

interface Props {
  label: string;
  changeColor: Function;
}

function AddColor({ label, changeColor }: Props) {
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
    if (colors && !currChoosen) {
      setCurrChoosen(colors[1]);
    } else {
      setCurrChoosen(currChoosen);
    }
    changeColor(currChoosen);
  }, [currChoosen]);

  return (
    <div className="flex flex-col pb-2 w-full">
      <h2 className="font-semibold ml-2 mb-2">{label}</h2>

      <div>
        {colors.map((color: string) => {
          return (
            <button
              type="button"
              aria-label="background-color-select"
              onClick={() => {
                setCurrChoosen(color);
              }}
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
    </div>
  );
}

export default AddColor;
