export const Editor = ({ label }: { label: string }) => {
  return (
    <fieldset className="flex flex-col gap-2">
      <label htmlFor={label}>{label}</label>
      <textarea id={label} className="bg-slate-500" />
    </fieldset>
  );
};
