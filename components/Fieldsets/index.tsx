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
  defaultValue,
  setVal,
}: {
  defaultValue?: string;
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
      <Tiptap
        id={getTitleFormDataValue}
        autoFocus
        setVal={setVal}
        typography="heading"
        defaultValue={defaultValue}
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
        height="[&_.tiptap.ProseMirror]:min-h-[calc(1.5rem_*_10)]"
      />
    </fieldset>
  );
};

export const getDisplayNameFormDataValue = inputId("Display Name");
export const getEmailFormDataValue = inputId("E-mail");
export const getPasswordFormDataValue = inputId("Password");
export const getTitleFormDataValue = inputId("Display Name");
export const getEditorFormDataValue = inputId("Body");
