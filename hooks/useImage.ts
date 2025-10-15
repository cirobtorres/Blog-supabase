import { useContext } from "react";
import { ImageContext } from "../providers/ImageProvider";

export function useImage() {
  return useContext(ImageContext);
}
