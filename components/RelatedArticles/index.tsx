"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { NextButton, PrevButton, usePrevNextButtons } from "./ArrowButtons";
import { ArticleGridElement } from "../ArticleFeedGrid";
import { useParams } from "next/navigation";
import { createBrowserAppClient } from "@/supabase/client";
import { useEffect, useState } from "react";

const OPTIONS: EmblaOptionsType = {
  loop: false,
  dragFree: true,
};

const supabase = createBrowserAppClient();

async function getArticles(id: string) {
  const { data: lastArticles } = await supabase
    .from("articles")
    .select("*, authors (*)")
    .neq("id", id)
    .range(0, 5)
    .overrideTypes<ArticleJoinAuthor[], { merge: false }>();
  return lastArticles;
}

export const RelatedArticles = () => {
  const [articles, setArticles] = useState<ArticleJoinAuthor[] | null>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const { id }: { id: string } = useParams();

  useEffect(() => {
    getArticles(id).then((articles) => {
      if (articles) {
        setArticles(articles.map((article: ArticleJoinAuthor) => article));
      }
    });
  }, [id]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    articles &&
    articles.length > 0 && (
      <section className="w-full py-10">
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
                  <ArticleGridElement article={article} author={null} />
                </div>
              ))}
            </div>
          </div>
          {articles.length > 2 && (
            <div className="hidden xl:block mx-4">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </div>
          )}
        </div>
      </section>
    )
  );
};
