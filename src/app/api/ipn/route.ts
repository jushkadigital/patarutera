import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch"


export async function POST(request: NextRequest) {
  // const secret = request.headers.get("secret");
  const document = await request.text();

  // console.log(document)
  const data = document.split("&")

  console.log(data)

  const divideResponse = data[22].split("=")

  const finalDivide = divideResponse[1].split("-")[1]


  console.log(finalDivide)
  return NextResponse.json({
    "message": "nice",
    "cache": "update"
  }, { status: 200 })


  // if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
  //   return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  // }



  // const paymentDataIPN = document
  //   console.log("IPN:", paymentDataIPN);
  //   /* Retrieve the IPN content */
  //   const formAnswer = paymentDataIPN["kr-answer"];
  //   const hash = paymentDataIPN["kr-hash"];
  //   const hashKey = paymentDataIPN["kr-hash-key"];



  // if(!checkHash(formAnswer, hash, hashKey) ) {
  //     return NextResponse.json({
  //       "message": "error"
  //     },{status: 400})
  //   }

  // /* Retrieve the transaction id from the IPN data */
  //   const transaction = formAnswer.transactions[0];

  //   /* get some parameters from the answer */
  //   const orderStatus = formAnswer.orderStatus;
  //   const orderId = formAnswer.orderDetails.orderId;
  //   const transactionUUID = transaction.uuid;

  //   console.log(orderStatus)
  // const data = await createFormToken(document)

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

}

export const revalidate = 0;
