"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, Minus, Plus, Star } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CustomCalendar } from "./CustomCalendar"

interface Props {
  amount: string
  slug: string
  type: string
}


export function BookingCard({ amount, slug, type }: Props) {

  amount = amount.replace(/,/g, '').toString()
  const initialDate = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d;
  }, []);


  const [adults, setAdults] = useState(2)
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(initialDate)
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)

  const handleIncrement = () => {
    setAdults((prev) => Math.min(prev + 1, 18))
  }

  const handleDecrement = () => {
    setAdults((prev) => Math.max(prev - 1, 1))
  }
  const router = useRouter()
  const HandlerBooking = () => {
    if (!date) {
      return
    }

    const slugPlain = slug.split('/').filter(Boolean)


    const payload = { type: type, amount: amount.toString(), numberPassengers: adults.toString(), dateBooking: date?.toISOString(), slugTarget: slugPlain[1] }

    const query = new URLSearchParams(payload)

    router.push(`/finalizar-compra?${query}`)

  }

  return (
    <Card className="w-full mx-auto p-6 shadow-lg">
      {/* Header con precio y rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-muted-foreground text-sm">De:</span>
          <span className="text-3xl font-bold text-[#c41e3a]">S/.{amount}</span>
        </div>
      </div>

      {/* Selector de fecha */}
      <div className="space-y-4">
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <button className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#c41e3a] font-semibold mb-1">Fecha</div>
                </div>
                {date?.toLocaleDateString('es-PE')}
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-50 p-0 h-70" align="start">
            <CustomCalendar date={date} setDate={setDate} initialDate={initialDate} setIsDateOpen={setIsDateOpen} />
          </PopoverContent>
        </Popover>

        {/* Selector de adultos */}
        <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
          <PopoverTrigger asChild>
            <button className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#c41e3a] font-semibold mb-1">Adultos</div>
                  <p className="text-sm text-muted-foreground mb-3">Edad 18 o más</p>

                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDecrement()
                    }}
                    className="w-8 h-8 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center"
                    aria-label="Disminuir adultos"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-[#c41e3a] font-semibold min-w-[20px] text-center">{adults}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleIncrement()
                    }}
                    className="w-8 h-8 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center"
                    aria-label="Aumentar adultos"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Adultos</h4>
                <p className="text-sm text-muted-foreground mb-3">Edad 18 o más</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold">{adults}</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDecrement}
                      disabled={adults <= 1}
                      className="rounded-full bg-transparent"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleIncrement}
                      disabled={adults >= 18}
                      className="rounded-full"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Botón de reserva */}
      <Button
        className="w-full mt-6 h-14 text-lg font-semibold bg-[#c41e3a] hover:bg-[#a01828] text-white rounded-full shadow-md"
        size="lg"
        onClick={() => HandlerBooking()}
      >
        Reservar ahora
      </Button>
    </Card >
  )
}
