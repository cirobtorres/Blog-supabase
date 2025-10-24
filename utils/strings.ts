import he from "he";
import { BundledLanguage } from "shiki";

export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD") // Normalize the string to decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Removes diacritical marks (accents)
    .trim() // Remove extra spaces at the beginning and end
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replaces spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Removes - at the beginning and end
};

export const labelId = (str: string) => `label-${slugify(str)}`;

export const escapeCharacters = (str: string) => he.decode(str);

export const cleanPreCodeBlocks = (htmlDecoded: string) => {
  return htmlDecoded
    .replace(/[\u00A0\u200B\uFEFF]/g, " ")
    .replace(/(<pre[^>]*>\n*<code[^>]*>\n*)+/g, "")
    .replace(/(\n*<\/code>\n*<\/pre>\n*)+/g, "");
};

export const formatCodeBlockLanguage = (
  lang: BundledLanguage | null | undefined
) => {
  switch (lang?.toLocaleLowerCase()) {
    case "ts":
      return "Typescript";
    case "typescript":
      return "Typescript";
    case "py":
      return "Python";
    case "python":
      return "Python";
    case "kt":
      return "Kotlin";
    case "kts":
      return "Kotlin";
    case "java":
      return "Java";
    case "sql":
      return "SQL";
    case "css":
      return "CSS";
    default:
      return "plain text";
  }
};

export const formatType = (type: string) => {
  switch (type) {
    case "jpeg":
    case "image/jpeg":
    case "png":
    case "image/png":
    case "bmp":
    case "image/bmp":
      return "IMAGEM";
    default:
      return "UNKNOWN";
  }
};
