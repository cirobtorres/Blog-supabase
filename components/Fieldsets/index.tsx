import { labelId, inputId } from "@/utils/strings";
import { ArticleEditor } from "./ArticleEditor";
import { ChangeEventHandler, Dispatch, SetStateAction } from "react";

export const FloatingInput = ({
  id,
  label,
  placeholder = " ",
  value,
  setValue,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  setValue: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <fieldset
      id={`floating-fieldset-${id}`}
      className="relative mt-2 rounded border border-neutral-700 bg-neutral-800 group"
    >
      <input
        id={`floating-input-${id}`}
        type="text"
        autoComplete="off"
        name={`floating-input-${id}`}
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        className={
          `h-full w-full text-sm font-medium text-neutral-400` +
          `px-2 pb-0.5 pt-4 ` +
          `appearance-none border-none placeholder:text-transparent placeholder:select-none bg-transparent ` +
          `transition-all rounded outline-none ` +
          `focus:placeholder:text-[hsl(0,0%,10%)] focus-visible:ring-neutral-100 focus-visible:ring-[3px] ` +
          `peer `
        }
      />
      <label
        id={`floating-label-${id}`}
        data-testid={`floating-label-${id}`}
        htmlFor={`floating-input-${id}`}
        className={
          `absolute top-1/2 z-10 origin-[0] start-1 px-1 font-medium select-none` +
          ` -translate-y-5 scale-75 text-theme-color peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-theme-color` +
          ` peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-white` +
          ` text-sm pointer-events-none bg-transparent bg-opacity-50` +
          ` transform transition-top duration-100`
        }
      >
        {label}
      </label>
    </fieldset>
  );
};

export const DisplayNameFieldset = ({
  placeholder,
}: {
  placeholder?: string;
}) => (
  <fieldset className="flex flex-col">
    <label
      id={labelId("Display Name")}
      htmlFor={getDisplayNameFormDataValue}
      className="py-1"
    >
      Display Name
    </label>
    <input
      id={getDisplayNameFormDataValue}
      name={getDisplayNameFormDataValue}
      type="text"
      placeholder={placeholder || ""}
      className="p-1 transition-all rounded border border-neutral-700 bg-neutral-800 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
    />
  </fieldset>
);

export const EmailFieldset = ({ placeholder }: { placeholder?: string }) => (
  <fieldset className="flex flex-col">
    <label
      id={labelId("E-mail")}
      htmlFor={getEmailFormDataValue}
      className="py-1"
    >
      E-mail
    </label>
    <input
      id={getEmailFormDataValue}
      name={getEmailFormDataValue}
      type="email"
      placeholder={placeholder || ""}
      className="p-1 transition-all rounded border border-neutral-700 bg-neutral-800 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
    />
  </fieldset>
);

export const PasswordFieldset = ({ placeholder }: { placeholder?: string }) => (
  <fieldset className="flex flex-col">
    <label
      id={labelId("Password")}
      htmlFor={getPasswordFormDataValue}
      className="py-1"
    >
      Password
    </label>
    <input
      id={getPasswordFormDataValue}
      name={getPasswordFormDataValue}
      type="password"
      placeholder={placeholder || ""}
      className="p-1 transition-all rounded border border-neutral-700 bg-neutral-800 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
    />
  </fieldset>
);

export const TitleFieldset = ({
  value,
  setVal,
}: {
  value?: string;
  setVal: Dispatch<SetStateAction<string>>;
}) => (
  <fieldset className="flex flex-col">
    <label
      id={labelId("Title")}
      htmlFor={getTitleFormDataValue}
      className="py-1"
    >
      Title
    </label>
    <textarea
      id={getTitleFormDataValue}
      name={getTitleFormDataValue}
      autoFocus
      value={value}
      rows={2}
      maxLength={128}
      spellCheck={false}
      onChange={(e) => setVal(e.target.value)}
      className={
        `scrollbar p-2 resize-none rounded transition-all border border-neutral-700 bg-neutral-800` +
        ` focus-visible:ring-neutral-100 focus-visible:ring-[3px]`
      }
    />
  </fieldset>
);

export const SubtitleFieldset = ({
  value,
  setVal,
}: {
  value?: string;
  setVal: Dispatch<SetStateAction<string>>;
}) => (
  <fieldset className="flex flex-col">
    <label
      id={labelId("Subtitle")}
      htmlFor={getSubtitleFormDataValue}
      className="py-1"
    >
      Subtitle
    </label>
    <textarea
      id={getSubtitleFormDataValue}
      name={getSubtitleFormDataValue}
      value={value}
      rows={2}
      maxLength={256}
      spellCheck={false}
      onChange={(e) => setVal(e.target.value)}
      className={
        `scrollbar p-2 resize-none rounded transition-all border border-neutral-700 bg-neutral-800` +
        ` focus-visible:ring-neutral-100 focus-visible:ring-[3px]`
      }
    />
  </fieldset>
);

export const EditorFieldset = ({
  setVal,
  defaultValue,
}: {
  setVal: Dispatch<SetStateAction<string>>;
  defaultValue?: string;
}) => (
  <fieldset className="flex flex-col">
    <label
      id={labelId("Body")}
      htmlFor={getEditorFormDataValue}
      className="py-1"
    >
      Body
    </label>
    <ArticleEditor
      id={getEditorFormDataValue}
      setVal={setVal}
      defaultValue={defaultValue}
    />
  </fieldset>
);

export const getDisplayNameFormDataValue = inputId("Display Name");
export const getEmailFormDataValue = inputId("E-mail");
export const getPasswordFormDataValue = inputId("Password");
export const getTitleFormDataValue = inputId("Title");
export const getSubtitleFormDataValue = inputId("Subtitle");
export const getEditorFormDataValue = inputId("Body");
