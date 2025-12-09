import { RegistrationForm } from "@/components/RegistrationPassenger";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

async function checkUserStatus(token?: string): Promise<boolean> {
  try {
    const res = await fetch(`http://172.17.0.1:8081/api/passengers/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Si tu API requiere el token Bearer:
        "Authorization": `Bearer ${token}`,
      },
      // IMPORTANTE: '' asegura que no se cachee la respuesta falsa
      // para que cuando router.refresh() ocurra, vuelva a preguntar de verdad.
      cache: "no-store",
    });

    if (!res.ok) return false;

    const data = await res.json();
    console.log(data)
    return data.onboardingCompleted === true; // O la lógica que retorne tu API
  } catch (error) {
    console.error("Error comprobando estado:", error);
    return false; // Ante la duda, bloqueamos
  }
}
export default async function Page() {


  const session = await auth();


  if (!session) {
    console.log("NEEE")
  }

  const isAllowed = await checkUserStatus(session?.accessToken)

  console.log(isAllowed)
  if (!isAllowed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <RegistrationForm submitUrl="http://172.17.0.1:8081/api/passengers/complete" session={session} />
      </main>
    );
  }

  // 2. Si no hay sesión, forzar el login con un proveedor específico
  return (
    <div>
      <div className="p-8">
        <h1 className="text-2xl font-bold">DASHBOARD</h1>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {session && session!.user!.name}
          {session && session!.user!.id}
          {session && session!.expires}
          {session && session!.user!.email}
          {session && session.accessToken}
        </div>
      </div>
    </div>
  )
}
