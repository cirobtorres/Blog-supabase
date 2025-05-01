"use client";

import { ConfirmFormButton } from "@/components/Buttons";
import {
  EditorFieldset,
  getEditorFormDataValue,
  getTitleFormDataValue,
  TitleFieldset,
} from "@/components/Fieldsets";
import { ReturnToHome } from "@/components/ReturnToHome";
import { putArticle } from "@/services/article";
import { useActionState, useState } from "react";

export const EditArticleForm = ({
  id,
  title,
  body,
}: {
  id: string;
  title: string;
  body: string;
}) => {
  const [htmlTitle, setHtmlTitle] = useState("");
  const [htmlBody, setHtmlBody] = useState("");

  const [state, action] = useActionState(
    () => {
      const formData = new FormData();

      const contentHTMLTitle = htmlTitle.replace(/<p>(\s|&nbsp;)*<\/p>/g, ""); // Remove empty <p></p>
      const contentHTMLBody = htmlBody.replace(/<p>(\s|&nbsp;)*<\/p>/g, ""); // Remove empty <p></p>

      formData.set(getTitleFormDataValue, contentHTMLTitle);
      formData.set(getEditorFormDataValue, contentHTMLBody);

      return putArticle(id, { success: null, error: null }, formData);
    },
    {
      success: null,
      error: null,
    }
  );

  return (
    <main className="max-w-7xl min-h-screen mx-auto flex justify-center items-center">
      <div className="max-w-xl w-full p-4">
        <ReturnToHome />
        <form action={action} className="flex flex-col gap-2">
          <TitleFieldset setVal={setHtmlTitle} defaultValue={title} />
          <EditorFieldset setVal={setHtmlBody} defaultValue={body} />
          <ConfirmFormButton label="Create" />
        </form>
        {state.error && <p>Error: {state.error}</p>}
        {state.success && <p>Success: {state.success}</p>}
      </div>
    </main>
  );
};
