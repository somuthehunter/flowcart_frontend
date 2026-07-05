import { formatDate } from "@/lib/format";
import { separateWords, getEnumEntries } from "@/lib/object-utils";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
    Building2,
    Mail,
    Pencil,
    Phone,
    Power,
    PowerOff,
    Shield,
    Tag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserDetails, UserStatus, UserType } from "@/types/response/user-response";

export type UserActionType = "edit" | "toggleStatus";

interface GetColumnsProps {
    onAction: (type: UserActionType, user: UserDetails) => void;
}

const USER_STATUS_COLORS: Record<UserStatus, { bg: string; text: string }> = {
    [UserStatus.PendingActivation]: {
        bg: "bg-muted",
        text: "text-muted-foreground",
    },
    [UserStatus.Active]: {
        bg: "bg-green-500/10",
        text: "text-green-600",
    },
    [UserStatus.Disable]: {
        bg: "bg-destructive/10",
        text: "text-destructive",
    },
};

export const getColumns = ({ onAction }: GetColumnsProps): ColumnDef<UserDetails>[] => [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
            const user = row.original;
            const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName} />
                        <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm whitespace-nowrap">
                            {user.firstName} {user.lastName}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                            <Tag className="text-primary h-3 w-3" />
                            {user.entityName || "—"}
                        </span>
                    </div>
                </div>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => {
            const { email, phone } = row.original;

            return (
                <div className="flex max-w-64 flex-col gap-2 text-sm">
                    {email ? (
                        <a
                            href={`mailto:${email}`}
                            className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
                            <Mail className="text-primary h-4 w-4 shrink-0" />
                            <span className="truncate">{email}</span>
                        </a>
                    ) : (
                        <span>—</span>
                    )}

                    {phone ? (
                        <a
                            href={`tel:${phone}`}
                            className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
                            <Phone className="text-primary h-4 w-4 shrink-0" />
                            <span>{phone}</span>
                        </a>
                    ) : null}
                </div>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: "role",
        header: "Role & Type",
        cell: ({ row }) => {
            const { roleName, userType } = row.original;
            const typeLabel = getEnumEntries(UserType).find(([, v]) => v === userType)?.[0] || "Unknown";
            
            return (
                <div className="flex flex-col gap-1 text-sm">
                    <span className="flex items-center gap-2">
                        <Shield className="text-primary h-3.5 w-3.5" />
                        {roleName || "—"}
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="text-primary h-3.5 w-3.5" />
                        {typeLabel}
                    </span>
                </div>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            
            return (
                <Badge
                    size="sm"
                    className={cn(
                        USER_STATUS_COLORS[status]?.bg,
                        USER_STATUS_COLORS[status]?.text
                    )}>
                    {separateWords(UserStatus[status] || "Unknown")}
                </Badge>
            );
        },
        enableSorting: false,
    },
    {
        accessorKey: "createdAt",
        header: "Created On",
        cell: ({ row }) =>
            row.original.createdAt ? (
                <span className="text-muted-foreground text-sm">
                    {formatDate(row.original.createdAt)}
                </span>
            ) : (
                "—"
            ),
        enableSorting: false,
    },
    {
        id: "actions",
        header: () => <div className="flex justify-end">Action</div>,
        cell: ({ row }) => {
            const user = row.original;
            const isActive = user.status === UserStatus.Active;

            return (
                <div className="flex items-center justify-end gap-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onAction("edit", user)}
                                className="text-primary h-8 w-8">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit User</TooltipContent>
                    </Tooltip>

                    
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled = {user.isPrimaryUser}
                                    onClick={() => onAction("toggleStatus", user)}
                                    className={cn("h-8 w-8", isActive ? "text-destructive hover:text-destructive" : "text-green-600 hover:text-green-600")}>
                                    {isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{isActive ? "Deactivate User" : "Activate User"}</TooltipContent>
                        </Tooltip>
             
                </div>
            );
        },
        enableSorting: false,
    },
];
