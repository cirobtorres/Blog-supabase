import {
  GlobeIcon,
  HomeIcon,
  ImageEditorIcon,
  PencilIcon,
} from "@/components/Icons";

export const MENU_ITEMS = [
  {
    key: "adm-menu-item-home",
    icon: HomeIcon,
    label: "Home",
    href: "/admin",
  },
  {
    key: "adm-menu-item-crt-art",
    icon: PencilIcon,
    label: "Criar Artigo",
    href: "/admin/create-article",
  },
  {
    key: "adm-menu-item-media-manager",
    icon: ImageEditorIcon,
    label: "Biblioteca de medias",
    href: "/admin/media",
  },
  {
    key: "adm-menu-item-about",
    icon: GlobeIcon,
    label: "Sobre",
    href: "/admin/global",
  },
];
