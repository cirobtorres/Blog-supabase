import { useState } from "react";
import { BundledLanguage } from "shiki";
import {
  convertBack,
  DB_LANGUAGES,
  LANGUAGES,
  STYLE_LANGUAGES,
} from "../../utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { cn } from "../../../../utils/classnames";
import { formatCodeBlockLanguage } from "../../../../utils/strings";
import {
  focusVisibleWhiteRing,
  hoverWhiteRing,
} from "../../../../styles/classNames";

export default function LanguageSelect({
  defaultlanguage,
  callback,
}: {
  defaultlanguage?: string;
  callback: (lang: string) => void;
}) {
  const [lang, setLang] = useState<BundledLanguage | null | undefined>(
    convertBack(defaultlanguage) ?? "ts"
  );

  return (
    <Select
      value={lang ?? ""}
      onValueChange={(value) => {
        callback(value);
        setLang(value.toLocaleLowerCase() as BundledLanguage);
      }}
    >
      <SelectTrigger
        className={cn(
          "w-32 z-10 absolute top-2 right-4 py-1 px-3 rounded-[3px] bg-neutral-800 transition-all duration-300",
          "data-[state=open]:text-neutral-100 data-[state=open]:bg-[#2b2b2b] focus-within:text-neutral-100",
          focusVisibleWhiteRing
        )}
      >
        <SelectValue placeholder={formatCodeBlockLanguage(lang)} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "w-40 transition-all duration-300 scrollbar",
          hoverWhiteRing
        )}
      >
        <SelectGroup>
          <SelectLabel>Lógica</SelectLabel>
          {LANGUAGES.sort().map((language) => (
            <SelectItem key={language} value={language}>
              {formatCodeBlockLanguage(language)}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Estilo</SelectLabel>
          {STYLE_LANGUAGES.sort().map((language) => (
            <SelectItem key={language} value={language}>
              {formatCodeBlockLanguage(language)}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Banco de Dados</SelectLabel>
          {DB_LANGUAGES.sort().map((language) => (
            <SelectItem key={language} value={language}>
              {formatCodeBlockLanguage(language)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
