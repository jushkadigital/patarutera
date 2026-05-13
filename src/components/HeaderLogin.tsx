"use client";
import { Session } from "next-auth";
import { SignOutButton } from "@modules/account/components/sign-out-button";

export interface HeaderProps {
  session?: Session | null;
}

export function HeaderLogin({ session }: HeaderProps) {
  return (
    <header className="bg-gray-800 text-white p-4 flex flex-row justify-between items-center">
      <h1>Patarutera</h1>
      {session?.user && (
        <div className="flex flex-row justify-between items-center">
          <div className="mr-4">{session.user.email}</div>
          <SignOutButton />
        </div>
      )}
    </header>
  );
}
