import React from "react";
import Avatar from "../Avatar/Avatar";
import Profile from "../Board/Profile/Profile";

function OptionComponent(props: any) {
  const { innerProps, innerRef, data, isDisabled } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={` p-2 flex items-center hover:bg-state-200 ${
        isDisabled ? "opacity-40 cursor-default" : "cursor-pointer"
      }`}
    >
      <div className="left mr-2">
        <Avatar src={data.profile} size="25" />
      </div>

      <div className="right">
        <h3 className="text-sm text-slate-800">{data.label}</h3>
      </div>
    </div>
  );
}

export default OptionComponent;
