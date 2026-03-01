import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import CartTemplate from "@modules/cart/templates"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart() {
  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return null
  })
  console.log("MONO")
  console.log(cart)
  const customer = await retrieveCustomer().catch(() => null)

  if (!cart) {
    notFound()
  }

  return <CartTemplate cart={cart} customer={customer} />
}
