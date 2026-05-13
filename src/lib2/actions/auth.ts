"use server";

import { signIn, auth } from "@/lib2/auth";
import { syncWithMedusa, transferCartToCustomer } from "@/lib2/auth/medusa-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function credentialLogin(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos" };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Credenciales inválidas" };
    }

    const session = await auth();

    if (session?.accessToken) {
      const { medusaJwt } = await syncWithMedusa(session.accessToken);
      const cookieStore = await cookies();
      const isProduction = process.env.NODE_ENV === "production";

      if (medusaJwt) {
        cookieStore.set("_medusa_jwt", medusaJwt, {
          httpOnly: true,
          sameSite: "lax",
          secure: isProduction,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      const cartId = cookieStore.get("_medusa_cart_id")?.value;
      if (cartId && medusaJwt) {
        await transferCartToCustomer(cartId, medusaJwt);
      }

      cookieStore.set("medusa_sync_guest_fallback", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        maxAge: 0,
        path: "/",
      });
    }

    redirect("/account");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return { error: "Error al iniciar sesión. Intenta de nuevo." };
  }
}

export async function googleLogin() {
  await signIn(
    "keycloak",
    { redirectTo: "/account" },
    { kc_idp_hint: "google" },
  );
}
