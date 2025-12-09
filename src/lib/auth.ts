import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    async jwt({ token, account, user }) {
      // 1. PRIMER INICIO DE SESIÓN (Aquí es donde recibimos los tokens)
      if (account) {
        console.log("Tokens recibidos de Keycloak"); // Debug
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        // token.expiresAt = account.expires_at; // Útil para rotación futura
      }
      return token;
    },
    async session({ session, token }) {
      // 2. PASO A LA SESIÓN (Exponemos lo guardado en el JWT a la app)
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  }
})
