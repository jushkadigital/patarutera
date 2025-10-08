"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export const CalendarCarrito = () => {

  const initialDate = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d;
  }, []);

  const [date, setDate] = React.useState<Date | undefined>(initialDate)

  return (
    <Calendar
      disabled={{ before: initialDate }}
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
    />
  )
}

