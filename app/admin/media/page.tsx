import Image from "next/image";
import Link from "next/link";
import { getCountFiles, getFiles } from "../../../services/media.server";
import MediaPagination from "../../../components/Media/MediaPagination";
import PreviewCardButtons from "../../../components/Media/PreviewCardButtons";
import { ArticleBreadcrumb } from "../../../components/Breadcrumb";
import { HazardBorder } from "../../../components/HazardBorder";
import { formatType } from "../../../utils/strings";
import { cn } from "../../../utils/classnames";
import {
  focusVisibleWhiteRing,
  hoverWhiteRing,
} from "../../../styles/classNames";
import MediaHeader from "../../../components/Media/MediaHeader";
import MediaSorter from "@/components/Media/MediaSorter";

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
      <MediaSorter medias={medias} totalFiles={totalFiles} />
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

const PreviewCard = ({ data }: { data: SupabaseBucketMedia }) => {
  return (
    <Link
      href={data.url}
      target="_blank"
      className={cn(
        "cursor-pointer w-full h-72 grid grid-rows-[1fr_60px] transition-shadow duration-300 overflow-hidden rounded outline-none border border-neutral-700 group",
        hoverWhiteRing,
        focusVisibleWhiteRing
      )}
    >
      <div className="h-full relative">
        <PreviewCardButtons data={data} />
        <HazardBorder />
        <Image
          src={data.url}
          alt={data.name}
          fill
          sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="absolute object-contain"
        />
      </div>
      <div className="px-3 flex justify-between items-center border-t border-neutral-700 bg-neutral-900">
        <div className="flex flex-col text-left">
          <p className="text-xs text-neutral-300">{data.name}</p>
          <p className="text-xs text-neutral-500">
            {data.metadata.mimetype.split("/")[1]}
          </p>
        </div>
        <div className="w-fit h-fit px-2.5 py-1.5 text-xs text-neutral-500 font-semibold flex justify-center items-center rounded bg-neutral-800">
          <p>{formatType(data.metadata.mimetype)}</p>
        </div>
      </div>
    </Link>
  );
};
