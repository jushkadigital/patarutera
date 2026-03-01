import { signIn } from "@/lib2/auth";

const DEFAULT_REDIRECT_TO = "/dashboard";
const DEFAULT_PROVIDER = "keycloak";

const getSafeRedirectTo = (raw: string | null): string => {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return DEFAULT_REDIRECT_TO;
  }

  return raw;
};

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const redirectTo = getSafeRedirectTo(searchParams.get("redirectTo"));
  const provider =
    searchParams.get("provider") === "keycloak" ? "keycloak" : DEFAULT_PROVIDER;

  await signIn(provider, { redirectTo });
};
