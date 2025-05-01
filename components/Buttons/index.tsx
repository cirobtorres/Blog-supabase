export const ConfirmFormButton = ({ label }: { label: string }) => {
  return (
    <button type="submit" className="py-1 cursor-pointer bg-neutral-700">
      {label}
    </button>
  );
};
