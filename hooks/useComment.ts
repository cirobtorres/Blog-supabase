import { useContext } from "react";
import { CommentContext } from "../providers/CommentProvider";

export function useComment() {
  return useContext(CommentContext);
}
