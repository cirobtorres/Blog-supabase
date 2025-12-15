import { getCountFiles, getFiles } from "../../../services/media.server";
import MediaPagination from "../../../components/Media/MediaPagination";
import { ArticleBreadcrumb } from "../../../components/Breadcrumb";
import MediaHeader from "../../../components/Media/MediaHeader";
import MediaSorter from "../../../components/Media/MediaSorter";
import PreviewCard from "../../../components/Media/PreviewCards";

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
      <MediaHeader />
      <MediaSorter
        // medias={medias}
        totalFiles={totalFiles}
      />
      {medias.length > 0 && (
        <ul className="grid grid-cols-1 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2">
          {medias.map((media) => (
            <PreviewCard key={media.id} data={media} />
          ))}
        </ul>
      )}
      <MediaPagination currentPage={page} totalPages={totalPages} />
    </>
  );
}
