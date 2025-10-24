import { JSX } from "react";
import { toast } from "sonner";

const style = {
  borderRadius: "8px", // rounded-lg
  color: "#f5f5f5", // # text-neutral-100
  borderColor: "#404040", // # border-neutral-700
  backgroundColor: "#171717", // # bg-neutral-900
};

// export const sonnerToastSuccess = (message: string) => {
//   return toast.success(message, { style });
// };

// export const sonnerToastError = (message: string) => {
//   return toast.error(message, { style });
// };

export const sonnerToastPromise = (
  promise: Promise<any>,
  success: (data: ArticleActionStateProps) => JSX.Element,
  error: (data: ArticleActionStateProps) => JSX.Element,
  loading: string = "Carregando..."
) => {
  return toast.promise(promise, {
    loading,
    success: (data) => success(data),
    error: (data) => error(data),
    style, // style is injected at the same place where classNames: { toast: "..." } is. Use either style or classNames toast (with !important)
    classNames: {
      // toast: "text-neutral-100! rounded-lg! border-neutral-700! bg-neutral-900!",
      // icon: "",
      // loading: "",
      content: "w-full",
      title: "w-full flex justify-between items-center",
      // description: "",
      // closeButton: "",
    },
  });
};

/* 
<li data-sonner-toast="">
  ... TOAST
  <div data-icon="">
    ... ICON
    <div class="sonner-loading-wrapper" data-visible="false"> ... LOADING
      <div class="sonner-spinner">
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
        <div class="sonner-loading-bar" />
      </div>
    </div>
    <svg>
      <path />
    </svg>
  </div>
  <div data-content="">
    ... CONTENT
    <div data-title="">
      ... TITLE
    </div>
  </div>
</li>
*/
