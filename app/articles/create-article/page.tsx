import { Editor } from "@/components/Editor";
import { Fieldset } from "@/components/Fieldset";

export default async function CreateArticlePage() {
  return (
    <main className="max-w-7xl min-h-screen mx-auto flex justify-center items-center bg-slate-900">
      <section className="max-w-xl w-full flex flex-col gap-2">
        <Fieldset label="Title" />
        <Editor label="Body" />
      </section>
    </main>
  );
}
