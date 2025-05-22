import Image from "next/image"
import { Users, Activity } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TravelCard() {
  return (
    <Card className="max-w-sm mx-auto overflow-hidden rounded-3xl shadow-lg">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="outline" className="bg-white px-6 py-2 rounded-full border-0">
            {/* destinos */}
            <span className="text-[#79368c] font-bold">CUSCO</span>
          </Badge>
        </div>
        <Image
          src="/valle-sagrado-scenic.png"
          alt="Valle Sagrado landscape"
          width={400}
          height={500}
          className="w-full h-[500px] object-cover"
        />
      </div>

      <CardContent className="p-6">

        {/* title */}
        <h2 className="text-[#2970b7] text-3xl font-bold mb-3">Valle Sagrado Full Day</h2>
        {/* miniDescription */}
        <p className="text-[#6a6a6a] mb-6">
          is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text.
        </p>

        <div className="flex justify-between items-start mb-8">
          <div>
            
              {/* desde */}
            <p className="text-[#6a6a6a] text-sm mb-1">Desde</p>
            <div className="flex items-baseline">
              {/* price */}
              <span className="text-[#2970b7] text-4xl font-bold">S/. 185</span>
            </div>
              {/* Person desc */}
            <p className="text-[#6a6a6a] text-sm">por persona</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <Users className="h-6 w-6 text-[#6a6a6a] mb-1" />
                    {/* maxPassengers*/}
                    <span className="text-[#6a6a6a] text-sm">Hasta 10</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Capacidad máxima de 10 personas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <Activity className="h-6 w-6 text-[#6a6a6a] mb-1" />
                    {/* difficulty */}
                    <span className="text-[#6a6a6a] text-sm">Moderado</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nivel de dificultad moderado</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">

        <Button className="w-full bg-[#3eae64] hover:bg-[#35a058] text-white font-medium py-6 rounded-full">
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  )
}
