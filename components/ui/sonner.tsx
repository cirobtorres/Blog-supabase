"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#171717",
          "--normal-text": "#f5f5f5",
          "--normal-border": "#262626",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
