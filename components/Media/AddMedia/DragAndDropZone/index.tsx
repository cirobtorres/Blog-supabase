import { PlusIcon } from "../../../../components/Icons";
import { focusVisibleWhiteRing } from "../../../../styles/classNames";
import { cn } from "../../../../utils/classnames";
import React from "react";

export const DragAndDropZone = ({ onFilesSelected }: DragAndDropZoneProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // DRAG
  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  // INPUT
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    onFilesSelected(files);
  };

  // BUTTON
  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="p-8">
      <form
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "h-72 rounded border-dashed outline-none transition-all duration-300 border border-neutral-700 bg-neutral-950",
          isDragging ? "ring-2 ring-theme-color bg-theme-color-backdrop" : ""
        )}
      >
        <label className="h-full relative flex flex-col gap-4 justify-center items-center">
          <input
            ref={inputRef}
            type="file"
            name="files"
            multiple
            aria-label="Arraste e solte os arquivos aqui"
            tabIndex={-1}
            onChange={handleInputChange}
            className="cursor-pointer absolute inset-0 outline-none opacity-0"
          />
          <PlusIcon className="rounded-full p-1 stroke-2 stroke-neutral-950 bg-theme-color" />
          <span className="font-bold text-neutral-500">
            Arraste e solte aqui
          </span>
          <button
            type="button"
            onClick={handleButtonClick}
            className={cn(
              "w-fit cursor-pointer flex justify-center items-center gap-2 rounded px-2 py-1 text-sm border duration-300 outline-none text-neutral-100 border-theme-color bg-theme-color-light",
              focusVisibleWhiteRing
            )}
          >
            Buscar arquivos
          </button>
        </label>
      </form>
    </div>
  );
};
