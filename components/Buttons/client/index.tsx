"use client";

import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { deleteArticle, putPrivateArticle } from "@/services/article";
import { SignInOAuth, signOut } from "@/services/authentication";
import { Provider } from "@supabase/supabase-js";
import { useActionState, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

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
  { label: "Google", bgColor: "#e5322b", borderColor: "#ff645f" },
  { label: "Linkedin", bgColor: "#0379b7", borderColor: "#45beff" },
  { label: "Github", bgColor: "#000", borderColor: "#272727" },
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
            className="w-full py-1 rounded-md cursor-pointer"
            style={{
              backgroundColor: provider.bgColor,
              border: `1px solid ${provider.borderColor}`,
            }}
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
  const expectedString = "Deletar artigo";
  const [inputString, setInputString] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [state, action, isPending] = useActionState(async () => {
    const formData = new FormData();
    formData.set("articleId", article.id);
    formData.set("inputString", inputString);
    formData.set("expectedString", expectedString);

    const result = await deleteArticle(formData);

    if (!result) {
      toast("Artigo deletado!");
    }

    return result;
  }, null);

  const disabledButton = inputString !== expectedString;

  const clearInput = () => {
    setInputString("");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    clearInput();
  };

  useEffect(() => {
    if (!isPending && state === null) {
      handleCloseDialog();
    }
  }, [isPending, state]);

  return (
    <div
      className="h-5 w-fit flex items-center rounded border overflow-hidden border-neutral-800" // TODO: remover overflow-hidden e corrigir ring
    >
      <EditArticleButton {...article} />
      <AlertDialog open={isDialogOpen}>
        <AlertDialogTrigger
          onClick={() => setIsDialogOpen(true)}
          className="w-14 px-2 text-xs leading-5 cursor-pointer transition-colors duration-300 text-white bg-neutral-900 hover:bg-neutral-800"
        >
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              Deletar artigo?
              <AlertDialogCancel
                className="has-[>svg]:px-1 h-fit py-1"
                onClick={handleCloseDialog}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </AlertDialogCancel>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-warning flex items-center gap-2 border-y border-neutral-800 bg-neutral-950">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-octagon-alert-icon lucide-octagon-alert"
              >
                <path d="M12 16h.01" />
                <path d="M12 8v4" />
                <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" />
              </svg>
              Essa ação não poderá ser desfeita!
            </AlertDialogDescription>
            <fieldset className="p-3 flex flex-col gap-2">
              <label
                htmlFor="delete-article-input"
                className="text-sm text-neutral-400"
              >
                Escreva{" "}
                <span className="text-neutral-100 font-bold">
                  {expectedString}
                </span>{" "}
                para confirmar.
              </label>
              <input
                id="delete-article-input"
                type="text"
                placeholder={expectedString}
                autoComplete="off"
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                className="px-2 py-1 text-sm rounded outline-none transition-all focus-visible:border-neutral-500/75 focus-visible:ring-neutral-100/10 focus-visible:ring-[3px] border border-neutral-700 placeholder:text-neutral-600 bg-neutral-800"
              />
              {state && <p className="text-xs text-warning">{state.error}</p>}
            </fieldset>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-2">
            <AlertDialogCancel onClick={handleCloseDialog}>
              Cancelar
            </AlertDialogCancel>
            <form action={action}>
              <AlertDialogAction
                type="submit"
                disabled={disabledButton}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isPending ? "Loading" : "Confirmar"}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const EditArticleButton = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/admin/create-article/${id}`}
      className="w-14 px-2 inline-block text-xs leading-5 cursor-pointer text-center border-r transition-colors duration-300 border-neutral-800 text-white bg-neutral-900 hover:bg-neutral-800"
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
      <button className="w-14 px-2 text-xs leading-5 cursor-pointer transition-colors duration-300 text-white bg-neutral-900 hover:bg-neutral-800">
        Delete
      </button>
    </form>
  );
};

// export const DeleteArticleButton = ({ id }: { id: string }) => {
//   const pathname = usePathname();
//   const [, action] = useActionState(() => deleteArticle(id, pathname), null);
//   return (
//     <form action={action} className="flex items-center">
//       <button className="w-14 px-2 text-xs leading-5 cursor-pointer transition-colors duration-300 text-white bg-neutral-900 hover:bg-neutral-800">
//         Delete
//       </button>
//     </form>
//   );
// };

export const BackToTopButton = ({ articleId }: { articleId?: string }) => {
  const diameter = 75;
  const strokeWidth = 7;
  const outerRadius = diameter / 2;
  const innerRadius = diameter / 2 - strokeWidth * 2;
  const circunference = useRef(2 * Math.PI * innerRadius);

  useEffect(() => {
    const returnToTopListener = () => {
      const elementHeight =
        document.documentElement.scrollHeight - window.innerHeight; // Page total height

      const progressCircle = document.getElementById("progress-circle");
      const progressCircleBlur = document.getElementById(
        "progress-circle-blur"
      );

      const scrollTop = window.scrollY; // Current Y coord height (pixels)

      if (elementHeight && progressCircle && progressCircleBlur) {
        const percentage =
          scrollTop < elementHeight ? (scrollTop / elementHeight) * 100 : 100; // Current Y coord (percentage)

        progressCircle.style.strokeDashoffset = `${
          circunference.current - (circunference.current * percentage) / 100
        }`;
        progressCircleBlur.style.strokeDashoffset =
          progressCircle.style.strokeDashoffset;
      }
    };

    window.addEventListener("scroll", returnToTopListener);
    // cleanup function
    return () => {
      window.removeEventListener("scroll", returnToTopListener);
    };
  }, [articleId]);

  return (
    <div
      id="btt-btn-container"
      data-testid="btt-btn-container"
      className="self-start sticky mx-auto top-1/2 -translate-y-1/2"
    >
      <button
        id="btt-btn"
        data-testid="btt-btn"
        type="button"
        aria-label="Voltar ao topo da página"
        title="Voltar ao topo da página"
        onClick={() => window.scrollTo(0, 0)}
        // style={{ height: `${diameter}px` }}
        // className="relative flex cursor-pointer group rounded focus-visible:outline-2 focus-visible:outline-white"
        style={{
          height: `${diameter}px`,
          top: "50%",
          bottom: "50%",
          transform: "translateY(0,-50%)",
        }}
        className={
          `relative flex cursor-pointer group` +
          ` my-40 transition-all rounded outline-none` +
          ` focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]`
        }
      >
        <svg
          className="relative -rotate-90"
          role="presentation"
          aria-hidden="true"
          focusable="false"
          style={{ width: `${diameter}px`, height: `${diameter}px` }}
        >
          <circle
            cx={outerRadius}
            cy={outerRadius}
            r={`${innerRadius}px`}
            strokeWidth={`${strokeWidth}px`}
            strokeDasharray={circunference.current}
            className="w-fit h-fit fill-none stroke-neutral-800"
            style={{ strokeDashoffset: 0 }}
          />
          <circle
            id="progress-circle"
            data-testid="progress-circle"
            cx={outerRadius}
            cy={outerRadius}
            r={`${innerRadius}px`}
            strokeWidth={`${strokeWidth}px`}
            strokeDasharray={circunference.current}
            style={{ strokeDashoffset: circunference.current }}
            className="w-fit h-fit fill-none stroke-theme-color"
          />
          <circle
            id="progress-circle-blur"
            data-testid="progress-circle-blur"
            cx={outerRadius}
            cy={outerRadius}
            r={`${innerRadius}px`}
            strokeWidth={`${strokeWidth}px`}
            strokeDasharray={circunference.current}
            style={{ strokeDashoffset: circunference.current }}
            className="w-fit h-fit fill-none stroke-theme-color blur-xs"
          />
        </svg>
        <svg
          id="btt-arrow-up"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          height="20px"
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group-hover:animate-bouncing-arrow"
        >
          <path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" />
        </svg>
      </button>
    </div>
  );
};
