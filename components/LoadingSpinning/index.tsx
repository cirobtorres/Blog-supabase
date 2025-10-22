import { cn } from "@/utils/classnames";

// TODO: https://www.radix-ui.com/themes/docs/components/spinner
const LoadingSpinning = ({
  loadingState,
  className,
}: {
  loadingState: boolean;
  className?: string;
}) => {
  return (
    loadingState && (
      <div className={cn("w-fit mx-auto animate-spin", className)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-loader"
        >
          <path d="M12 2v4" />
          <path d="m16.2 7.8 2.9-2.9" />
          <path d="M18 12h4" />
          <path d="m16.2 16.2 2.9 2.9" />
          <path d="M12 18v4" />
          <path d="m4.9 19.1 2.9-2.9" />
          <path d="M2 12h4" />
          <path d="m4.9 4.9 2.9 2.9" />
        </svg>
      </div>
    )
  );
};

export { LoadingSpinning };
