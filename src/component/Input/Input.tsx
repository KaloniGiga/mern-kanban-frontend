import { InputProps } from "../../types/component.types";

function Input(props: InputProps) {
  return (
    <div className="w-full">
      <label htmlFor={props.name} className="font-semibold">
        {props.label}
      </label>
      <br />
      <input
        type={props.typeName}
        onChange={props.onChange}
        className={`w-full border-1 bg-slate-100 px-3 py-1 my-1 `}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
      />
    </div>
  );
}

export default Input;
