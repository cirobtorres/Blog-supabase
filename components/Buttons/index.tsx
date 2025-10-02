import Link from "next/link";
import { LoadingSpinning } from "../LoadingSpinning";

export const ConfirmFormButton = ({
  label,
  isPending,
}: {
  label: string;
  isPending?: boolean;
}) => (
  <button
    type="submit"
    disabled={isPending}
    className={
      `w-full cursor-pointer h-[38px] py-2 not-disabled:transition-all not-disabled:duration-300 outline-none ` +
      `text-sm text-neutral-100 rounded-xs border border-theme-color bg-theme-color-light ` +
      `focus-visible:ring-2 focus-visible:ring-theme-color focus-visible:border-transparent ` +
      `disabled:cursor-auto disabled:text-neutral-400 disabled:border-neutral-600 disabled:bg-neutral-700 `
    }
  >
    {isPending ? (
      <LoadingSpinning loadingState={isPending} className="my-0" />
    ) : (
      label
    )}
  </button>
);

export const SaveFormButton = ({
  label,
  isPending,
}: {
  label: string;
  isPending?: boolean;
}) => (
  <button
    type="button"
    disabled={isPending}
    className={
      `w-full cursor-pointer h-[38px] py-2 not-disabled:transition-all not-disabled:duration-300 ` +
      `text-sm text-neutral-100 rounded-xs border border-neutral-700 bg-neutral-800 ` +
      `hover:border-neutral-600 hover:bg-neutral-800 ` +
      `focus-visible:ring-[3px] focus-visible:ring-neutral-100 focus-visible:bg-neutral-800 ` +
      `disabled:cursor-auto disabled:text-neutral-400 disabled:border-neutral-600 disabled:bg-neutral-700 `
    }
  >
    {isPending ? (
      <LoadingSpinning loadingState={isPending} className="my-0" />
    ) : (
      label
    )}
  </button>
);

export const ReturnToHome = () => {
  return (
    <Link
      href="/"
      className={
        `w-fit text-sm flex gap-2 items-center uppercase mb-6 ` +
        `transition-all hover:text-neutral-100 rounded outline-none focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] `
      }
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

export const ReturnToProfile = () => {
  return (
    <Link
      href="/admin"
      className={
        `w-fit text-sm flex gap-2 items-center uppercase mb-6 ` +
        `transition-all hover:text-neutral-100 rounded outline-none focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] `
      }
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
      Profile
    </Link>
  );
};
