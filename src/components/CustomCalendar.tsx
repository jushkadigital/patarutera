"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";

interface Props {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setIsDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialDate: Date;
  minDate?: Date;
}

export const CustomCalendar = ({
  date,
  setDate,
  initialDate,
  setIsDateOpen,
  minDate,
}: Props) => {
  const fiveYearsFromNow = new Date(
    initialDate.getFullYear() + 5,
    initialDate.getMonth(),
    initialDate.getDate(),
  );
  return (
    <Calendar
      disabled={minDate ? { before: minDate } : undefined}
      mode="single"
      startMonth={initialDate}
      endMonth={fiveYearsFromNow}
      selected={date}
      onSelect={(date?: Date) => {
        setDate(date);
        setIsDateOpen(false);
      }}
      className="rounded-md border shadow-sm  w-full h-full scale-100"
      captionLayout="dropdown"
    />
  );
};
