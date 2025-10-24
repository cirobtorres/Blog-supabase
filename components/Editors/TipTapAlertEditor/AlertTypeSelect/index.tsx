import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { focusVisibleWhiteRing, hoverWhiteRing } from "@/styles/classNames";
import { cn } from "@/utils/classnames";

export default function AlertTypeSelect({
  id,
  defaultType,
  callback,
}: {
  id: string;
  defaultType?: string;
  callback: (lang: string) => void;
}) {
  return (
    <fieldset className="flex items-center gap-2">
      <label
        htmlFor={`accord-select-${id}`}
        className="text-neutral-500 font-[600]"
      >
        Tipo
      </label>
      <Select
        onValueChange={(value) => callback(value)}
        defaultValue={defaultType}
      >
        <SelectTrigger
          id={`accord-select-${id}`}
          className={cn(
            "h-8 w-32 bg-neutral-800 hover:bg-[#2c2c2c] data-[state=open]:text-neutral-100 data-[state=open]:bg-[#2b2b2b]", // z-10 absolute top-2 right-4
            focusVisibleWhiteRing
          )}
        >
          <SelectValue placeholder={defaultType || "Default"} />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "w-40 transition-all duration-300 scrollbar",
            hoverWhiteRing
          )}
        >
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="alert">Alert</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="info">Info</SelectItem>
          <SelectItem value="success">Success</SelectItem>
        </SelectContent>
      </Select>
    </fieldset>
  );
}
