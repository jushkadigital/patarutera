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

export function Email(
  customerName = "Rutera",
  items = [
    {
      name: "Pata Rutera Clásica",
      date: "04/12/2025",
      price: 138,
      image: "https://placeholder.svg?height=60&width=60&query=pata+rutera+clasica",
    },
    {
      name: "Perro Caliente Clásico",
      date: "04/12/2025",
      price: 108,
      image: "https://placeholder.svg?height=60&width=60&query=perro+caliente",
    },
  ],
  logoUrl = "https://placeholder.svg?height=50&width=120&query=pata+rutera+logo",
) {
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <Html>
      <Head />
      <Preview>Tu compra fue confirmada - PATA RUTERA</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img src={logoUrl} alt="PATA RUTERA" style={logo} />
          </Section>

          {/* Main Heading */}
          <Heading style={heading}>TU COMPRA FUE CONFIRMADA</Heading>

          {/* Description Text */}
          <Text style={description}>
            Hola {customerName}, gracias por realizar tu compra con nosotros, estamos felices de que hayas decidido
            unirte a nuestra experiencia. Queremos que sepas que estamos preparando todo para que vivas una experiencia
            inolvidable.
          </Text>

          {/* Subheading */}
          <Heading style={subheading}>¡Nos vemos muy pronto {customerName}!</Heading>

          {/* Order Details Section */}
          <Section style={orderSection}>
            <Text style={orderTitle}>Detalles del Tour</Text>

            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={imageColumn}>
                  <Img src={item.image} alt={item.name} style={itemImage} />
                </Column>
                <Column style={detailsColumn}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemDate}>{item.date}</Text>
                </Column>
                <Column style={priceColumn}>
                  <Text style={itemPrice}>S/ {item.price}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href="#">
              VER ITINERARIO
            </Button>
          </Section>

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

const itemImage = {
  width: "60px",
  height: "60px",
  borderRadius: "8px",
  objectFit: "cover" as const,
}

const detailsColumn = {
  verticalAlign: "middle" as const,
  paddingLeft: "15px",
}

const itemName = {
  color: "#2d3748",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 5px",
}

const itemDate = {
  color: "#a0aec0",
  fontSize: "12px",
  margin: "0",
}

const priceColumn = {
  verticalAlign: "middle" as const,
  textAlign: "right" as const,
  width: "80px",
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
