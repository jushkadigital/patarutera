import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Button,
  Row,
  Column,
} from "@react-email/components"

import * as React from "react";
import Image from "next/image";
import PayloadImage from '@/components/PayloadImage';

interface Props {
  customerName: string
  items: any
}

export function EmailRecieve({
  customerName,
  items
}: Props
) {

  return (
    <Html>
      <Head />
      <Preview>Reserva confirmada - PATA RUTERA</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img src={"https://www.patarutera.pe/pataLogo.png"} alt="Logo" style={logo} />
          </Section>

          {/* Main Heading */}
          <Heading style={heading}>Confirmacian de la Reserva</Heading>

          {/* Description Text */}
          <Text style={description}>
            Usted tiene una nueva reserva de {items[0].name}. Este es un aviso de confirmacion de reserva, por lo que no se requiere alguna informacion </Text>

          {/* Subheading */}
          <Heading style={subheading}>Detalles de la Reserva</Heading>

          {/* Order Details Section */}

          <Section style={orderSection}>
            <Text style={orderTitle}>Detalles del Tour: {items[0].name}</Text>
            <Text style={orderTitle}>Detalles del Tour</Text>
            <Text style={orderTitle}>Detalles del Tour</Text>
            <Text style={orderTitle}>Detalles del Tour</Text>
            <Text style={orderTitle}>Detalles del Tour</Text>
            <Text style={orderTitle}>Detalles del Tour</Text>
            <Text style={orderTitle}>Detalles del Tour</Text>
            <Text style={orderTitle}>Detalles del Tour</Text>
          </Section>
          {/* CTA Button */}

          {/* Footer */}
          <Text style={footer}>Agradecemos tu confianza</Text>
        </Container>
      </Body>
    </Html>

  )
}

// Styles
const main = {
  backgroundColor: "#f6f6f6",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
}

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
}

const logo = {
  margin: "0 auto",
  height: "50px",
}

const heading = {
  color: "#4a5568",
  fontSize: "20px",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "30px 0 20px",
  letterSpacing: "0.5px",
}

const description = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: "1.6",
  textAlign: "center" as const,
  margin: "0 0 30px",
  padding: "0 20px",
}

const subheading = {
  color: "#4a5568",
  fontSize: "18px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "30px 0 20px",
}

const orderSection = {
  backgroundColor: "#f7fafc",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
}

const orderTitle = {
  color: "#4a5568",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 15px",
}

const itemRow = {
  marginBottom: "15px",
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: "15px",
}

const imageColumn = {
  width: "70px",
  verticalAlign: "middle" as const,
}



const detailsColumn = {
  verticalAlign: "middle" as const,
  paddingLeft: "15px",
}





const priceColumn = {
  verticalAlign: "middle" as const,
  textAlign: "right" as const,
  width: "80px",
}





const button = {
  backgroundColor: "#3182ce",
  borderRadius: "25px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 40px",
}

const footer = {
  color: "#a0aec0",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "30px 0 0",
}

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
}

const tableHeader = {
  backgroundColor: "#e2e8f0",
  color: "#4a5568",
  fontSize: "12px",
  fontWeight: "600",
  padding: "10px",
  textAlign: "left" as const,
  borderBottom: "2px solid #cbd5e0",
}

const tableRow = {
  borderBottom: "1px solid #e2e8f0",
}

const tableCell = {
  padding: "12px 10px",
  verticalAlign: "middle" as const,
}

const tableCellCenter = {
  padding: "12px 10px",
  verticalAlign: "middle" as const,
  textAlign: "center" as const,
}

const tableCellRight = {
  padding: "12px 10px",
  verticalAlign: "middle" as const,
  textAlign: "right" as const,
}

const itemImage = {
  width: "60px",
  height: "60px",
  borderRadius: "8px",
  objectFit: "cover" as const,
}

const itemName = {
  color: "#2d3748",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
}

const itemDate = {
  color: "#718096",
  fontSize: "12px",
  margin: "0",
}

const itemTravelers = {
  color: "#2d3748",
  fontSize: "14px",
  margin: "0",
}

const itemPrice = {
  color: "#3182ce",
  fontSize: "16px",
  fontWeight: "700",
  margin: "0",
}

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
}
