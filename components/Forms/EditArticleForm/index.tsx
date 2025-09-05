import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { putArticle } from "@/services/article";
import { convertToLargeDate } from "@/utils/dates";
import {
  ConfirmFormButton,
  ReturnToHome,
  SaveFormButton,
} from "@/components/Buttons";
import {
  EditorFieldset,
  getEditorFormDataValue,
  getSubtitleFormDataValue,
  getTitleFormDataValue,
  SubtitleFieldset,
  TitleFieldset,
} from "@/components/Fieldsets";

export const EditArticleForm = ({
  id,
  title,
  sub_title,
  body,
}: {
  id: string;
  title: string;
  sub_title: string | null;
  body: string;
}) => {
  const [htmlTitle, setHtmlTitle] = useState(title);
  const [htmlDescription, setHtmlDescription] = useState(sub_title || "");
  const [htmlBody, setHtmlBody] = useState(body);
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async () => {
      const formData = new FormData();

      formData.set(getTitleFormDataValue, htmlTitle);
      formData.set(getSubtitleFormDataValue, htmlDescription);
      formData.set(getEditorFormDataValue, htmlBody);

      const result = await putArticle(
        id,
        { ok: false, success: null, error: null },
        formData
      );

      if (result.ok)
        toast.success("Artigo atualizado", {
          description: convertToLargeDate(new Date()),
          action: {
            label: "Visitar artigo",
            onClick: () => router.push(`/articles/${id}`),
          },
        });

      return result;
    },
    {
      ok: false,
      success: null,
      error: null,
    }
  );

  return (
    <main className="pt-10 max-w-7xl mx-auto flex justify-center items-center">
      <div className="w-full mx-4">
        <ReturnToHome />
        <form
          action={action}
          className="grid gap-2 grid-cols-1 md:grid-cols-[1fr_300px]"
        >
          <div className="flex flex-col gap-2">
            <TitleFieldset value={htmlTitle} setVal={setHtmlTitle} />
            <SubtitleFieldset
              value={htmlDescription}
              setVal={setHtmlDescription}
            />
            <EditorFieldset setVal={setHtmlBody} defaultValue={htmlBody} />
          </div>
          <div className="flex flex-col gap-1">
            <ConfirmFormButton label="Publicar" isPending={isPending} />
            <SaveFormButton label="Salvar" />
          </div>
        </form>
        {state.error && <p>Error: {state.error}</p>}
        {/* {state.success && <p>Success: {state.success}</p>} */}
      </div>
    </main>
  );
};

export default EditArticleForm;
