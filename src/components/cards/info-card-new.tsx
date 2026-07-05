import React, {
    Children,
    isValidElement,
    PropsWithChildren,
    ReactElement,
    useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import flattenChildren from "react-keyed-flatten-children";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem<TItem extends string | number> {
    title: string;
    value: TItem;
    icon: ReactElement;
    disabled?: boolean;
}

interface InfoCardProps<TItem extends string | number> {
    title?: string;
    className?: string;
    menu?: MenuItem<TItem>[];
    classes?: {
        root?: string;
        title?: string;
        content?: string;
        header?: string;
        footer?: string;
    };
    onMenuItemClick?: (value: TItem) => void;
}

const InfoCard = <TItem extends string | number>({
    children,
    title,
    className,
    classes = {},
    menu,
    onMenuItemClick,
    ...restProps
}: PropsWithChildren<InfoCardProps<TItem>>) => {
    const handleMenuClick = (value: TItem) => () => {
        if (onMenuItemClick) {
            onMenuItemClick(value);
        }
    };

    const actions = useMemo(
        () =>
            flattenChildren(children, 2).filter((child) => {
                const item = child as ReactElement<PropsWithChildren>;
                return item?.type === Actions;
            }),
        [children]
    );

    const content = useMemo(
        () =>
            flattenChildren(children, 2).filter((child) => {
                const item = child as ReactElement<PropsWithChildren>;
                return item?.type !== Actions;
            }),
        [children]
    );

    return (
        <Card className={cn(classes?.root, className)} {...restProps}>
            {(title || menu) && (
                <CardHeader
                    className={cn(
                        "flex flex-row items-center justify-between space-y-0 pb-2",
                        classes?.header
                    )}>
                    {title && (
                        <CardTitle
                            className={cn(
                                "text-muted-foreground text-lg font-medium",
                                classes?.title
                            )}>
                            {title}
                        </CardTitle>
                    )}
                    {menu && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {menu.map((item, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        disabled={item.disabled}
                                        onClick={handleMenuClick(item.value)}
                                        className="gap-2">
                                        <span className="flex h-4 w-4 items-center justify-center">
                                            {item.icon}
                                        </span>
                                        {item.title}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </CardHeader>
            )}

            <CardContent className={cn("pt-2", classes?.content)}>
                {content}
            </CardContent>

            {!!actions.length && (
                <CardFooter className={cn("pt-0", classes?.footer)}>
                    {actions}
                </CardFooter>
            )}
        </Card>
    );
};

interface ActionsProps {}

const Actions = ({ children }: PropsWithChildren<ActionsProps>) => {
    return (
        <>
            {Children.map(children, (child) => {
                if (!isValidElement(child)) return null;
                return child;
            })}
        </>
    );
};

export const InfoCardActions = Actions;
export default InfoCard;
