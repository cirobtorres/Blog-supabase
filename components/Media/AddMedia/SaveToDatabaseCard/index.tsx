import {
  ImageEditorButton,
  ImageEditorButtonLi,
  ImageEditorButtonList,
} from "../../../Editors/ImageEditor";
import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "../../../Fieldsets";
import { HazardBorder } from "../../../HazardBorder";
import { TrashBinIcon } from "../../../Icons";
import { cn } from "../../../../utils/classnames";
import { formatType } from "../../../../utils/strings";
import Image from "next/image";
import React from "react";

export const SaveToDatabaseCard = React.memo(
  ({ data, index, updateFiles, removeFiles }: FilePreviewCardProps) => {
    const { file, filename, caption, altText, blocked } = data;
    const isImage = file.type.startsWith("image/");
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
      if (!isImage) return;
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }, [file, isImage]);

    // useRenderCount("FilePreviewCard"); // DEBUG

    return (
      <div
        className={cn(
          "w-full h-full rounded grid grid-cols-[240px_1fr] border overflow-hidden",
          blocked ? "border-red-900 bg-red-950/50" : "border-neutral-700"
        )}
      >
        <article className="w-60 h-40 min-w-0 grid grid-rows-[1fr_minmax(0,calc(16px*3+16px+1px))] duration-300 overflow-hidden outline-none group">
          <div className="relative">
            <div
              className="absolute top-1 right-1 flex gap-2 group-focus-within:[&_button]:opacity-100"
              // É necessário "z-10" para o Tooltip funcionar
              // O Tooltip está alterando a cor no padding
            >
              <ImageEditorButtonList className="top-0 right-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                <ImageEditorButtonLi>
                  <ImageEditorButton
                    type="button"
                    onClick={() => removeFiles(file)}
                    className="size-9"
                  >
                    <TrashBinIcon className="size-4" />
                  </ImageEditorButton>
                </ImageEditorButtonLi>
              </ImageEditorButtonList>
            </div>
            <HazardBorder />
            <Image
              src={previewUrl ?? "/images/no-image-avaiable.png"}
              alt={file.name}
              fill
              sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="absolute object-contain"
            />
          </div>
          <div
            className={cn(
              "max-w-60 h-full px-3 py-2 border-t",
              blocked
                ? "border-red-900 bg-red-950/5"
                : "border-neutral-700 bg-neutral-900"
            )}
          >
            <p className="text-xs text-neutral-300 font-medium line-clamp-3">
              {file.name}
            </p>
          </div>
        </article>
        <div
          className={cn(
            "w-full flex flex-col gap-2 p-2 border-l",
            blocked ? "border-red-900" : "border-neutral-700"
          )}
        >
          <FloatingFieldset error={blocked}>
            <FloatingInput
              value={filename}
              disabled={blocked}
              id={`floating-filename-text-${file.name}-${index}`}
              placeholder="Escreva um subtítulo"
              onChange={(e) => updateFiles(index, { filename: e.target.value })}
            />
            <FloatingLabel
              htmlFor={`floating-filename-text-${file.name}-${index}`}
              label="Nome"
            />
          </FloatingFieldset>
          <FloatingFieldset error={blocked}>
            <FloatingInput
              value={caption}
              disabled={blocked}
              id={`floating-caption-text-${file.name}-${index}`}
              placeholder="Escreva uma legenda"
              onChange={(e) => updateFiles(index, { caption: e.target.value })}
            />
            <FloatingLabel
              htmlFor={`floating-caption-text-${file.name}-${index}`}
              label="Legenda"
            />
          </FloatingFieldset>
          <FloatingFieldset error={blocked}>
            <FloatingInput
              value={altText}
              disabled={blocked}
              id={`floating-alt-text-${file.name}-${index}`}
              placeholder="Escreva um texto alternativo"
              onChange={(e) => updateFiles(index, { altText: e.target.value })}
            />
            <FloatingLabel
              htmlFor={`floating-alt-text-${file.name}-${index}`}
              label="Alt"
            />
          </FloatingFieldset>
          <p className="text-neutral-500 text-xs">
            Alt é o texto apresentado caso a imagem não possa ser renderizada.
          </p>
          <div className="w-fit h-fit p-1.5 text-[10px] text-neutral-500 font-semibold rounded bg-neutral-800">
            <p>{formatType(file.type)}</p>
          </div>
        </div>
      </div>
    );
  }
);

SaveToDatabaseCard.displayName = "SaveToDatabaseCard";
