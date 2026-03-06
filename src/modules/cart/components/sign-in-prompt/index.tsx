'use client'
import usePopupAuth from "@/hooks/usePopupAuth";

import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {

  const { openPopup, isLoading, error } = usePopupAuth();
  const handleLoginClick = async () => {
    try {
      await openPopup({ provider: "keycloak" });
      window.location.reload();
    } catch { }
  };

  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          Ya tienes una cuenta?
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          Inicia sesion para una mejor experiencia.
        </Text>
      </div>
      <div>

        <Button variant="secondary" className="h-10" data-testid="sign-in-button"
          onClick={() => void handleLoginClick()}
        >
          Sign in
        </Button>
      </div>
    </div>
  )
}

export default SignInPrompt
