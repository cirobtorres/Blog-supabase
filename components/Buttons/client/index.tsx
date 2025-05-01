"use client";

import { deleteArticle } from "@/services/article";
import { SignInOAuth, signOut } from "@/services/authentication";
import { Provider } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useState } from "react";

export const LogoutButton = () => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        signOut();
      }}
      className="p-1 cursor-pointer bg-neutral-700"
    >
      Sign out
    </button>
  );
};

const providers = [{ label: "Github", bgColor: "black" }];

export const ProvidersRowButtons = () => {
  const [state, setState] = useState<Provider | null>(null);
  const [, action] = useActionState(() => {
    if (state) return SignInOAuth(state);
  }, null);

  return (
    <>
      <Or />
      <form action={action} className="flex flex-col gap-2">
        {providers.map((provider, index) => (
          <button
            key={index}
            type="submit"
            onClick={() => setState(() => "github")}
            className="w-full py-1 cursor-pointer"
            style={{ backgroundColor: provider.bgColor }}
          >
            GitHub
          </button>
        ))}
      </form>
    </>
  );
};

const Or = () => {
  return (
    <div className="relative py-4">
      <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-2 pointer-events-none text-neutral-600 bg-neutral-950">
        or
      </span>
      <hr className="border-y-neutral-800" />
    </div>
  );
};

export const EditArticleButton = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/articles/create-article/${id}`}
      className="inline-block w-14 text-center font-bold text-sm cursor-pointer bg-yellow-600"
    >
      Edit
    </Link>
  );
};

export const DeleteArticleButton = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [, action] = useActionState(() => deleteArticle(id, pathname), null);
  return (
    <form action={action} className="inline-block">
      <button className="w-14 font-bold text-sm cursor-pointer bg-red-600">
        Delete
      </button>
    </form>
  );
};
