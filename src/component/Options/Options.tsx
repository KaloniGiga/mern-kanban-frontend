import React from "react";

interface OptionsProp {
  children: JSX.Element;
  show: boolean;
}

const Options = ({ children, show }: OptionsProp) => {
  return (
    show && (
      <div className="absolute bottom-20 left-10 flex items-center justify-center w-full  ">
        <ul className="bg-white shadow-lg block rounded">{children}</ul>
      </div>
    )
  );
};

export default Options;
