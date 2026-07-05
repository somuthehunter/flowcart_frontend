import { useLayoutEffect, useState } from "react";
import { debounce } from "lodash";

const useMediaQuery = (media: string, debounceTime: number = 300) => {
    const [brkPntMatch, setBrkPntMatch] = useState<boolean>(false);

    const calcInnerWidth = (e: MediaQueryListEvent) => {
        setBrkPntMatch(e.matches);
    };
    const calcInnerWidthDebounce = debounce(calcInnerWidth, debounceTime);
    useLayoutEffect(() => {
        const mediaQueryList = window.matchMedia(media);
        setBrkPntMatch(mediaQueryList.matches);
        mediaQueryList.addEventListener(
            "change",
            debounceTime ? calcInnerWidthDebounce : calcInnerWidth
        );
        return () => {
            calcInnerWidthDebounce?.cancel();
            mediaQueryList.removeEventListener(
                "change",
                debounceTime ? calcInnerWidthDebounce : calcInnerWidth
            );
        };
    }, []);

    return brkPntMatch;
};
export default useMediaQuery;
