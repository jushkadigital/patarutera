"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { cookies } from "next/headers"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"
import { auth } from "@/lib2/auth"



export const retrieveCustomer2 = async (): Promise<HttpTypes.StoreCustomer | null> => {

  const session = await auth(); // 👈 Se llama auth(), no getServerSession
  const token = session?.accessToken;
  // 1. Obtenemos la sesión del servidor (NextAuth)

  // Si no hay token de Keycloak, no hay usuario. Retornamos null.
  if (!token) return null

  // 2. Preparamos los headers
  // En lugar de Cookie, enviamos Authorization Bearer
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const next = {
    ...(await getCacheOptions("customers")),
  }

  // 3. Llamada al SDK
  // IMPORTANTE: Cambiamos '/store/customers/me' por tu endpoint custom '/store/keycloak-me'
  // Esto es necesario porque '/me' nativo exige cookies que no tenemos.
  return await sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/keycloak-me`, {
      method: "GET",
      // query: { fields: "*orders" }, // Puedes descomentar si tu endpoint custom soporta query params
      headers,
      cache: "no-store",
    })
    .then(({ customer }) => customer)
    .catch((err) => {
      console.error("Error retrieving customer:", err.message)
      return null
    })
}

export const retrieveCustomer3 = async (): Promise<HttpTypes.StoreCustomer | null> => {
  try {
    const cookieStore = await cookies()
    const medusaCookie = cookieStore.get("connect.sid")

    if (!medusaCookie) return null

    // Usamos fetch nativo para evitar que el SDK inyecte headers "mágicos"
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

    const response = await fetch(`${baseUrl}/store/customers/me?fields=*orders`, {
      method: "GET",
      headers: {
        // ✅ SOLO enviamos Cookie y API Key
        "Cookie": `connect.sid=${medusaCookie.value}`,
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        "Content-Type": "application/json",
      },
      cache: "no-store", // CRÍTICO: No cachear
    })

    if (!response.ok) {
      console.error(`Error retrieveCustomer: ${response.status} ${response.statusText}`)
      return null
    }

    const { customer } = await response.json()
    return customer

  } catch (err) {
    console.error("Error retrieving customer:", err)
    return null
  }
}

export const retrieveCustomer6 = async (): Promise<HttpTypes.StoreCustomer | null> => {
  try {
    const cookieStore = await cookies()

    // 1. Obtenemos EL STRING COMPLETO de cookies (Raw)
    // Esto incluirá 'connect.sid', '_medusa_jwt', o como se llame en tu server.
    const allCookies = cookieStore.toString()

    // Si no hay cookies, ni intentamos
    if (!allCookies) return null

    // console.log("🍪 Reenviando cookies:", allCookies) // Descomenta para debug

    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

    // 2. Usamos fetch nativo enviando todo el paquete de cookies
    const response = await fetch(`${baseUrl}/store/customers/me?fields=*orders`, {
      method: "GET",
      headers: {
        "Cookie": allCookies, // ✅ Pasamos todo tal cual llegó
        "Content-Type": "application/json",
        // ⚠️ IMPORTANTE: Comenta la API Key para probar si es error de Canal de Ventas
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      // Vamos a ver qué nombre de cookie esperaba o qué error da
      const text = await response.text()
      console.error(`❌ Medusa rechazó (/me): ${response.status} - ${text}`)
      return null
    }

    const { customer } = await response.json()
    return customer

  } catch (err) {
    console.error("Error crítico en retrieveCustomer:", err)
    return null
  }
}
export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }
export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)
      })
  } catch (error: any) {
    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}
