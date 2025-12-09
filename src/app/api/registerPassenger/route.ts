import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Aquí puedes procesar los datos o reenviarlos a otra API
    console.log("Datos recibidos:", data)

    // Ejemplo: reenviar a otra URL externa
    // const externalResponse = await fetch("https://tu-api-externa.com/endpoint", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // })

    return NextResponse.json({ success: true, message: "Datos recibidos correctamente" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, message: "Error al procesar los datos" }, { status: 500 })
  }
}

