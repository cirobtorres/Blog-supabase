"use client";

import { useState } from "react";
import { postArticleDislike, postArticleLike } from "@/services/article";

export default function ArticleTitleLikeInfo({
  article_id,
  profile_id,
  hasUserLiked,
  likesCount,
}: {
  article_id: string;
  profile_id: string | undefined;
  hasUserLiked: boolean;
  likesCount: number | null;
}) {
  const [countLikes, setCountLikes] = useState(likesCount || 0);
  const [isLiked, setIsLiked] = useState(hasUserLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!profile_id || loading) return;
    setLoading(true);

    // Optimist: instant like (better UX exp)
    const prevLiked = isLiked;
    const prevCount = countLikes;
    setIsLiked(!isLiked);
    setCountLikes((prev) => prev + (isLiked ? -1 : 1));

    const formData = new FormData();
    formData.set("article_id", article_id);
    formData.set("profile_id", profile_id);

    let result;

    if (prevLiked) {
      result = await postArticleDislike(formData);
    } else {
      result = await postArticleLike(formData);
    }
    if (!result.ok) {
      // Rollback: revert like
      setIsLiked(prevLiked);
      setCountLikes(prevCount);
    }
    setLoading(false);
  };

  return (
    <form className="flex items-center gap-2 px-2 py-0.5">
      {profile_id ? (
        <button
          type="submit"
          className="cursor-pointer"
          onClick={handleLike}
          disabled={!profile_id || loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`lucide lucide-heart-icon lucide-heart${
              isLiked && " fill-theme-color stroke-theme-color"
            }`}
          >
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
          </svg>
        </button>
      ) : (
        <button type="submit" className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-heart-icon lucide-heart"
          >
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
          </svg>
        </button>
      )}
      {countLikes}
    </form>
  );
}
