import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import Credentials from "next-auth/providers/credentials";
import {
  exchangeCredentialsForTokens,
  refreshKeycloakToken,
} from "./auth/keycloak-token";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const tokens = await exchangeCredentialsForTokens(
          credentials.email as string,
          credentials.password as string,
        );

        if (!tokens) {
          return null;
        }

        return {
          id: tokens.sub,
          email: tokens.email,
          name: tokens.name,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          idToken: tokens.id_token,
          expiresAt: tokens.expires_at,
        };
      },
    }),
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
      authorization: {
        params: {
          scope: "openid profile email offline_access",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken as string;
        token.refreshToken = user.refreshToken as string;
        token.idToken = user.idToken as string;
        token.expiresAt = user.expiresAt as number;
        token.provider = "credentials";
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token ?? undefined;
        token.idToken = (account as Record<string, unknown>).id_token as
          | string
          | undefined;
        token.expiresAt = account.expires_at;
        token.provider = "keycloak";
      }

      if (
        token.expiresAt &&
        Date.now() > (token.expiresAt as number) * 1000
      ) {
        if (token.refreshToken) {
          try {
            const refreshed = await refreshKeycloakToken(
              token.refreshToken as string,
            );
            if (refreshed) {
              token.accessToken = refreshed.access_token;
              token.refreshToken = refreshed.refresh_token;
              token.idToken = refreshed.id_token;
              token.expiresAt = refreshed.expires_at;
              return token;
            }
          } catch (error) {
            console.error("[AUTH] Token refresh failed:", error);
          }
        }
        return { ...token, error: "RefreshAccessTokenError" };
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.idToken = token.idToken;
      session.error = token.error;
      session.provider = token.provider;
      return session;
    },
  },
  pages: {
    signIn: "/account",
  },
});
