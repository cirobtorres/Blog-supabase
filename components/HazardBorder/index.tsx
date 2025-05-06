import { cn } from "@/utils/classnames";

export const HazardBorder = ({
  border = "y",
}: {
  border?: "y" | "x" | "t" | "b" | "r" | "l";
}) => {
  const borderType = () => {
    switch (border) {
      case "y":
        return "border-y";
      case "x":
        return "border-x";
      case "t":
        return "border-t";
      case "b":
        return "border-b";
      case "l":
        return "border-l";
      case "r":
        return "border-r";
      default:
        return "border";
    }
  };
  return (
    <div
      className={cn(
        "w-full h-4 shrink-0 border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_#262626_0,_#262626_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed",
        borderType()
      )}
    />
  );
};
