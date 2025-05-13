import { CreateArticleForm } from "@/components/Forms";
import { StaticHeader } from "../../../components/Header";
import { redirect } from "next/navigation";
import { getProfile } from "@/services/user";

export default async function CreateArticlePage() {
  const profile = await getProfile();
  if (!profile) redirect("/");
  return (
    <>
      <StaticHeader profile={profile} />
      <CreateArticleForm profileId={profile.id} />
    </>
  );
}
