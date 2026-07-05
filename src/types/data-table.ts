import { ColumnDef, ColumnSort, Row, RowData } from "@tanstack/react-table";

import type { DataTableConfig } from "../config/data-table";
import { FilterItemSchema } from "../lib/parsers";

// Generic table data response
export type PaginatedResponse<T> = {
    data: T[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        pageCount: number;
    };
};

// Table state that will be encoded in URL
export type DataTableState = {
    page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    search: string;
    filters: Record<string, string>;
};

// Props for the data table component
export interface DataTableProps<TData> {
    columns: ColumnDef<TData, unknown>[];
    endpoint: string;
    initialState?: Partial<DataTableState>;
    onRowSelected?: (rows: TData[]) => void;
    queryKey?: string; // Added for React Query identification
}

declare module "@tanstack/react-table" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        label?: string;
        placeholder?: string;
        variant?: FilterVariant;
        options?: Option[];
        range?: [number, number];
        unit?: string;
        icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    }
}

export interface Option {
    label: string;
    value: string;
    count?: number;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
    id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
    id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
    row: Row<TData>;
    variant: "update" | "delete";
}
