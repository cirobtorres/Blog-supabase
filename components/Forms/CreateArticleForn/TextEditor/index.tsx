"use client";

import { useState } from "react";
import { EditorFieldset } from "@/components/Fieldsets";
import BlockEditorWrapper from "../utils";

const TextEditor = (props: {
  id: string;
  onRemove: (id: string) => void;
  moveToNext: any;
}) => {
  const [htmlBody, setHtmlBody] = useState("");

  return (
    <BlockEditorWrapper {...props}>
      <EditorFieldset setVal={setHtmlBody} />
    </BlockEditorWrapper>
  );
};

export default TextEditor;
