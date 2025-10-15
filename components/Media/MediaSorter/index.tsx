"use client";

import { FiltersIcon } from "@/components/Icons";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  focusVisibleThemeRing,
  focusVisibleWhiteRing,
} from "@/styles/classNames";
import { cn } from "@/utils/classnames";

const className = "";

export default function MediaSorter() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Checkbox />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <button
              className={cn(
                "cursor-pointer py-2 px-3 text-sm rounded-xs text-theme-color font-medium w-full border border-neutral-700 bg-neutral-900 transition-shadow duration-300 focus-visible:text-theme-color",
                focusVisibleThemeRing
              )}
            >
              Aplicar filtros
            </button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded-xs size-8 border border-neutral-800 bg-neutral-900"></div>
        <div className="rounded-xs size-8 border border-neutral-800 bg-neutral-900"></div>
        <div className="rounded-xs size-8 border border-neutral-800 bg-neutral-900"></div>
      </div>
    </div>
  );
}
