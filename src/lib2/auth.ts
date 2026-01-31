import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

const MEDUSA_SYNC_URL = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/auth/keycloak`;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
      authorization: {
        params: {
          // 👇 ESTA LÍNEA ES CRÍTICA. Sin 'openid', el endpoint userinfo falla.
          scope: "openid profile email offline_access",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // 1. PRIMER INICIO DE SESIÓN (Aquí es donde recibimos los tokens)
      console.log(token);
      // 'account' solo existe la primera vez que el usuario se loguea
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; // Útil si implementas rotación
        // Calculamos cuándo expira (opcional, para manejo avanzado)
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // 2. PASO A LA SESIÓN (Exponemos lo guardado en el JWT a la app)
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
});
