import React from "react";

interface Props {
  options: {
    value: string;
    label: string;
  }[];
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
}

function RoleDropDown({ options, role, setRole }: Props) {
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
    console.log(role, e.target.value);
  };

  return (
    <div className="ml-3 w-full">
      <select
        className="px-2 py-2 border-2 focus:border-primary"
        name="roleDropDown"
        id="roleDropDown"
        value={role}
        onChange={(e) => handleRoleChange(e)}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RoleDropDown;
