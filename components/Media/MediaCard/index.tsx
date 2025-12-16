"use client";

import NextImage from "next/image";
import MediaCardButtonList from "./MediaCardButtonList";
import { HazardBorder } from "../../HazardBorder";
import { formatType } from "../../../utils/strings";
import { Checkbox as PreviewCardCheckbox } from "../../ui/checkbox";
import { cn } from "../../../utils/classnames";
import {
  focusVisibleWhiteRing,
  hoverWhiteRing,
} from "../../../styles/classNames";
import Link from "next/link";

export default function MediaCard({
  data,
  options,
  isChecked,
  onCheck,
}: {
  data: SupabaseBucketMedia;
  options?: { linkClassname: string };
  isChecked?: boolean;
  onCheck?: (checked: boolean) => void;
}) {
  return (
    <div className="relative">
      <PreviewCardCheckbox
        className="absolute left-2 top-2 z-10"
        checked={isChecked}
        onCheckedChange={(checked) => {
          onCheck?.(checked === true);
        }}
      />
      <Link
        href={data.url}
        target="_blank"
        className={cn(
          "cursor-pointer w-full h-72 grid grid-rows-[1fr_60px] transition-[border,box-shadow] duration-300 overflow-hidden rounded outline-none border group",
          isChecked ? "border-theme-color" : "border-neutral-700",
          hoverWhiteRing,
          focusVisibleWhiteRing,
          options?.linkClassname
        )}
      >
        <div className="h-full relative">
          <MediaCardButtonList data={data} />
          <HazardBorder />
          <NextImage
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
    </div>
  );
}
