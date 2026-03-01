import { retrieveCart } from "@lib/data/cart";

export async function GET() {
  try {
    const cart = await retrieveCart().catch(() => null);
    return Response.json({ cart });
  } catch (error) {
    return Response.json({ cart: null }, { status: 500 });
  }
}
