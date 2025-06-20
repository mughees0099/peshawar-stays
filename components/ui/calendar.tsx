"use client";

import type * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { isBefore, startOfDay } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  disablePastDates?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  disablePastDates = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      numberOfMonths={1}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      onDayClick={(date, modifiers, e) => {}}
      classNames={{
        // months: "flex justify-center ",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-10 w-10 p-0 relative",

        day: cn(
          "w-full h-full flex items-center justify-center rounded-md text-sm cursor-pointer hover:bg-primary hover:text-white transition pointer-events-auto border border-red-500"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled:
          "text-muted-foreground opacity-0 cursor-not-allowed pointer-events-none hover:bg-transparent hover:text-muted-foreground",

        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft />,
        IconRight: ({ ...props }) => <ChevronRight />,
      }}
      disabled={(date) => {
        const today = startOfDay(new Date());
        const currentDate = startOfDay(date);
        const shouldDisable = isBefore(currentDate, today);
        return shouldDisable;
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
