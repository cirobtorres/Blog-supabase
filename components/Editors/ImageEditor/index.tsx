"use client";

import { ActionDispatch } from "react";
import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "../../Fieldsets";
import { focusVisibleWhiteRing } from "../../../styles/classNames";
import { cn } from "../../../utils/classnames";
import { LinkIcon, DownloadIcon, TrashBinIcon, UploadIcon } from "../../Icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import NextImage from "next/image";
import { comercialDate } from "../../../utils/dates";
import {
  getImageDimensionsByFile,
  imageToDownload,
} from "../../../utils/media";

export const ImageDataInfo = ({ imageData }: { imageData: ImageState }) => (
  <div
    className={
      `relative grid grid-cols-[repeat(2,minmax(0,1fr))] gap-1 p-2 bg-neutral-900 ` +
      `after:absolute after:h-[1px] after:left-0 after:right-0 after:bottom-0 after:bg-neutral-700 `
    }
  >
    <div className="[&_*]:text-xs">
      <p className="text-neutral-500">Tamanho</p>
      <p className="text-neutral-300 font-[600]">
        {imageData.size
          ? `${(imageData.size / (1024 * 1024)).toFixed(3)}KB`
          : "--"}
      </p>
    </div>
    <div className="[&_*]:text-xs">
      <p className="text-neutral-500">Data</p>
      <p className="text-neutral-300 font-[600]">{imageData.date}</p>
    </div>
    <div className="[&_*]:text-xs">
      <p className="text-neutral-500">Dimensões</p>
      <p className="text-neutral-300 font-[600]">
        {imageData.width && imageData.height
          ? `${imageData.width}x${imageData.height}`
          : "--"}
      </p>
    </div>
    <div className="[&_*]:text-xs">
      <p className="text-neutral-500">Extensão</p>
      <p className="text-neutral-300 font-[600]">{imageData.type}</p>
    </div>
  </div>
);

export const ImageEditorButtonList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <ul
    className={cn(
      "z-10 absolute right-2 top-2 ml-auto mr-0 w-fit flex justify-center items-center rounded border border-neutral-700 bg-neutral-900",
      "[&_li_*]:outline-none [&_li]:first:[&_button]:rounded-l [&_li]:last:[&_button]:rounded-r [&_li]:not-last:[&_button]:border-r [&_li]:not-last:[&_button]:border-neutral-700",
      className
    )}
  >
    {children}
  </ul>
);

export const ImageEditorButtonLi = ({
  children,
  tooltip,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & {
  children: React.ReactNode;
  tooltip?: string;
}) => {
  const listElement = <li {...props}>{children}</li>;

  return tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>{listElement}</TooltipTrigger>
      <TooltipContent sideOffset={4}>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    listElement
  );
};

export const ImageEditorButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    {...props}
    className={cn(
      "relative size-10 flex items-center justify-center cursor-pointer transition-all duration-300 disabled:cursor-auto disabled:text-neutral-600 disabled:bg-neutral-800 focus-visible:z-10 hover:bg-neutral-800 active:bg-neutral-900 focus-visible:bg-neutral-800",
      focusVisibleWhiteRing,
      className
    )}
  >
    {children}
  </button>
);

export const DropPlaceholder = ({ text }: { text?: string }) => (
  <div
    className={
      `absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ` +
      `flex justify-center items-center ` +
      `w-96 h-60 mx-auto rounded-xl pointer-events-none ` +
      `border-2 border-dashed border-neutral-800 ` +
      `max-lg:w-60 max-lg:h-48 `
    }
  >
    <p className="text-3xl max-lg:text-xl text-neutral-500 ">
      {text ?? "Arraste e solte"}
    </p>
  </div>
);

interface DragAndDropZoneProps {
  imageData: ImageState;
  inputRef: React.Ref<HTMLInputElement> | null;
  dispatch: ActionDispatch<[action: ImageStateAction]>;
  setFilename: (filename: string) => void;
  setAlt: (alt: string) => void;
  setCaption: (caption: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const DragAndDropZone = ({
  imageData,
  inputRef,
  dispatch,
  setFilename,
  setAlt,
  setCaption,
  onFileChange,
}: DragAndDropZoneProps) => {
  const openFilePicker = () => {
    if (inputRef && typeof inputRef !== "function" && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (isNotImageFile(file)) {
      return;
    }

    const url = URL.createObjectURL(file);
    const { width, height } = await getImageDimensionsByFile(file);
    const today = new Date();

    setFilename(file.name);

    dispatch({
      type: "SET_ALL",
      payload: {
        preview: url,
        filename: file.name,
        file,
        size: file.size,
        type: file.type.replace("image/", ""),
        width,
        height,
        date: comercialDate(today),
      },
    });
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      className={
        `relative w-[70%] min-h-96 h-full shrink-0 ` +
        `after:absolute after:right-0 after:w-[1px] after:top-0 after:bottom-0 after:bg-neutral-700 `
      }
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <ImageEditorButtonList>
        <ImageEditorButtonLi tooltip="Limpar">
          <ImageEditorButton
            onClick={() => {
              dispatch({ type: "RESET" });
              setFilename("");
              setAlt("");
              setCaption("");
            }}
          >
            <TrashBinIcon className="size-4" />
          </ImageEditorButton>
        </ImageEditorButtonLi>
        <ImageEditorButtonLi tooltip="Copiar link">
          <ImageEditorButton
            disabled={!imageData?.preview}
            onClick={() => {
              if (imageData?.preview)
                navigator.clipboard.writeText(imageData.preview);
            }}
          >
            <LinkIcon className="size-6 p-1" />
          </ImageEditorButton>
        </ImageEditorButtonLi>
        <ImageEditorButtonLi tooltip="Copiar link">
          <ImageEditorButton
            disabled={!imageData?.preview}
            onClick={() => {
              if (imageData?.preview) imageToDownload(imageData);
            }}
          >
            <DownloadIcon className="size-4" />
          </ImageEditorButton>
        </ImageEditorButtonLi>
        <ImageEditorButtonLi tooltip="Copiar link">
          <ImageEditorButton onClick={openFilePicker}>
            <UploadIcon className="size-[15px]" />
          </ImageEditorButton>
        </ImageEditorButtonLi>
      </ImageEditorButtonList>
      {imageData.preview ? (
        <NextImage
          src={imageData.preview}
          alt="preview"
          fill
          className="absolute object-cover"
        />
      ) : (
        <DropPlaceholder />
      )}
    </div>
  );
};

interface ImageDataInputProps {
  filename: string;
  caption: string;
  alt: string;
  setFilename: (filename: string) => void;
  setAlt: (alt: string) => void;
  setCaption: (caption: string) => void;
}

const ImageDataInput = ({
  filename,
  alt,
  caption,
  setFilename,
  setCaption,
  setAlt,
}: ImageDataInputProps) => (
  <div className="flex flex-col gap-2 p-2">
    <FloatingFieldset>
      <FloatingInput
        id={`input-filename-${filename}`}
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
      />
      <FloatingLabel
        htmlFor={`input-filename-${filename}`}
        label="Nome da imagem"
      />
    </FloatingFieldset>
    <FloatingFieldset>
      <FloatingInput
        id={`input-alt-${alt}`}
        value={alt}
        placeholder=""
        onChange={(e) => setAlt(e.target.value)}
      />
      <FloatingLabel
        htmlFor={`input-filename-${filename}`}
        label="Nome Alternativo"
      />
    </FloatingFieldset>
    <small className="text-[11px]">
      <p className="text-neutral-500 px-1 mt-1">
        Texto exibido no lugar da imagem caso o recurso esteja indisponível.
      </p>
    </small>
    <FloatingFieldset>
      <FloatingInput
        id={`input-caption-${caption}`}
        value={caption}
        placeholder=""
        onChange={(e) => setCaption(e.target.value)}
      />
      <FloatingLabel htmlFor={`input-caption-${caption}`} label="Rodapé" />
    </FloatingFieldset>
  </div>
);

export const InfoZone = ({
  imageData,
  filename,
  alt,
  caption,
  setFilename,
  setCaption,
  setAlt,
}: {
  imageData: ImageState;
  filename: string;
  caption: string;
  alt: string;
  setFilename: (filename: string) => void;
  setAlt: (alt: string) => void;
  setCaption: (caption: string) => void;
}) => (
  <div className="w-[30%] h-full shrink-0 flex flex-col">
    <ImageDataInfo imageData={imageData} />
    <ImageDataInput
      filename={filename}
      alt={alt}
      caption={caption}
      setAlt={setAlt}
      setFilename={setFilename}
      setCaption={setCaption}
    />
  </div>
);

export const isNotImageFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    console.warn("Invalid file:", file.type);
    return true;
  }
  return false;
};
