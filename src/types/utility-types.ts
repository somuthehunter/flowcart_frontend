export type AwaitedReturnType<T extends (...args: unknown[]) => unknown> =
    Awaited<ReturnType<T>>;

export type NullableKeys<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? T[P] | null : T[P];
};

export type ExtractKeyType<T, K extends keyof T> = T[K];

export type UnionToTuple<T> = (
    T extends unknown ? (args: T) => void : never
) extends (args: infer R) => void
    ? R
    : never;

export type NullableOptional<T> = { [K in keyof T]?: T[K] | null };
