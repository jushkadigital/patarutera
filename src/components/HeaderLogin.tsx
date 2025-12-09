'use client';
import { Session } from 'next-auth';
import { SignIn } from './LoginKeycloak';
import SignOut from './LogoutKeycloak';

export interface HeaderProps {
  session?: Session | null;
}
export function HeaderLogin({ session }: HeaderProps) {
  return (
    <header className="bg-gray-800 text-white p-4 flex flex-row justify-between items-center">
      <h1>NextJS KC</h1>
      {session?.user && (
        <div className="flex flex-row justify-between items-center">
          <div className="mr-4">{session.user.email}</div>
          <SignOut name={session.user.name ?? ''} />
        </div>
      )}
    </header>
  );
}
