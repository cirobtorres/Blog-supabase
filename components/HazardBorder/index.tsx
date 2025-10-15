import { cn } from "@/utils/classnames";

export const HazardBorder = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-full h-full shrink-0 bg-fixed bg-[image:repeating-linear-gradient(315deg,_#262626_0,_#262626_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]",
        className
      )}
    />
  );
};
