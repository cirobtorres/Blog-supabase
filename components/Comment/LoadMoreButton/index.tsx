import { useComment } from "@/hooks/useComment";
import { LoadingSpinning } from "../../LoadingSpinning";

// TODO (IMPORTANT): componente incompleto
export default function LoadMoreButton() {
  const commentContext = useComment();
  const loading = commentContext?.loading;
  const loadMore = commentContext?.loadMore;
  // const hasDbMoreComments = commentContext?.hasDbMoreComments;

  return (
    // hasDbMoreComments &&
    false &&
    (loading ? (
      <LoadingSpinning />
    ) : (
      <button
        type="button"
        onClick={loadMore}
        disabled={loading}
        className={
          `cursor-pointer px-2 py-0.5 w-fit rounded text-theme-color hover:text-neutral-300 ` + // mx-auto border border-neutral-700 bg-neutral-800 hover:bg-neutral-900
          `disabled:cursor-auto disabled:text-[#919191] disabled:border-[#646464] disabled:bg-[#3a3a3a] ` +
          `transition-all outline-none focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-900 `
        }
      >
        Carregar mais
      </button>
    ))
  );
}
