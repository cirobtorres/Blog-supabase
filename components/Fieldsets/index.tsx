import { labelId, inputId } from "@/utils/strings";
import Tiptap from "../TipTap";
import { Dispatch, SetStateAction } from "react";

export const DisplayNameFieldset = ({
  placeholder,
}: {
  placeholder?: string;
}) => {
  return (
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
        className="p-1 bg-neutral-900"
      />
    </fieldset>
  );
};

export const EmailFieldset = ({ placeholder }: { placeholder?: string }) => {
  return (
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
        className="p-1 bg-neutral-900"
      />
    </fieldset>
  );
};

export const PasswordFieldset = ({ placeholder }: { placeholder?: string }) => {
  return (
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
        className="p-1 bg-neutral-900"
      />
    </fieldset>
  );
};

export const TitleFieldset = ({
  value,
  setVal,
}: {
  value?: string;
  setVal: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <fieldset className="flex flex-col">
      <label
        id={labelId("Title")}
        htmlFor={getTitleFormDataValue}
        className="py-1"
      >
        Title
      </label>
      <input
        id={getTitleFormDataValue}
        name={getTitleFormDataValue}
        type="text"
        autoComplete="new-password"
        autoFocus
        value={value}
        maxLength={128}
        onChange={(e) => setVal(e.target.value)}
        className="py-1 bg-neutral-900"
      />
    </fieldset>
  );
};

export const SubtitleFieldset = ({
  value,
  setVal,
}: {
  value?: string;
  setVal: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <fieldset className="flex flex-col">
      <label
        id={labelId("Subtitle")}
        htmlFor={getSubtitleFormDataValue}
        className="py-1"
      >
        Subtitle
      </label>
      <input
        id={getSubtitleFormDataValue}
        name={getSubtitleFormDataValue}
        type="text"
        autoComplete="new-password"
        value={value}
        maxLength={256}
        onChange={(e) => setVal(e.target.value)}
        className="py-1 bg-neutral-900"
      />
    </fieldset>
  );
};

export const EditorFieldset = ({
  setVal,
  defaultValue,
}: {
  setVal: Dispatch<SetStateAction<string>>;
  defaultValue?: string;
}) => {
  return (
    <fieldset className="flex flex-col">
      <label
        id={labelId("Body")}
        htmlFor={getEditorFormDataValue}
        className="py-1"
      >
        Body
      </label>
      <Tiptap
        id={getEditorFormDataValue}
        setVal={setVal}
        defaultValue={defaultValue}
      />
    </fieldset>
  );
};

export const getDisplayNameFormDataValue = inputId("Display Name");
export const getEmailFormDataValue = inputId("E-mail");
export const getPasswordFormDataValue = inputId("Password");
export const getTitleFormDataValue = inputId("Title");
export const getSubtitleFormDataValue = inputId("Subtitle");
export const getEditorFormDataValue = inputId("Body");
