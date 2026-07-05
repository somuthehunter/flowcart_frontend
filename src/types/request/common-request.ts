export type PageParams = {
    rowsPerPage?: number; // default: 10
    pageNumber?: number; // default: 1
};

export enum SortOrder {
    Ascending = 1,
    Descending = 2,
}

export type CursorPaginationParams = {
    nextCursor?: string | null;
    previousCursor?: string | null;
    limit?: number;
};
