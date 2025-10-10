import { Media } from "@/cms-types"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import PayloadImage from "./PayloadImage"

interface Props {
  name: string
  date: string
  amount: number
  numberPassengers: number
  type: string
  image: Media
}

export function ReservationCard({ name, date, amount, numberPassengers, type, image }: Props) {
  return (
    <div className="space-y-4 pt-5">
      <h1 className="text-2xl font-semibold mt-5">Su reserva</h1>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Tour Header */}
          <div className="flex gap-4 pb-6 border-b">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">{name}</h2>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>{name}</span>
              </div>
            </div>
            <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden">
              <PayloadImage media={image} fill className="object-cover" />
            </div>
          </div>

          {/* Tour Details */}
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Tipo:</span> <span className="text-muted-foreground">{type}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Fecha:</span> <span className="text-muted-foreground">{date}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Duración:</span> <span className="text-muted-foreground">1 Día</span>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-destructive">Detalles de la reserva</h3>

            <div className="text-sm">
              <span className="font-semibold">Adulto:</span> <span>{numberPassengers.toString()} x S/.{amount.toFixed(2)}</span>
            </div>

            {/* Pricing Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-muted/50">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">S/.{(amount * numberPassengers).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-4 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">S/.{(amount * numberPassengers).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
