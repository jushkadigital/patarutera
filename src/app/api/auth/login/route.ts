import { signIn } from '@/lib2/auth';

export const GET = async () => {
  await signIn("keycloak", { redirectTo: "/dashboard" });
};
