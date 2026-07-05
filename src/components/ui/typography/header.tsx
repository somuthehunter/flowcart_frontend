import { PropsWithChildren } from "react";

export function TypographyLarge({ children }: PropsWithChildren) {
    return <div className="text-lg font-semibold">{children}</div>;
}

export function TypographySmall({ children }: PropsWithChildren) {
    return (
        <small className="text-sm leading-none font-medium">{children}</small>
    );
}

export function TypographyMuted({ children }: PropsWithChildren) {
    return <p className="text-muted-foreground text-sm">{children}</p>;
}
