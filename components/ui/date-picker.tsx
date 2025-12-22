"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { formatDateRange } from "../../utils/dates";

export function Calendar24() {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    to: new Date(),
  });

  return (
    <div className="w-full flex gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="w-full justify-between font-normal"
          >
            {formatDateRange(dateRange, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            captionLayout="dropdown"
            numberOfMonths={2}
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
