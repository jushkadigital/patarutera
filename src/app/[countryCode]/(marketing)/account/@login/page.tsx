import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import { SSOTokenHandler } from "@modules/account/components/sso-token-handler"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Medusa Store account.",
}

export default function Login() {
  return (
    <>
      <SSOTokenHandler />
      <LoginTemplate />
    </>
  )
}
