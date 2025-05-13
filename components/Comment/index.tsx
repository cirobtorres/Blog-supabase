"use client";

import { CommentProvider } from "@/providers/CommentProvider";
import { CommentEditor } from "./CommentEditor";

export const Comments = ({ profile }: { profile: Profile | null }) => {
  return (
    <CommentProvider>
      <section className="w-full max-w-screen-md mx-auto flex flex-col py-10 mb-20 px-4">
        <div className="mb-10">
          <h2 className="text-2xl text-center">x comentários</h2>
        </div>
        <CommentEditor
          profile={profile}
          onSubmit={() => new Promise((resolve) => console.log("Hello World"))}
        />
      </section>
    </CommentProvider>
  );
};
