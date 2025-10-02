import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile } from "../../../services/user";
import { CreateArticleForm } from "../../../components/Forms/CreateArticleForn";
import { StaticHeader } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { cn } from "../../../utils/classnames";
import { MENU_ITEMS } from "@/constants/adminMenu";
import { ArticleBreadcrumb } from "@/components/Breadcrumb";

export default async function CreateArticlePage() {
  const headersList = await headers();
  const pathname = headersList.get("x-current-path");

  const profile = await getProfile();
  if (!profile) redirect("/");
  return (
    <>
      <StaticHeader profile={profile} />
      <main className="relative flex w-full h-full">
        <div className="w-[calc(48px_+_1px)]">
          <MobileMenu pathname={pathname ?? null} />
        </div>
        <ArticleBreadcrumb />
        <div className="w-full max-w-[1440px] mx-auto flex justify-center items-center">
          <CreateArticleForm profileId={profile.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}

const MobileMenu = ({ pathname }: { pathname: string | null }) => (
  <nav className="z-10 w-[calc(48px_+_1px)] absolute top-0 bottom-0 bg-neutral-950 border-r border-neutral-800 hover:w-72 transition-width duration-200">
    <ul className="sticky top-0 flex flex-col p-1 gap-1">
      {MENU_ITEMS.map((item) => (
        <li key={item.key} className="group">
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-4 rounded-sm whitespace-nowrap overflow-hidden border border-transparent outline-none transition-outline duration-300 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-theme-color",
              pathname && pathname === item.href
                ? "[&_svg]:stroke-neutral-100 [&_span]:text-neutral-100 border-theme-color bg-theme-color-backdrop"
                : "hover:bg-neutral-800 hover:border-neutral-700"
            )}
          >
            {item.icon({
              className:
                "size-10 shrink-0 p-2 stroke-neutral-500 group-hover:stroke-neutral-100",
            })}
            <span className="text-sm text-neutral-500 group-hover:text-neutral-100">
              {item.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
