import { useEffect } from "react";

import { useIntersectionObserver } from "./use-intersection-observer";

type UseInfiniteScrollObserverParams = {
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
};
export const useInfiniteScrollObserver = ({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}: UseInfiniteScrollObserverParams) => {
    const { isIntersecting, ref } = useIntersectionObserver();

    useEffect(() => {
        if (isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return {
        isIntersecting,
        ref,
    };
};
