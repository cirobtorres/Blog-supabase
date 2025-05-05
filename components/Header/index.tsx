import Link from "next/link";
import { LogoutButton } from "../Buttons/client";
import { User } from "@supabase/supabase-js";
import { ProgressBar } from "../ProgressBar";

export const Header = ({ user }: { user: User | null }) => {
  return (
    <header className="fixed top-0 w-full h-20 backdrop-blur-sm bg-neutral-950/50">
      <div className="relative max-w-7xl mx-auto h-full">
        <div className="h-full mx-4 flex justify-between">
          <div className="flex items-center">
            <Link href="/">HOME</Link>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/admin" className="w-fit p-1 text-sm text-teal-500">
                display_name
              </Link>
              <LogoutButton label="Sair" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="w-fit text-sm py-1">
                Entrar
              </Link>
              <Link href="/sign-up" className="w-fit text-sm py-1">
                Cadastrar
              </Link>
            </div>
          )}
        </div>
        <ProgressBar />
      </div>
    </header>
  );
};
