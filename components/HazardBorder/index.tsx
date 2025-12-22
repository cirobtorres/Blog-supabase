import { cn } from "@/utils/classnames";

export const HazardBorder = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-full h-full shrink-0 bg-fixed bg-[repeating-linear-gradient(315deg,#262626_0,#262626_1px,transparent_0,transparent_50%)] bg-size-[10px_10px]",
        className
      )}
    />
  );
};
