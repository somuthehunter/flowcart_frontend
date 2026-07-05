export type Option = {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableFilterField<TData> {
    label: string;
    value: keyof TData;
    placeholder?: string;
    options?: Array<Option>;
}

export interface DataTableFilterOption<TData> {
    id: string;
    label: string;
    value: keyof TData;
    options: Array<Option>;
    filterValues?: Array<string>;
    filterOperator?: string;
    isMulti?: boolean;
}
