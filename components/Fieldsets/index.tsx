import { labelId, inputId } from "@/utils/strings";
import {
  TipTapTextEditor,
  TipTapCodeEditor,
  TipTapQuoteEditor,
} from "./ArticleEditor";
import { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { cn } from "@/utils/classnames";

export const DeprecatingFloatingInput = ({
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
      className={
        "relative mt-2 rounded group " +
        "transition-all duration-300 " +
        "border border-neutral-700 " +
        "bg-neutral-800 " +
        "focus-within:border-transparent focus-within:ring-2 focus-within:ring-neutral-100 "
      } // TODO: Remover esse mt-2 e ajustar todos os mt-0 nos <FloatingInput /> usados
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
          `h-full w-full text-sm font-medium text-neutral-400 ` +
          `px-2 pb-0.5 pt-4 ` +
          `appearance-none border-none placeholder:text-transparent placeholder:select-none bg-transparent ` +
          `transition-all duration-300 rounded outline-none ` +
          `focus:placeholder:text-neutral-500 ` +
          `peer `
        }
      />
      <label
        id={`floating-label-${id}`}
        data-testid={`floating-label-${id}`}
        htmlFor={`floating-input-${id}`}
        className={
          `absolute top-1/2 z-10 origin-[0] start-1 px-1 font-medium select-none ` +
          `-translate-y-5 scale-75 peer-focus:-translate-y-5 peer-focus:scale-75 text-neutral-100 peer-focus:text-neutral-100 ` + // text-theme-color peer-focus:text-theme-color
          `peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-white ` +
          `text-sm pointer-events-none bg-transparent bg-opacity-50 ` +
          `transform transition-top duration-100 `
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
  <fieldset
    className={
      "relative p-2 pt-6 pr-1 flex flex-col rounded-sm transition-all duration-300 border border-neutral-700 " +
      "hover:ring-2 hover:ring-theme-color hover:border-transparent " +
      "focus-within:ring-2 focus-within:ring-theme-color focus-within:border-transparent " +
      "bg-neutral-900 article-fieldset "
    }
  >
    <textarea
      id={getTitleFormDataValue}
      name={getTitleFormDataValue}
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
      htmlFor={getTitleFormDataValue}
      className={
        `absolute origin-left select-none pointer-events-none font-medium pl-3 text-neutral-400 ` + // text-theme-color
        `top-6 transform transition-top duration-100 ` +
        `left-0 peer-placeholder-shown:left-0 peer-placeholder-shown:translate-x-0 ` +
        `-translate-y-5 peer-focus:-translate-y-5 peer-placeholder-shown:translate-y-0 ` +
        `-translate-x-0 peer-focus:-translate-x-0 ` +
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
    className={
      "relative p-2 pt-6 pr-1 flex flex-col rounded-sm transition-all duration-300 border border-neutral-700 " +
      "hover:ring-2 hover:ring-theme-color hover:border-transparent " +
      "focus-within:ring-2 focus-within:ring-theme-color focus-within:border-transparent " +
      "bg-neutral-900 article-fieldset "
    }
  >
    <textarea
      id={getSubtitleFormDataValue}
      name={getSubtitleFormDataValue}
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
      htmlFor={getSubtitleFormDataValue}
      className={
        `absolute origin-left select-none pointer-events-none font-medium pl-3 text-neutral-400 ` + // text-theme-color
        `top-6 transform transition-top duration-100 ` +
        `left-0 peer-placeholder-shown:left-0 peer-placeholder-shown:translate-x-0 ` +
        `-translate-y-5 peer-focus:-translate-y-5 peer-placeholder-shown:translate-y-0 ` +
        `-translate-x-0 peer-focus:-translate-x-0 ` +
        `scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100 ` // peer-placeholder-shown:text-neutral-400
      }
    >
      Subtítulo do Artigo
    </label>
  </fieldset>
);

export const EditorFieldset = ({
  id,
  value,
  setVal,
  defaultValue,
}: {
  id: string;
  value: string;
  setVal: (data: any) => void;
  defaultValue?: string;
}) => (
  <fieldset className="h-full flex flex-col p-1">
    <TipTapTextEditor
      id={inputId("-body-" + id)} // input-body-text-1,2,3,4,...,n
      setVal={setVal}
      defaultValue={value}
    />
  </fieldset>
);

export const CodeFieldset = ({
  id,
  filename,
  code,
  language,
  setFilename,
  setCode,
  setLanguage,
}: {
  id: string;
  filename: string;
  code: string;
  language: string;
  setFilename: (data: string) => void;
  setCode: (data: string) => void;
  setLanguage: (data: string) => void;
}) => (
  <fieldset className="h-full flex flex-col gap-1 p-1 [&_fieldset]:mt-0">
    <DeprecatingFloatingInput
      id={"-filename-" + id} // input-filename-1,2,3,4,...,n
      label="Caminho do Arquivo"
      placeholder="path/to/my/file.py"
      value={filename}
      setValue={(e) => setFilename(e.target.value)}
    />
    <TipTapCodeEditor
      id={inputId("-codebody-" + id)} // input-codebody-1,2,3,4,...,n
      defaultCode={code}
      defaultlanguage={language}
      setVal={setCode}
      setLanguage={setLanguage}
      autoFocus
    />
  </fieldset>
);

export const QuoteFieldset = ({
  id,
  author,
  setAuthor,
  quote,
  setQuote,
}: {
  id: string;
  author: string;
  setAuthor: (data: string) => void;
  quote: string;
  setQuote: (data: string) => void;
}) => (
  <fieldset className="h-full flex flex-col gap-1 p-1 [&_fieldset]:mt-0">
    <DeprecatingFloatingInput
      id={"-author-" + id} // input-author-1,2,3,4,...,n
      label="Autor da citação"
      placeholder="Arthur Schopenhauer"
      value={author}
      setValue={(e) => setAuthor(e.target.value)}
    />
    <TipTapQuoteEditor
      id={inputId("-quote-" + id)} // input-quote-text-1,2,3,4,...,n
      setVal={setQuote}
      defaultValue={quote}
    />
  </fieldset>
);

export const getDisplayNameFormDataValue = inputId("Display Name");
export const getEmailFormDataValue = inputId("E-mail");
export const getPasswordFormDataValue = inputId("Password");
export const getTitleFormDataValue = inputId("Title");
export const getSubtitleFormDataValue = inputId("Subtitle");

export const FloatingFieldset = ({
  children,
  className,
  ...props
}: React.FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <fieldset
      {...props}
      className={cn(
        "relative rounded group w-full " +
          "transition-all duration-300 " +
          "has-disabled:[&_label]:text-neutral-700 " +
          "bg-neutral-800 has-disabled:border-neutral-800 has-disabled:bg-neutral-900 " +
          "border border-neutral-700 focus-within:border-transparent " +
          "focus-within:ring-2 focus-within:ring-neutral-100 ",
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
      "h-full w-full px-2 pt-4 pb-0.5 text-sm font-medium rounded peer " +
        "transition-all duration-300 " +
        "appearance-none border-none outline-none " +
        "placeholder:text-transparent placeholder:select-none " +
        "text-neutral-400 bg-transparent " +
        "focus:placeholder:text-neutral-500 ",
      className
    )}
  />
);

export const FloatingLabel = ({
  htmlFor,
  label,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  htmlFor: string;
  label: string;
  className?: string;
}) => (
  <label
    htmlFor={htmlFor}
    {...props}
    className={cn(
      `absolute top-1/2 z-10 origin-[0] start-1 px-1 font-medium select-none ` +
        `-translate-y-5 scale-75 peer-focus:-translate-y-5 peer-focus:scale-75 text-neutral-100 peer-focus:text-neutral-100 ` + // text-theme-color peer-focus:text-theme-color
        `peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-white ` +
        `text-sm pointer-events-none bg-transparent bg-opacity-50 ` +
        `transform transition-top duration-100 `,
      className
    )}
  >
    {label}
  </label>
);

type ControlledFloatingInputProps = {
  id: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type UncontrolledFloatingInputProps = {
  id: string;
  placeholder?: string;
  className?: string;
  value?: undefined;
  onChange?: undefined;
  defaultValue?: string;
};

type FloatingInputProps =
  | ControlledFloatingInputProps
  | UncontrolledFloatingInputProps;
