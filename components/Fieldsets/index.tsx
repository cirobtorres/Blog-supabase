import { labelId, slugify } from "@/utils/strings";
import { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { cn } from "../../utils/classnames";
import {
  focusVisibleWhiteRing,
  focusWithinWhiteRing,
  hoverWhiteRing,
} from "../../styles/classNames";
import { ClosedEyeIcon, EyeIcon } from "../Icons";

export const TitleFieldset = ({
  value,
  setVal,
}: {
  value?: string;
  setVal: Dispatch<SetStateAction<string>>;
}) => (
  <fieldset
    className={cn(
      "relative p-2 pt-6 pr-1 flex flex-col rounded-sm transition-all duration-300 border border-neutral-700 bg-neutral-900 article-fieldset-scrollbar",
      hoverWhiteRing,
      focusWithinWhiteRing
    )}
  >
    <textarea
      id={`input-${slugify("title")}`}
      name={`input-${slugify("title")}`}
      autoFocus
      value={value}
      rows={2}
      maxLength={128}
      spellCheck={false}
      onChange={(e) => setVal(e.target.value)}
      placeholder=""
      className={
        `resize-none rounded transition-all outline-none border-none bg-none ` +
        `peer `
      }
    />
    <label
      id={labelId("Title")}
      htmlFor={`input-${slugify("title")}`}
      className={
        `absolute origin-left select-none pointer-events-none font-medium pl-3 text-neutral-400 ` + // text-theme-color
        `top-6 transform transition-top duration-100 ` +
        `left-0 peer-placeholder-shown:left-0 peer-placeholder-shown:translate-x-0 ` +
        `-translate-y-5 peer-focus:-translate-y-5 peer-placeholder-shown:translate-y-0 ` +
        `translate-x-0 peer-focus:translate-x-0 ` +
        `scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100 ` // peer-placeholder-shown:text-neutral-400
      }
    >
      Título do Artigo
    </label>
  </fieldset>
);

export const SubtitleFieldset = ({
  value,
  setVal,
}: {
  value?: string;
  setVal: Dispatch<SetStateAction<string>>;
}) => (
  <fieldset
    className={cn(
      "relative p-2 pt-6 pr-1 flex flex-col rounded-sm transition-all duration-300 border border-neutral-700 bg-neutral-900 article-fieldset-scrollbar",
      hoverWhiteRing,
      focusWithinWhiteRing
    )}
  >
    <textarea
      id={`input-${slugify("subtitle")}`}
      name={`input-${slugify("subtitle")}`}
      value={value}
      rows={2}
      maxLength={256}
      spellCheck={false}
      onChange={(e) => setVal(e.target.value)}
      placeholder=""
      className={
        `resize-none rounded transition-all outline-none border-none bg-none ` +
        `peer `
      }
    />
    <label
      id={labelId("Subtitle")}
      htmlFor={`input-${slugify("subtitle")}`}
      className={
        `absolute origin-left select-none pointer-events-none font-medium pl-3 text-neutral-400 ` + // text-theme-color
        `top-6 transform transition-top duration-100 ` +
        `left-0 peer-placeholder-shown:left-0 peer-placeholder-shown:translate-x-0 ` +
        `-translate-y-5 peer-focus:-translate-y-5 peer-placeholder-shown:translate-y-0 ` +
        `translate-x-0 peer-focus:translate-x-0 ` +
        `scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100 ` // peer-placeholder-shown:text-neutral-400
      }
    >
      Subtítulo do Artigo
    </label>
  </fieldset>
);

export const FloatingFieldset = ({
  children,
  className,
  error,
  ...props
}: React.FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  children: React.ReactNode;
  className?: string;
  error?: boolean;
}) => {
  return (
    <fieldset
      {...props}
      className={cn(
        "relative w-full transition-all duration-300 rounded-xs has-disabled:cursor-not-allowed has-disabled:[&_label]:text-neutral-700 bg-neutral-900 has-disabled:border-neutral-800 has-disabled:bg-neutral-900 border border-neutral-700 group has-[textarea]:p-1",
        focusWithinWhiteRing,
        error && "border-red-500 has-disabled:border-red-900",
        className
      )}
    >
      {children}
    </fieldset>
  );
};

export const FloatingInput = ({
  id,
  value,
  onChange,
  placeholder = " ",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & FloatingInputProps) => (
  <input
    id={id}
    name={id}
    type="text"
    autoComplete="off"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    {...props}
    className={cn(
      "h-full w-full px-2 pt-[18px] pb-1 text-sm font-medium rounded peer transition-all duration-300 appearance-none border-none outline-none placeholder:text-transparent placeholder:select-none text-neutral-400 bg-transparent focus:placeholder:text-neutral-500 disabled:cursor-not-allowed ",
      className
    )}
  />
);

export const FloatingTextArea = ({
  id,
  value,
  onChange,
  placeholder = " ",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLTextAreaElement> & FloatingInputProps) => (
  <textarea
    id={id}
    name={id}
    type="text"
    rows={3}
    autoComplete="off"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    {...props}
    className={cn(
      "w-full h-full p-2 text-sm font-medium rounded peer transition-all duration-300 appearance-none border-none outline-none placeholder:select-none text-neutral-400 bg-transparent placeholder:text-neutral-500 disabled:cursor-not-allowed resize-none floating-textarea-scrollbar",
      className
    )}
  />
);

export const FloatingLabel = ({
  htmlFor,
  label,
  error,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  htmlFor: string;
  label: string;
  error?: boolean;
  className?: string;
}) => (
  <label
    htmlFor={htmlFor}
    {...props}
    className={cn(
      "absolute origin-left top-1/2 z-10 start-1 px-1 font-medium select-none text-sm pointer-events-none bg-transparent bg-opacity-50 transform transition-top duration-100 -translate-y-[18px] scale-75 peer-focus:-translate-y-[18px] peer-focus:scale-75 text-neutral-100 peer-focus:text-neutral-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-white",
      className,
      error &&
        "text-red-500 peer-focus:text-red-500 peer-placeholder-shown:text-red-500"
    )}
  >
    {label}
  </label>
);

export const FloatingPassTypeBtn = ({
  state,
  setState,
}: {
  state: "password" | "text";
  setState: (value: SetStateAction<"text" | "password">) => void;
}) => (
  <button
    type="button"
    onClick={() => {
      setState((state) => {
        if (state === "password") return "text";
        else return "password";
      });
    }}
    className={cn(
      "cursor-pointer absolute top-1/2 -translate-y-1/2 right-2 p-0.5 transition-shadow duration-300 rounded-xs",
      focusVisibleWhiteRing
    )}
  >
    {state !== "password" ? (
      <EyeIcon className="size-5 stroke-neutral-500" />
    ) : (
      <ClosedEyeIcon className="size-5 stroke-neutral-500" />
    )}
  </button>
);
