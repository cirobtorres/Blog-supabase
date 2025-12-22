import { FiltersIcon } from "../../../components/Icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { focusVisibleWhiteRing } from "../../../styles/classNames";
import { cn } from "../../../utils/classnames";
import { Calendar24 } from "../../ui/date-picker";

export function SelectFilters() {
  return (
    <Select>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Uploads mais recentes" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Uploads mais recentes</SelectItem>
        <SelectItem value="oldest">Uploads mais antigos</SelectItem>
        <SelectItem value="asc">Ordem alfabética &#40;A - Z&#41;</SelectItem>
        <SelectItem value="desc">
          Ordem alfabética reversa &#40;Z - A&#41;
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export function SelectComplexFilters() {
  return (
    <Popover>
      <PopoverTrigger>
        <FiltersIcon className="transition-color duration-300 stroke-neutral-500 group-focus-within:stroke-neutral-100" />
        Filtros
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-96 flex flex-col gap-2 p-3 bg-neutral-900 border border-neutral-700"
      >
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="created_at" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">created_at</SelectItem>
            <SelectItem value="updated_at">updated_at</SelectItem>
            <SelectItem value="type">type</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="is" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="is">is</SelectItem>
            <SelectItem value="is not">is not</SelectItem>
            <SelectItem value="is greater than">is greater than</SelectItem>
            <SelectItem value="is greater than or equal to">
              is greater than or equal to
            </SelectItem>
          </SelectContent>
        </Select>
        <Calendar24 />
        <button
          className={cn(
            "cursor-pointer py-2 px-3 text-sm rounded-xs text-theme-color font-medium w-full border border-neutral-700 bg-neutral-900 transition-shadow duration-300 focus-visible:text-theme-color",
            focusVisibleWhiteRing
          )}
        >
          Aplicar filtros
        </button>
      </PopoverContent>
    </Popover>
  );
}
