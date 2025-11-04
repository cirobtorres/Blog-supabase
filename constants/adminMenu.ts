import {
  GlobeIcon,
  HomeIcon,
  ImageEditorIcon,
  ArticlePencilIcon,
} from "../components/Icons";

export const MENU_ITEMS = [
  {
    key: "adm-menu-item-home",
    icon: HomeIcon,
    label: "Home",
    href: "/admin",
  },
  {
    key: "adm-menu-item-crt-art",
    icon: ArticlePencilIcon,
    label: "Criar Artigo",
    href: "/admin/create-article",
  },
  {
    key: "adm-menu-item-media-manager",
    icon: ImageEditorIcon,
    label: "Biblioteca de arquivos",
    href: "/admin/media",
  },
  {
    key: "adm-menu-item-about",
    icon: GlobeIcon,
    label: "Sobre",
    href: "/admin/global",
  },
];
