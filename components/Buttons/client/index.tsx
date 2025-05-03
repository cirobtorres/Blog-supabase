"use client";

import { deleteArticle, putPrivateArticle } from "@/services/article";
import { SignInOAuth, signOut } from "@/services/authentication";
import { Provider } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useState } from "react";

export const LogoutButton = ({ label }: { label: string }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        signOut();
      }}
      className="text-sm cursor-pointer hover:text-white"
    >
      {label}
    </button>
  );
};

const providers = [
  { label: "Google", bgColor: "#e5322b" },
  { label: "Linkedin", bgColor: "#0379b7" },
  { label: "Github", bgColor: "black" },
];

export const ProvidersRowButtons = () => {
  const [state, setState] = useState<Provider | null>(null);
  const [, action] = useActionState(() => {
    if (state) return SignInOAuth(state);
  }, null);

  return (
    <>
      <Ou />
      <form action={action} className="flex flex-col gap-2">
        {providers.map((provider, index) => (
          <button
            key={index}
            type="submit"
            onClick={() =>
              setState(
                () => provider.label.toLowerCase() as "google" | "github"
              )
            }
            className="w-full py-1 cursor-pointer"
            style={{ backgroundColor: provider.bgColor }}
          >
            {provider.label}
          </button>
        ))}
      </form>
    </>
  );
};

const Ou = () => {
  return (
    <div className="relative py-4">
      <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-2 pointer-events-none text-neutral-600 bg-neutral-950">
        ou
      </span>
      <hr className="border-y-neutral-800" />
    </div>
  );
};

export const EditOrDeleteArticleButtons = ({
  article,
}: {
  article: Article;
}) => {
  return (
    <div className="h-5 w-fit flex items-center rounded border overflow-hidden border-neutral-800">
      <EditArticleButton {...article} />
      {/* <BlockArticleButton {...article} /> */}
      <DeleteArticleButton {...article} />
    </div>
  );
};

export const EditArticleButton = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/admin/create-article/${id}`}
      className="w-14 px-2 inline-block text-xs leading-5 cursor-pointer text-center border-r border-neutral-800 text-white bg-neutral-900 hover:bg-neutral-800"
    >
      Edit
    </Link>
  );
};

export const BlockArticleButton = ({
  id,
}: {
  id: string;
  title: string;
  sub_title: string | null;
  body: string;
}) => {
  const [, action] = useActionState(() => putPrivateArticle(id), null);
  return (
    <form action={action} className="flex items-center">
      <button className="w-14 px-2 text-xs leading-5 cursor-pointer text-white bg-neutral-900 hover:bg-neutral-800">
        Delete
      </button>
    </form>
  );
};

export const DeleteArticleButton = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [, action] = useActionState(() => deleteArticle(id, pathname), null);
  return (
    <form action={action} className="flex items-center">
      <button className="w-14 px-2 text-xs leading-5 cursor-pointer text-white bg-neutral-900 hover:bg-neutral-800">
        Delete
      </button>
    </form>
  );
};
