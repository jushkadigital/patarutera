import { RegistrationForm } from "@/components/RegistrationPassenger";
import { auth } from "@/lib2/auth";
import { retrieveCustomer } from "@lib/data/customer";
import { listOrders } from "@lib/data/orders";
import Overview from "@modules/account/components/overview";
import AccountLayout from "@modules/account/templates/account-layout";
import { redirect } from "next/navigation";

async function checkUserStatus(token?: string): Promise<boolean> {
  try {
    const response = await fetch("http://172.17.0.1:8081/api/passengers/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.onboardingCompleted === true;
  } catch (error) {
    console.error("Error checking user status:", error);
    return false;
  }
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/login");
  }

  const isAllowed = await checkUserStatus(session.accessToken);

  if (!isAllowed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <RegistrationForm
          submitUrl="http://172.17.0.1:8081/api/passengers/complete"
          session={session}
        />
      </main>
    );
  }

  const customer = await retrieveCustomer().catch(() => null);
  const orders = customer ? await listOrders(5, 0).catch(() => null) : null;

  return (
    <AccountLayout customer={customer}>
      <Overview customer={customer} orders={orders} />
    </AccountLayout>
  );
}
