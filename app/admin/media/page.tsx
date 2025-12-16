import { getCountFiles, getFiles } from "../../../services/media.server";
import MediaPagination from "../../../components/Media/Pagination";
import { ArticleBreadcrumb } from "../../../components/Breadcrumb";
import Media from "../../../components/Media";

interface SearchParamsProps {
  bucket: string;
  folder: string;
  page: string;
  limit: string;
  sortColumn: "created_at";
  sortOrder: "desc";
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParamsProps>;
}) {
  const params = await searchParams;
  const bucket = params?.bucket ?? "articles";
  const folder = params?.folder ?? "";
  const page = Number(params?.page ?? "1");
  const limit = Number(params?.limit ?? "16");
  const offset = (page - 1) * limit;
  const sortColumn = params?.sortColumn ?? "created_at";
  const sortOrder = params?.sortOrder ?? "desc";
  const sortBy = { column: sortColumn, order: sortOrder };
  const totalFiles = await getCountFiles({ bucket, folder });
  const totalPages = Math.ceil(totalFiles / limit);
  const medias = await getFiles({
    bucket,
    folder,
    options: { limit, offset, sortBy },
  });

  return (
    <>
      <ArticleBreadcrumb />
      <Media medias={medias} totalFiles={totalFiles} />
      <MediaPagination currentPage={page} totalPages={totalPages} />
    </>
  );
}
