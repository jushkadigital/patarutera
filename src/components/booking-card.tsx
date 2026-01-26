"use client"
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, Minus, Plus, Star } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CustomCalendar } from "./CustomCalendar"
import { useMobile } from '@/hooks/useMobile'
import { addMultipleToCart } from '@lib/data/cart'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { Divider, Button as ButtonB } from '@medusajs/ui'

interface Props {
  amount: string
  slug: string
  type: string
  medusaId: HttpTypes.StoreProduct
}


export function BookingCard({ amount, slug, type, medusaId }: Props) {


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
    setAdults((prev) => Math.max(prev - 1, type == 'tour' ? 1 : 2))
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
  const product = medusaId

  const [isAdding, setIsAdding] = useState(false)

  // 1. ESTADO: Objeto para manejar cantidades por ID de variante
  // Ejemplo: { "variant_123": 2, "variant_456": 1 }
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const [isAddedToCart, setIsAddedToCart] = useState(false)

  // Helper para actualizar el estado
  const handleQuantityChange = (variantId: string, change: number) => {
    setQuantities((prev) => {
      const currentQty = prev[variantId] || 0
      const newQty = Math.max(0, currentQty + change)

      // Opcional: Validar stock aquí si es necesario
      const variant = product.variants?.find((v) => v.id === variantId)
      if (variant?.manage_inventory && !variant.allow_backorder) {
        if (newQty > (variant.inventory_quantity || 0)) {
          return prev // No incrementar si supera el stock
        }
      }

      return {
        ...prev,
        [variantId]: newQty,
      }
    })
  }

  // Calcular total de items seleccionados para deshabilitar botón si es 0
  const totalItems = useMemo(() => {
    return Object.values(quantities).reduce((acc, curr) => acc + curr, 0)
  }, [quantities])

  // Calcular precio total estimado (Opcional, para UI)
  const estimatedTotal = useMemo(() => {
    let total = 0
    product.variants?.forEach((v) => {
      const qty = quantities[v.id] || 0
      // Nota: Esto asume que calculated_price está disponible en la variante
      // Si usas Medusa V2, asegúrate que el precio esté hidratado correctamente
      const price = v.calculated_price?.calculated_amount || 0
      total += price * qty
    })
    return total
  }, [product.variants, quantities])

  // 2. LOGICA DE CARRITO: Añadir múltiples variantes
  const handleAddToCart = async () => {
    if (totalItems === 0) return

    setIsAdding(true)

    // Lógica de fecha que tenías en tu código original

    // Filtramos solo las variantes que tienen cantidad > 0
    const itemsToAdd = Object.entries(quantities).filter(([_, qty]) => qty > 0)

    const itemsToCart = itemsToAdd.map(([variantId, qty]) => {

      return ({
        variant_id: variantId,
        quantity: qty,
        countryCode: 'pe',
        metadata: {
          tour_date: date, // Tu lógica de fecha
        }
      })
    })
    try {
      // Ejecutamos todas las promesas de agregar al carrito en paralelo

      await addMultipleToCart(itemsToCart)

      // Opcional: Resetear cantidades tras añadir
      // setQuantities({})
    } catch (e) {
      console.error("Error adding to cart", e)
    } finally {
      setIsAdding(false)
      setIsAddedToCart(true)
    }
  }
  const getPriceDisplay = (variant: HttpTypes.StoreProductVariant) => {
    if (!variant.calculated_price) return null
    return convertToLocale({
      amount: variant.calculated_price.calculated_amount!,
      currency_code: 'pen'
    })
  }

  console.log(product)
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

        <div className="flex flex-col gap-y-4">
          {product.variants?.map((variant) => {
            const qty = quantities[variant.id] || 0
            // Chequeo simple de stock para UI
            const outOfStock =
              variant.manage_inventory &&
              !variant.allow_backorder &&
              (variant.inventory_quantity || 0) <= 0

            return (
              <div
                key={variant.id}
                className="flex items-center justify-between border p-3 rounded-md"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-ui-fg-base">
                    {variant.title} {/* Ej: Adult, Child */}
                  </span>
                  <span className="text-small-regular text-ui-fg-subtle">
                    {getPriceDisplay(variant)}
                  </span>
                </div>

                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => handleQuantityChange(variant.id, -1)}
                    disabled={qty === 0 || isAdding || !!false}
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-4 text-center">{qty}</span>
                  <button
                    onClick={() => handleQuantityChange(variant.id, 1)}
                    disabled={outOfStock || isAdding || !!false}
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <Divider />



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
          <PopoverContent className="w-80 h-100" >
            <CustomCalendar date={date} setDate={setDate} initialDate={initialDate} setIsDateOpen={setIsDateOpen} />
          </PopoverContent>
        </Popover>

        <div className='text-[11px] text-center'> Paquetes son reservados 40 dias antes </div>
        {/* Selector de adultos */}
        <div >
          <div >

            {/**
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
            **/
            }
          </div>
        </div>
        {/* Opcional: Mostrar total acumulado visualmente */}
        {totalItems > 0 && (
          <div className="flex justify-between py-2 font-semibold">
            <span>Total Items: {totalItems}</span>
            <span>{convertToLocale({ amount: estimatedTotal, currency_code: 'pen' })}</span>
          </div>
        )}
      </div>

      {/* Botón de reserva */}
      <Button
        className="w-full mt-6 h-14 text-lg font-semibold bg-[#2970b7] hover:bg-[black] text-white rounded-full shadow-md cursor-pointer"
        size="lg"
        onClick={handleAddToCart}
        disabled={!product.variants || !!false || isAdding || totalItems === 0}
        data-testid="add-product-button"

      >
        Reservar ahora
      </Button>
    </Card >
  )
}
