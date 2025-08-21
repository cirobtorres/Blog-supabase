import Link from "next/link";

export const ConfirmFormButton = ({
  label,
  isPending,
}: {
  label: string;
  isPending?: boolean;
}) => (
  <button
    type="submit"
    className="text-sm text-theme-color transition-all h-fit py-2 cursor-pointer rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 focus-visible:bg-neutral-700 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
  >
    {isPending ? "Loading..." : label}
  </button>
);

export const SaveFormButton = ({ label }: { label: string }) => (
  <button
    type="submit"
    className="text-sm text-neutral-100 transition-all h-fit py-2 cursor-pointer rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 focus-visible:bg-neutral-700 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
  >
    {label}
  </button>
);

export const ReturnToHome = () => {
  return (
    <Link
      href="/"
      className="w-fit text-sm flex gap-2 items-center uppercase mb-6"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-left-icon lucide-arrow-left"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      Home Page
    </Link>
  );
};
