import React from "react";

interface Props {
  message: string;
  title?: string;
}

const Error = ({ message, title }: Props) => {
  return (
    <div className=" w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        {title && (
          <h1 className="text-2xl font-semibold mb-2 text-slate-800">
            {title}
          </h1>
        )}
        <p className="text-lg font-medium text-slate-700 mb-3 text-primary">{message}</p>
      </div>
    </div>
  );
};

export default Error;
