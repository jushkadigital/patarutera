import { HeaderLogin } from "@/components/HeaderLogin";
import { auth } from "@/lib2/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderLogin session={session} />
      {children}
    </div>
  );
}
