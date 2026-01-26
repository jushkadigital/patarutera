'use server';

import { signIn as rawSignIn } from '@/lib2/auth';

export const signIn = rawSignIn.bind(null, 'keycloak');
