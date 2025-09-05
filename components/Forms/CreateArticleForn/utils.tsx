import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/utils/classnames";
import { DeleteEditor } from "@/components/Buttons/client";

const BlockEditorWrapper = ({
  children,
  id,
  onRemove,
  moveToNext,
}: {
  children: React.ReactNode;
  id: string;
  onRemove: (id: string) => void;
  moveToNext: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={
        `overflow-hidden rounded transition-ring duration-300 animate-pop group ` +
        `border border-neutral-700 ` +
        `hover:ring-3 hover:ring-neutral-100 ` +
        `focus-within:ring-3 focus-within:ring-neutral-100 `
      }
    >
      <EditorHeader
        id={id}
        label="Editor de Texto"
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        moveToNext={moveToNext}
        onRemove={() => onRemove(id)}
      />
      <div
        className={cn(
          "duration-300",
          isExpanded ? "h-[372px]" : "h-0 [&_*]:hidden"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const EditorHeader = ({
  id,
  label,
  isExpanded,
  setIsExpanded,
  moveToNext,
  onRemove,
}: {
  id: string;
  label: string;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  moveToNext: () => void;
  onRemove: () => void;
}) => {
  const dialogState = useState(false);
  const [isDialogOpen, _] = dialogState;

  return (
    <div
      className={`cursor-pointer w-full h-12 flex items-center justify-between px-4 py-2 transition-colors bg-neutral-800 `}
      onClick={() => {
        if (isDialogOpen) return;
        setIsExpanded(!isExpanded);
      }}
    >
      <ExpandButtons
        label={label}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        dialogState={dialogState}
      />
      <UtilsButtons
        id={id}
        moveToNext={moveToNext}
        onRemove={onRemove}
        dialogState={dialogState}
      />
    </div>
  );
};

const ExpandButtons = ({
  label,
  isExpanded,
  setIsExpanded,
  dialogState,
}: {
  label: string;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  dialogState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
  const [isDialogOpen, _] = dialogState;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => {
          if (isDialogOpen) return;
          setIsExpanded(!isExpanded);
        }}
        className={
          `p-1 rounded cursor-pointer border-none outline-none ` +
          `transition-all focus-visible:ring-3 focus-visible:ring-neutral-500 focus-visible:bg-neutral-800 `
          // `focus-visible:[&_*]:stroke-theme-color `
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "lucide lucide-chevron-down-icon lucide-chevron-down stroke-neutral-300 transition-all",
            isExpanded ? "rotate-180" : ""
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <p
        className="text-sm font-medium text-neutral-400" // transition-all group-focus-within:text-theme-color
      >
        {label}
      </p>
    </div>
  );
};

const UtilsButtons = ({
  id,
  moveToNext,
  onRemove,
  dialogState,
}: {
  id: string;
  moveToNext: (id: string) => void;
  onRemove: () => void;
  dialogState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => (
  <div className="flex items-center gap-4">
    <button
      type="button"
      className={
        `z-10 p-1 cursor-pointer rounded group/button ` +
        `transition-all ` + // hover:[&_*]:stroke-theme-color
        `border-none outline-none ` +
        `focus-visible:ring-[3px] focus-visible:ring-neutral-500 ` +
        `focus-visible:bg-neutral-800 ` // focus-visible:[&_*]:stroke-theme-color
      }
      onClick={(e) => {
        e.stopPropagation();
        moveToNext(id);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-down-icon lucide-arrow-down stroke-neutral-300"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </button>
    <DeleteEditor onRemove={onRemove} dialogState={dialogState} />
  </div>
);

export default BlockEditorWrapper;
