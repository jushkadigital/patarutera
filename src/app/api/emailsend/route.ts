
import * as React from 'react';
import { Email } from '../../../components/emails/email-template-send';
import { Resend } from 'resend';
import { BASEURL } from '@/lib/config';

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
export async function POST() {

  const resend = new Resend(process.env.RESEND_API_KEY);

  let page = await queryTourById({ id: '6' })

  const { id, title, meta } = page

  console.log(title)
  console.log(meta)

  try {
    const { data, error } = await resend.emails.send({
      from: 'ventas@patarutera.pe',
      to: 'urgosxd@gmail.com',
      subject: 'Hello world',
      react: Email({ customerName: 'pata', items: [{ image: meta.image.sizes.square.url, name: title, date: new Date().toISOString().split('T')[0], travelers: 3, price: Number('50').toFixed(2) }] }) as React.ReactNode,
      //html: '<div> Hello Next</div>'
    });

    console.log(error)

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
