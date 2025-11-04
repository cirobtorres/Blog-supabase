"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ProgressBar } from "./ProgressBar";
import { LogoutButton } from "../Buttons/client";
import { focusVisibleWhiteRing } from "../../styles/classNames";
import { cn } from "../../utils/classnames";

export const StaticHeader = ({ profile }: { profile: Profile | null }) => {
  return (
    <header className="w-full h-(--header-height) border-b border-neutral-800 backdrop-blur-sm bg-neutral-950/50">
      <div className="relative max-w-10/12 mx-auto h-full">
        <HeaderContent profile={profile} />
      </div>
    </header>
  );
};

export const FixedHeader = ({ profile }: { profile: Profile | null }) => {
  const headerRef = useRef<HTMLElement>(null);
  const scrollingDownRef = useRef(0);

  const hideNavbarListener = () => {
    let prevScrollPos = window.scrollY;
    const threshold = 1000; // Header is static for the first 1000 px on top

    const handleScroll = () => {
      const currScrollPos = window.scrollY;
      if (
        currScrollPos < threshold || // Show header when on top
        currScrollPos < prevScrollPos || // Show header when scrolling up
        (currScrollPos > prevScrollPos && scrollingDownRef.current < 1000) // Hide header after scrolling 1000 px down
      ) {
        if (headerRef.current) headerRef.current.style.top = "0"; // Show
      } else {
        if (headerRef.current) headerRef.current.style.top = "-64px"; // Hide
      }
      if (currScrollPos > prevScrollPos) {
        // scrollingDownRef.current keeps header static for a certain amout of scrolling down before hiding it
        scrollingDownRef.current += currScrollPos - prevScrollPos;
      } else {
        // It is restarted when scrolling up
        scrollingDownRef.current = 0;
      }
      prevScrollPos = currScrollPos;
    };
    return handleScroll;
  };

  useEffect(() => {
    const handleScroll = hideNavbarListener();
    window.addEventListener("scroll", handleScroll);
    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Calls only once

  return (
    <header
      ref={headerRef}
      id="floating-header"
      data-testid="floating-header"
      className="fixed top-0 z-10 w-full h-(--header-height) shrink-0 transition-[top] duration-300 border-b border-neutral-800 bg-neutral-950" // bg-neutral-950/50 backdrop-blur-sm
      style={{ top: 0 }}
    >
      <div className="relative max-w-10/12 mx-auto h-full">
        <HeaderContent profile={profile} />
      </div>
      <ProgressBar />
    </header>
  );
};

const HeaderContent = ({ profile }: { profile: Profile | null }) => {
  return (
    <div className="h-full mx-4 flex-1 flex justify-between">
      <div className="flex items-center">
        <Link
          href="/"
          className="rounded outline-none text-neutral-300 hover:text-neutral-100 transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
        >
          HOME
        </Link>
      </div>
      {profile ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Image
              src={
                profile.avatar_url
                  ? profile.avatar_url
                  : "/images/not-authenticated.png"
              }
              alt={`Avatar de ${profile.username}`}
              width={24}
              height={24}
              className="rounded-full"
            />
            {profile.admin ? (
              <Link
                href="/admin"
                className="w-fit text-sm text-theme-color ml-2 px-1 py-0.5 rounded outline-none hover:text-neutral-100 transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
              >
                {profile.username}
              </Link>
            ) : (
              <Link
                href="/user"
                className={cn(
                  "w-fit text-sm text-theme-color ml-2 px-1 py-0.5 rounded outline-none transition-all duration-300 hover:text-neutral-100",
                  focusVisibleWhiteRing
                )}
              >
                {profile.username}
              </Link>
            )}
          </div>
          <LogoutButton label="Sair" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="w-fit text-sm px-1 py-0.5 rounded outline-none text-neutral-300 hover:text-neutral-100 transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
          >
            Entrar
          </Link>
          <Link
            href="/sign-up"
            className="w-fit text-sm px-1 py-0.5 rounded outline-none text-neutral-300 hover:text-neutral-100 transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
          >
            Cadastrar
          </Link>
        </div>
      )}
    </div>
  );
};
