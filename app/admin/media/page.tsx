import { ArticleBreadcrumb } from "../../../components/Breadcrumb";
import MediaHeader from "@/components/Media/MediaHeader";
import MediaSorter from "@/components/Media/MediaSorter";
import MediaList from "@/components/Media/MediaList";
import { getFiles } from "@/services/media";
import MediaPagination from "@/components/Media/MediaPagination";

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
      <div className="w-full flex flex-col justify-center gap-4">
        <MediaHeader />
        <MediaSorter />
        <MediaList images={images} />
        <MediaPagination />
      </div>
    </>
  );
}
