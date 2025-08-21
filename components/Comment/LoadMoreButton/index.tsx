import { useComment } from "@/hooks/useComment";

export default function LoadMoreButton() {
  const commentContext = useComment();
  const loading = commentContext?.loading;
  const loadMore = commentContext?.loadMore;
  const hasDbMoreComments = commentContext?.hasDbMoreComments;

  return (
    hasDbMoreComments && (
      <button
        type="button"
        onClick={loadMore}
        disabled={loading}
        className={
          `cursor-pointer px-2 py-0.5 mx-auto w-fit rounded border border-neutral-700 bg-neutral-800 hover:bg-neutral-900 text-theme-color ` +
          `disabled:cursor-auto disabled:text-[#919191] disabled:border-[#646464] disabled:bg-[#3a3a3a] ` +
          `transition-all outline-none focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-900 `
        }
      >
        Carregar mais
      </button>
    )
  );
}
