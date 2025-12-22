import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { EmblaCarouselType } from "embla-carousel";

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type PropType = ComponentPropsWithRef<"button">;

export const PrevButton: React.FC<PropType> = (props) => {
  const { children, disabled, ...restProps } = props;
  const [onButtonRelease, setOnButtonRelease] = useState(true);

  return (
    <button
      onPointerDown={() => !disabled && setOnButtonRelease(false)}
      onPointerUp={() => !disabled && setOnButtonRelease(true)}
      onPointerLeave={() => !disabled && setOnButtonRelease(true)}
      className={`absolute top-1/2 -translate-y-1/2 -left-20 appearance-none [-webkit-appearance:none] [-webkit-tap-highlight-color:rgba(230,230,230,0.5)] touch-manipulation inline-flex no-underline border p-0 m-0 [box-shadow:inset_0_0_0_0.2rem_var(--detail-medium-contrast)] size-10 z-10 rounded-full justify-center items-center ${
        onButtonRelease
          ? "transition-[border-color] duration-700 ease-in border-transparent"
          : "border-neutral-800 bg-neutral-700"
      } ${!disabled && "cursor-pointer"} ${
        disabled && "cursor-auto text-neutral-700"
      }`}
      type="button"
      disabled={disabled}
      {...restProps}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="55%"
        height="55%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-left-icon lucide-arrow-left"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      {children}
    </button>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { children, disabled, ...restProps } = props;
  const [onButtonRelease, setOnButtonRelease] = useState(true);

  return (
    <button
      onPointerDown={() => !disabled && setOnButtonRelease(false)}
      onPointerUp={() => !disabled && setOnButtonRelease(true)}
      onPointerLeave={() => !disabled && setOnButtonRelease(true)}
      className={`absolute top-1/2 -translate-y-1/2 -right-20 appearance-none [-webkit-appearance:none] [-webkit-tap-highlight-color:rgba(230,230,230,0.5)] touch-manipulation inline-flex no-underline border p-0 m-0 [box-shadow:inset_0_0_0_0.2rem_var(--detail-medium-contrast)] size-10 z-10 rounded-full justify-center items-center ${
        onButtonRelease
          ? "transition-[border-color] duration-700 ease-in border-transparent"
          : "border-neutral-800 bg-neutral-700"
      } ${!disabled && "cursor-pointer"} ${
        disabled && "cursor-auto text-neutral-700"
      }`}
      type="button"
      {...restProps}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="55%"
        height="55%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-right-icon lucide-arrow-right"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
      {children}
    </button>
  );
};
