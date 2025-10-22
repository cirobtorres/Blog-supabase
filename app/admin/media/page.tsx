import { ArticleBreadcrumb } from "../../../components/Breadcrumb";
import { getFiles } from "@/services/media.server";
import Media from "@/components/Media";

export default async function MediaPage() {
  const bucket = "articles";
  const folder = ""; // Ex.: images/
  const currPage = 1;
  const limit = 12;
  const offset = (currPage - 1) * limit;
  const sortBy = {
    column: "created_at",
    order: "asc",
  };

  const images = await getFiles({
    bucket,
    folder,
    options: { limit, offset, sortBy },
  });

  return (
    <>
      <ArticleBreadcrumb />
      <Media images={images} />
    </>
  );
}
