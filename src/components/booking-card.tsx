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
import { useMobile } from '@/hooks/useMobile'

interface Props {
  amount: string
  slug: string
  type: string
}


export function BookingCard({ amount, slug, type }: Props) {

  console.log(type)

  const typing = type == 'tour' ? 1 : 40
  amount = amount.replace(/,/g, '').toString()
  const initialDate = React.useMemo(() => {

    const d = new Date();
    d.setDate(d.getDate() + typing);
    return d;
  }, []);

  const isMobile = useMobile()

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
    <Card className="w-full mx-auto p-6 shadow-lg h-[80vh] md:h-auto">
      {/* Header con precio y rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-muted-foreground text-sm">De:</span>
          <span className="text-3xl font-bold text-[#2970b7]">S/.{amount}</span>
        </div>
      </div>

      {/* Selector de fecha */}
      <div className="space-y-4 w-full">
        <Popover open={isDateOpen} modal>
          <PopoverTrigger asChild onClick={() => setIsDateOpen(!isDateOpen)} >
            <button className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#2970b7] font-semibold mb-1">Fecha</div>
                </div>
                <div className='text-gray-700'>
                  {date?.toLocaleDateString('es-PE')}
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" >
            <CustomCalendar date={date} setDate={setDate} initialDate={initialDate} setIsDateOpen={setIsDateOpen} />
          </PopoverContent>
        </Popover>

        <div className='text-[11px] text-center'> Paquetes son reservados 40 dias antes </div>
        {/* Selector de adultos */}
        <div >
          <div >
            <button className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#2970b7] font-semibold mb-1">Adultos</div>
                  <p className="text-sm text-muted-foreground mb-3">Edad 18 o más</p>

                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDecrement()
                    }}
                    className="w-8 h-8 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Disminuir adultos"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-[#2970b7] font-semibold min-w-[20px] text-center">{adults}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleIncrement()
                    }}
                    className="w-8 h-8 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Aumentar adultos"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Botón de reserva */}
      <Button
        className="w-full mt-6 h-14 text-lg font-semibold bg-[#2970b7] hover:bg-[black] text-white rounded-full shadow-md cursor-pointer"
        size="lg"
        onClick={() => HandlerBooking()}
      >
        Reservar ahora
      </Button>
    </Card >
  )
}
