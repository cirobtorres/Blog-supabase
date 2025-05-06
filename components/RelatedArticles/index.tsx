"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { NextButton, PrevButton, usePrevNextButtons } from "./ArrowButtons";
import { ArticleGridElement } from "../ArticleFeedGrid";

const OPTIONS: EmblaOptionsType = {
  loop: false,
  dragFree: true,
};

export const RelatedArticles = ({ articles }: { articles: Article[] | [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="w-full py-8 bg-neutral-900">
      <div className="relative w-full max-w-4xl m-auto ">
        <div className="mb-4 mx-4">
          <h3 className="text-3xl">Leia também</h3>
        </div>
        <div className="overflow-hidden mx-4" ref={emblaRef}>
          <div className="flex touch-pan-y touch-pinch-zoom ml-[calc(var(--related-articles-carousel-spacing)_*_-1)]">
            {articles.map((article) => (
              <div
                className="translate-0 sm:flex-[0_0_50%] flex-[0_0_100%] min-w-0 pl-[var(--related-articles-carousel-spacing)]"
                key={article.id}
              >
                <ArticleGridElement {...article} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden xl:block mx-4">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
};
