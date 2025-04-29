import { HTMLInputTypeAttribute } from "react";

export const Fieldset = ({
  label,
  placeholder,
  type,
}: {
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}) => {
  const id = `input-${label.toLowerCase()}`;
  return (
    <fieldset className="flex flex-col bg-slate-950">
      <label id={`label-${label}`} htmlFor={id} className="bg-slate-900">
        {label}
      </label>
      <input
        id={id}
        type={type || "text"}
        name={id}
        placeholder={placeholder || ""}
        className="p-1 bg-slate-500"
      />
    </fieldset>
  );
};
