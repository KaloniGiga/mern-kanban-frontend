import React from "react";
import { IconType } from "react-icons/lib";

interface Props {
  Icon: IconType;
  text: string;
  onClick: Function;
  textColor?: string;
}

function OptionsItem({ Icon, text, onClick, textColor }: Props) {
  return (
    <li
      onClick={() => onClick()}
      className="p-2 hover:bg-slate-100 flex items-center cursor-pointer"
    >
      <div>
        <Icon size={16} />
      </div>

      <div style={{ color: textColor ? textColor : "inherit" }}>{text}</div>
    </li>
  );
}

export default OptionsItem;
