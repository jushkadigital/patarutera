import { signIn } from '@/lib/auth';

export const GET = async () => {
  await signIn("keycloak", { redirectTo: "/dashboard" });
};
