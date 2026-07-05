import { FC } from "react";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

import { Role } from "@/types/response/role-response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { RoleActionType } from "../hooks/use-roles";

type RoleCardProps = {
    data: Role;
    isSelected?: boolean;
    onAction?: (type: RoleActionType, role: Role) => void;
};

const RoleCard: FC<RoleCardProps> = ({ data, onAction }) => {
    return (
        <Card className="relative flex h-64 flex-col overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            {/* Header */}
            <CardHeader>
                <CardTitle className="text-body2 font-medium">
                    {data.roleName}
                </CardTitle>

                <CardDescription className="line-clamp-2">
                    {data.description || "No description provided"}
                </CardDescription>

                <CardAction>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="text-primary h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => onAction?.("edit", data)}>
                                <Edit className="mr-1 h-3.5 w-3.5" />
                                Edit
                            </DropdownMenuItem>

                            {!data.isPrimary && (
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => onAction?.("delete", data)}>
                                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardAction>
            </CardHeader>

            <Separator />

            {/* Content */}
            <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden">
                <Label className="text-body3 font-medium">Permissions</Label>

                <div className="flex flex-1 flex-wrap content-start gap-2 overflow-y-auto pr-1">
                    {data.scopes?.length ? (
                        data.scopes.map((scope) => (
                            <Tooltip key={scope.scopeId}>
                                <TooltipTrigger asChild>
                                    <Badge
                                        variant="bordered"
                                        size="sm"
                                        color="primary">
                                        {scope.displayName}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {scope.description}
                                </TooltipContent>
                            </Tooltip>
                        ))
                    ) : (
                        <CardDescription>
                            No permissions assigned
                        </CardDescription>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default RoleCard;
