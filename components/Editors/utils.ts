import { LinkProtocolOptions } from "@tiptap/extension-link";
import { BundledLanguage } from "shiki";

const LANGUAGES: BundledLanguage[] = ["ts", "py", "kt", "java"];
const STYLE_LANGUAGES: BundledLanguage[] = ["css"];
const DB_LANGUAGES: BundledLanguage[] = ["sql"];

const convertBack = (lang?: string): BundledLanguage => {
  if (!lang) return "ts";
  switch (lang.toLocaleLowerCase()) {
    case "typescript":
      return "ts";
    case "python":
      return "py";
    case "kotlin":
      return "kt";
    case "java":
      return "java";
    case "sql":
      return "sql";
    case "css":
      return "css";
    default:
      return "ts";
  }
};

const validateAllowedUri = (
  url: string,
  ctx: {
    defaultValidate: (url: string) => boolean;
    protocols: Array<LinkProtocolOptions | string>;
    defaultProtocol: string;
  }
) => {
  try {
    const parsedUrl = url.includes(":")
      ? new URL(url)
      : new URL(`${ctx.defaultProtocol}://${url}`);

    // Tiptap general validation
    if (!ctx.defaultValidate(parsedUrl.href)) {
      return false; // Invalid URL
    }

    const disallowedDomains = [""]; // TODO (Tiptap link disallowedDomains)
    const domain = parsedUrl.hostname;

    const disallowedProtocols = ["ftp", "file", "mailto"];
    const protocol = parsedUrl.protocol.replace(":", "");

    const allowedProtocols = ctx.protocols.map((p) =>
      typeof p === "string" ? p : p.scheme
    );

    if (disallowedProtocols.includes(protocol)) {
      return false; // Not allowed
    }
    if (!allowedProtocols.includes(protocol)) {
      return false; // Not allowed
    }
    if (disallowedDomains.includes(domain)) {
      return false; // Not allowed
    }

    return true; // all checks have passed
  } catch {
    return false;
  }
};

const validateAllowedAutoLink = (url: string) => {
  try {
    const parsedUrl = url.includes(":")
      ? new URL(url)
      : new URL(`https://${url}`);

    const disallowedDomains = [""]; // TODO (Tiptap link disallowedDomains)
    const domain = parsedUrl.hostname;

    return !disallowedDomains.includes(domain);
  } catch {
    return false;
  }
};

export {
  LANGUAGES,
  STYLE_LANGUAGES,
  DB_LANGUAGES,
  convertBack,
  validateAllowedUri,
  validateAllowedAutoLink,
};
