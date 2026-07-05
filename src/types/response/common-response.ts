export type CommonResponse = {
    status: number;
    message: string;
};
export type ServerPaginatedData<T> = {
    data?: T[];
    totalNumber: number;
    totalPages: number;
    pageNumber: number;
    rowsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type CursorPaginatedData<T> = {
    data: T[];
    nextCursor: string | null;
    previousCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    limit: number;
};
