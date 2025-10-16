
import * as React from 'react';
import { Email } from '../../../components/emails/email-template-send';
import { Resend } from 'resend';


export async function POST() {

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: 'ventas@patarutera.pe',
      to: 'urgosxd@gmail.com',
      subject: 'Hello world',
      react: Email('patita', [{ image: '' }]) as React.ReactNode,
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
