import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch"


export async function POST(request: NextRequest) {
  // const secret = request.headers.get("secret");
  const document = await request.json();

  console.log(document)
  // if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
  //   return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  // }


  const createFormToken = async (paymentConf) => {

    const createPaymentEndPoint = `https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePaymentOrder`

    const base64Code = Buffer.from(process.env.ID_TIENDA + ":" + process.env.PASSWORD).toString('base64')

    try {
      const response = await fetch(createPaymentEndPoint, {
        method: 'post',
        body: JSON.stringify(paymentConf),
        headers: {
          'Authorization': `Basic ${base64Code}`,
          'Content-Type': 'application/json'
        }
      });

      return response.text();
    } catch (error) {
      throw error;
    }
  }

  const data = await createFormToken(document)

  // This will revalidate any URL that matches the provided page file on the next page visit.
  // This will not invalidate pages beneath the specific page.
  // For example, /blog/[slug] won't invalidate /blog/[slug]/[author].

  // revalidatePath("/blog/[slug]", "page");
  // // or with route groups
  // revalidatePath("/(main)/post/[slug]", "page");

  // This will revalidate any URL that matches the provided layout file on the next page visit.
  // This will cause pages beneath with the same layout to revalidate on the next visit.
  // For example, in the above case, /blog/[slug]/[another] would also revalidate on the next visit.

  // revalidatePath("/blog/[slug]", "layout");
  // // or with route groups
  // revalidatePath("/(main)/post/[slug]", "layout");

  return NextResponse.json({
    "message": data,
    "cache": "update"
  }, { status: 200 })
}

export const revalidate = 0;
