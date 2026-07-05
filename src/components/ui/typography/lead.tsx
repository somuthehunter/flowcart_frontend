import { PropsWithChildren } from "react";

export function TypographyLead({ children }: PropsWithChildren) {
    return <p className="text-muted-foreground text-xl">{children}</p>;
}
