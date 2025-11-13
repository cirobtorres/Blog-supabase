import { useEffect, useRef } from "react";

export function useRenderCount(name: string) {
  const renders = useRef(0);
  useEffect(() => {
    renders.current++;
    console.log(`${name} render count:`, renders.current);
  });
}
