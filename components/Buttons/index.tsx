import Link from "next/link";
import { LoadingSpinning } from "../LoadingSpinning";
import { focusVisibleWhiteRing } from "../../styles/classNames";
import { cn } from "../../utils/classnames";

export const SubmitFormButton = ({
  label,
  formAction,
  isPending,
  className,
}: {
  label: string;
  formAction?: () => void;
  isPending?: boolean;
  className?: string;
}) => (
  <button
    type="submit"
    disabled={isPending}
    formAction={formAction}
    className={cn(
      "relative cursor-pointer w-full h-[38px] py-2 outline-none text-sm text-neutral-100 rounded-xs border border-theme-color bg-theme-color-light disabled:cursor-auto not-disabled:transition-all not-disabled:duration-300",
      focusVisibleWhiteRing,
      className
    )}
  >
    {isPending ? (
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <LoadingSpinning />
      </div>
    ) : (
      label
    )}
  </button>
);

export const ReturnToHome = () => {
  return (
    <Link
      href="/"
      className={cn(
        "w-fit text-sm flex gap-2 items-center uppercase mb-6 transition-all duration-300 rounded outline-none hover:text-neutral-100 focus-visible:text-neutral-100",
        focusVisibleWhiteRing
      )}
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
      className={cn(
        "w-fit text-sm flex gap-2 items-center uppercase mb-6 transition-all duration-300 rounded outline-none hover:text-neutral-100 focus-visible:text-neutral-100",
        focusVisibleWhiteRing
      )}
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
