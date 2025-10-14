import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch"
import * as React from 'react';
import { Email } from '../../../components/emails/email-template-send';
import { Resend } from 'resend';


export async function POST(request: NextRequest) {
  // const secret = request.headers.get("secret");

  //const resend = new Resend(process.env.RESEND_API_KEY);
  const document = await request.text();

  // console.log(document)
  const data = document.split("&")

  console.log(data)

  const divideResponse = data[22].split("=")

  const finalDivide = divideResponse[1].split("-")[1]

  const emailResponse = data[23].split("=")

  console.log(decodeURIComponent(emailResponse[1]))
  /*
   try {
     const { data, error } = await resend.emails.send({
       from: 'ventas@patarutera.pe',
       to: 'ventas@patarutera.pe',
       subject: 'Hello world',
       react: Email() as React.ReactNode,
       //html: '<div> Hello Next</div>'
 
     });
 
     console.log(error)
 
     if (error) {
       return Response.json({ error }, { status: 500 });
     }
 
     return Response.json({ data });
   } catch (error) {
 
   }
 
 
 
   try {
     const { data, error } = await resend.emails.send({
       from: 'ventas@patarutera.pe',
       to: 'urgosxd@gmail.com',
       subject: 'Hello world',
       react: Email() as React.ReactNode,
       //html: '<div> Hello Next</div>'
     });
 
     console.log(error)
 
     if (error) {
       return Response.json({ error }, { status: 500 });
     }
 
     return Response.json({ data });
   } catch (error) {
 
   }
 
 */
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
