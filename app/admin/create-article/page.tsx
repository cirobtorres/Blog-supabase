import { redirect } from "next/navigation";
import { getProfile } from "../../../services/user";
import { CreateArticleForm } from "../../../components/Forms/CreateArticleForn";
import { ArticleBreadcrumb } from "@/components/Breadcrumb";

export default async function CreateArticlePage() {
  const profile = await getProfile();
  if (!profile) redirect("/");

  return (
    <>
      <ArticleBreadcrumb className="mx-4" />
      <div className="w-full flex justify-center items-center">
        <CreateArticleForm profileId={profile.id} />
      </div>
    </>
  );
}
