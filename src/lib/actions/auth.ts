'use server';

import { signIn as rawSignIn } from '@/lib/auth';

export const signIn = rawSignIn.bind(null, 'keycloak');
