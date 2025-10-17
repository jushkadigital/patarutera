import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch"
import * as React from 'react';
import { Email } from '../../../components/emails/email-template-send';
import { Resend } from 'resend';
import { BASEURL } from "@/lib/config";

const queryTourById = async ({ id }: { id: string }) => {
  // La URL cambia para buscar directamente por ID: ${BASEURL}/api/tours/${id}
  const data = await fetch(`${BASEURL}/api/tours/${id}?depth=3&draft=false`);
  const result = await data.json();

  // Si la búsqueda por ID es exitosa, el resultado es el documento directamente, 
  // no está dentro de un array 'docs'.
  // Es mejor incluir un chequeo de errores si la API de Payload lo proporciona.
  // Por simplicidad, retornamos el resultado que debería ser el tour o un error si no se encuentra.
  return result || null;
};


const queryPaqueteById = async ({ id }: { id: string }) => {
  // La URL cambia para buscar directamente por ID: ${BASEURL}/api/tours/${id}
  const data = await fetch(`${BASEURL}/api/paquetes/${id}?depth=3&draft=false`);
  const result = await data.json();

  // Si la búsqueda por ID es exitosa, el resultado es el documento directamente, 
  // no está dentro de un array 'docs'.
  // Es mejor incluir un chequeo de errores si la API de Payload lo proporciona.
  // Por simplicidad, retornamos el resultado que debería ser el tour o un error si no se encuentra.
  return result || null;
};

export async function POST(request: NextRequest) {
  // const secret = request.headers.get("secret");

  const resend = new Resend(process.env.RESEND_API_KEY);
  const document = await request.text();

  // console.log(document)
  const data = document.split("&")

  console.log(data)
  console.log(`https://pdscorporation.bitrix24.es/rest/${process.env.BITRIX_AUTH}/${process.env.BITRIX_API_KEY}/crm.deal.add.json`)

  const divideResponse = data[22].split("=")

  const finalDivide = divideResponse[1].split("-")

  const emailResponse = data[23].split("=")

  const nameResponse = data[24].split("=")

  const amountResponse = data[0].split("=")

  const phoneResponse = data[25].split("=")

  const dniResponse = data[26].split("=")

  const countryResponse = data[27].split("=")

  const numberPassengersResponse = data[28].split("=")

  const getEmail = (decodeURIComponent(emailResponse[1]))
  const getName = (decodeURIComponent(nameResponse[1]))
  const getAmount = Number(decodeURIComponent(amountResponse[1])) / 100
  const getPhone = (decodeURIComponent(phoneResponse[1]))
  const getDni = (decodeURIComponent(dniResponse[1]))
  const getCountry = (decodeURIComponent(countryResponse[1]))
  const getNumberPassengers = Number(decodeURIComponent(numberPassengersResponse[1]))


  let idCrmDealAdd
  let idContact
  try {
    const day = 60 * 60 * 24 * 1000;
    const nowCrmDealAdd = new Date();
    const after10Days = new Date(nowCrmDealAdd.getTime() + 10 * day);
    const response = await fetch(`https://pdscorporation.bitrix24.es/rest/${process.env.BITRIX_AUTH}/${process.env.BITRIX_API_KEY}/crm.deal.add.json`, {
      body: JSON.stringify(
        {
          FIELDS: {
            TITLE: `Pagado desde la web Pata Rutera. Pasajero: ${getName}`,
            TYPE_ID: 1,
            CATEGORY_ID: 39,
            STAGE_ID: "C39:PREPARATION",
            IS_RECURRING: "N",
            IS_RETURN_CUSTOMER: "Y",
            IS_REPEATED_APPROACH: "Y",
            PROBABILITY: 99,
            CURRENCY_ID: "PEN",
            OPPORTUNITY: getAmount.toFixed(2),
            IS_MANUAL_OPPORTUNITY: "Y",
            TAX_VALUE: 0,
            COMPANY_ID: null,
            BEGINDATE: nowCrmDealAdd.toISOString(),
            CLOSEDATE: after10Days.toISOString(),
            OPENED: "Y",
            CLOSED: "N",
            COMMENTS: "Creado desde la API",
            SOURCE_ID: "REPEAT_SALE",
            SOURCE_DESCRIPTION: "Additional information about the source",
            ADDITIONAL_INFO: "Additional information",
            UTM_SOURCE: "source",
            UTM_MEDIUM: "null",
            PARENT_ID_1220: null,
            UF_CRM_1721244482250: "Hello world!"
          },
          UF_CRM_1651640867: "Líder de Grupo Nombre: [Nombres y Apellidos] F. de Nac.: [11/03/0000] Doc.: [Pasaporte] [DNI] [CE] N°: [72717990] Nacionalidad: [Costarricense]  Género:  [M] [F]",
          UF_CRM_1739024172525: "Lunes a PDS: Mañana : 10am -13pm Tarde 14:pm - 19:30 pm Viernes: Mañana 08 am - 12:30pm tarde 13:30pm 17:30pm sabado: Mañana 08am -13:30 pm",
          UF_CRM_1661869816: "Número: \u002200\u0022 | Edades: \u002201-05\u0022 ",
          PARAMS: {
            REGISTER_SONET_EVENT: "N"
          }
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST"
    })

    if (!response.ok) {
      return Response.json({ error: 'error bitrix24 crm.deal.add' }, { status: 500 });
    }

    const dataCrmDealAdd = await response.json() as { result: string }

    idCrmDealAdd = dataCrmDealAdd['result']


  }
  catch (err) {

  }

  try {
    const response = await fetch(`https://pdscorporation.bitrix24.es/rest/${process.env.BITRIX_AUTH}/${process.env.BITRIX_API_KEY}/crm.contact.add.json`, {
      body: JSON.stringify(
        {
          FIELDS: {
            NAME: getName,
            PHOTO: null,
            BIRTHDATE: "",
            TYPE_ID: 3,
            SOURCE_ID: "WEB",
            SOURCE_DESCRIPTION: "*Additional information about the source*",
            POST: "Administrator",
            COMMENTS: "Creado desde api",
            OPENED: "Y",
            EXPORT: "Y",
            PHONE: [
              {
                VALUE: getPhone,
                VALUE_TYPE: "WORK"
              }
            ],
            EMAIL: [
              {
                VALUE: getEmail,
                VALUE_TYPE: "WORK"
              }
            ]
          }

        }
      ),
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST"
    })

    if (!response.ok) {
      return Response.json({ error: 'error bitrix24 crm.contact.add' }, { status: 500 });
    }

    const data = await response.json() as { result: string }

    idContact = data['result']
  }
  catch (err) {

  }


  try {
    const response = await fetch(`https://pdscorporation.bitrix24.es/rest/${process.env.BITRIX_AUTH}/${process.env.BITRIX_API_KEY}/crm.deal.contact.add.json`, {
      body: JSON.stringify(
        {
          ID: idCrmDealAdd,
          FIELDS: {
            CONTACT_ID: idContact
          },
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST"
    })

    if (!response.ok) {
      return Response.json({ error: 'error bitrix24 crm.deal.contact.add' }, { status: 500 });
    }

    const dataCrmDealAdd = await response.json() as { result: string }


  }
  catch (err) {

  }

  try {
    const response = await fetch(`https://pdscorporation.bitrix24.es/rest/${process.env.BITRIX_AUTH}/${process.env.BITRIX_API_KEY}/crm.deal.update.json`, {
      body: JSON.stringify(
        {
          ID: idCrmDealAdd,
          FIELDS: {
            UF_CRM_1739024172525: "",
            UF_CRM_1721244482250: "Hello world!",
            UF_CRM_1651640867: `Líder de Grupo Nombre: [${getName} ] F. de Nac.: [No se incluyo] Doc.: [DNI] N°: [${getDni}] Nacionalidad: [${getCountry}] Género: [M]`
          },
          PARAMS: {
            REGISTER_SONET_EVENT: "N",
            REGISTER_HISTORY_EVENT: "N"
          }
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST"
    })

    if (!response.ok) {
      return Response.json({ error: 'error bitrix24 crm.deal.update' }, { status: 500 });
    }

    const dataCrmDealAdd = await response.json() as { result: string }


  }
  catch (err) {

  }

  let page

  if (finalDivide[0] == 'tour') {
    page = await queryTourById({ id: finalDivide[1] })
  }
  else {
    page = await queryPaqueteById({ id: finalDivide[1] })
  }

  const { id, title, meta } = page


  console.log(title)
  console.log(meta)

  try {
    const { data, error } = await resend.emails.send({
      from: 'ventas@patarutera.pe',
      to: getEmail,
      subject: 'Pata Rutera',
      react: Email({ customerName: getName, items: [{ image: meta.image.sizes.square.url, name: title, date: new Date().toISOString().split('T')[0], travelers: getNumberPassengers.toString(), price: getAmount.toFixed(2) }] }) as React.ReactNode,
      //html: '<div> Hello Next</div>'
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

  } catch (error) {

  }

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
