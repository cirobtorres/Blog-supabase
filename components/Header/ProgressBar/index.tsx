"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const ProgressBar = () => {
  const pathname = usePathname();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarBlurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lineProgressOnScroll = () => {
      const elementHeight =
        document.documentElement.scrollHeight - window.innerHeight; // Page total height

      const scrollTop = window.scrollY; // Current Y coord height (pixels)

      if (
        elementHeight &&
        progressBarRef.current &&
        progressBarBlurRef.current
      ) {
        const percentage =
          scrollTop < elementHeight ? (scrollTop / elementHeight) * 100 : 100; // Current Y coord (percentage)

        progressBarBlurRef.current.style.width = `${percentage}%`;
        progressBarRef.current.style.width = `${percentage}%`;
      }
    };

    window.addEventListener("scroll", lineProgressOnScroll);
    return () => {
      // Cleanup
      window.removeEventListener("scroll", lineProgressOnScroll);
    };
  }, []);

  return (
    pathname.startsWith("/articles") && (
      <div
        id="progress"
        data-testid="progress"
        role="progressbar"
        aria-live="polite"
        aria-labelledby="progressbar-label"
        aria-valuenow={
          progressBarRef.current
            ? Number(progressBarRef.current.style.width.replace("%", ""))
            : 0
        }
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-[calc(100%_+_1px)] left-0 h-1 w-full inline-grid"
      >
        <div
          ref={progressBarRef}
          id="progress-bar-blur"
          data-testid="progress-bar-blur"
          style={{ width: "0%" }}
          className="h-full col-start-1 row-start-1 bg-gradient-to-r from-transparent to-theme-color blur-xl rounded-full hidden max-lg:block"
        />
        <div
          ref={progressBarBlurRef}
          id="progress-bar"
          data-testid="progress-bar"
          style={{ width: "0%" }}
          className="h-full col-start-1 row-start-1 bg-gradient-to-r from-transparent to-theme-color rounded-full hidden max-lg:block"
        />
        <span id="progressbar-label" className="sr-only">
          Progresso de rolagem da página
        </span>
      </div>
    )
  );
};
