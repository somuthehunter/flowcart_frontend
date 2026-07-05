import { FC } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Role } from "@/types/response/role-response";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useRoleAdd } from "../hooks/use-role-add";

export type RoleAddDialogProps = {
    isOpen?: boolean;
    onClose?: () => void;
    role?: Role;
};

const RoleAddDialog: FC<RoleAddDialogProps> = (props) => {
    const { isOpen, role, onClose } = props;

    const {
        form,
        onSubmit,
        onReset,
        handleOpenChange,
        isCreatingRole,
        isUpdatingRole,
        groupedScopes,
        sortedGroupNames,
        getGroupCount,
        areAllSelected,
        toggleAllScopes,
        toggleGroupScopes,
        toggleScope,
        openGroups,
        toggleGroup,
        isLoadingScopes,
    } = useRoleAdd(props);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-3xl"
                key={role?.roleId ?? "new"}>
                <DialogHeader>
                    <DialogTitle>
                        {role ? "Edit Role" : "Create New Role"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={onSubmit}
                        onReset={onReset}
                        className="flex min-h-0 flex-1 flex-col space-y-6">
                        {/* Role Name + Description */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="roleName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Finance Manager"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Brief description of the role"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Permissions */}
                        <FormField
                            control={form.control}
                            name="scopes"
                            render={({ field }) => (
                                <FormItem>
                                    {/* Header row: label + Select All */}
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Permissions</FormLabel>
                                        {!isLoadingScopes &&
                                            sortedGroupNames.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="select-all-scopes"
                                                        checked={areAllSelected(
                                                            field.value ?? []
                                                        )}
                                                        onCheckedChange={() =>
                                                            toggleAllScopes(
                                                                field.value ??
                                                                    [],
                                                                field.onChange
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor="select-all-scopes"
                                                        className="cursor-pointer text-sm font-medium select-none">
                                                        Select All
                                                    </label>
                                                </div>
                                            )}
                                    </div>

                                    {/* Scope list */}
                                    {isLoadingScopes ? (
                                        <div className="text-muted-foreground mt-3 text-sm">
                                            Loading permissions...
                                        </div>
                                    ) : (
                                        <div className="border-border bg-card mt-3 max-h-[40vh] overflow-y-auto rounded-lg border">
                                            {sortedGroupNames.map(
                                                (groupName) => {
                                                    const count = getGroupCount(
                                                        groupName,
                                                        field.value ?? []
                                                    );
                                                    const isOpen =
                                                        openGroups[groupName];

                                                    return (
                                                        <Collapsible
                                                            key={groupName}
                                                            open={isOpen}
                                                            onOpenChange={() =>
                                                                toggleGroup(
                                                                    groupName
                                                                )
                                                            }
                                                            className="border-b-border border-b last:border-b-0">
                                                            {/* Group header */}
                                                            <CollapsibleTrigger className="hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-ring group flex w-full items-center justify-between px-4 py-3 transition-colors focus-visible:ring-1 focus-visible:outline-none">
                                                                <div className="flex items-center gap-3">
                                                                    <Checkbox
                                                                        id={`group-${groupName}`}
                                                                        checked={
                                                                            count.total >
                                                                                0 &&
                                                                            count.selected ===
                                                                                count.total
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) =>
                                                                            toggleGroupScopes(
                                                                                groupName,
                                                                                !!checked,
                                                                                field.value ??
                                                                                    [],
                                                                                field.onChange
                                                                            )
                                                                        }
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            e.stopPropagation()
                                                                        }
                                                                    />
                                                                    <label
                                                                        htmlFor={`group-${groupName}`}
                                                                        className="cursor-pointer text-sm font-medium select-none"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            e.stopPropagation()
                                                                        }>
                                                                        {
                                                                            groupName
                                                                        }{" "}
                                                                        <span className="text-muted-foreground font-normal">
                                                                            (
                                                                            {
                                                                                count.selected
                                                                            }
                                                                            /
                                                                            {
                                                                                count.total
                                                                            }
                                                                            )
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                                <div className="text-muted-foreground group-hover:text-foreground group-hover:bg-muted flex items-center justify-center rounded-sm p-1 transition-colors">
                                                                    {isOpen ? (
                                                                        <ChevronUp className="h-4 w-4" />
                                                                    ) : (
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    )}
                                                                </div>
                                                            </CollapsibleTrigger>

                                                            {/* Individual scopes */}
                                                            <CollapsibleContent className="px-4 pt-1 pb-4">
                                                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                                    {groupedScopes[
                                                                        groupName
                                                                    ]?.map(
                                                                        (
                                                                            scope
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    scope.scopeId
                                                                                }
                                                                                className="hover:bg-muted/50 flex items-start gap-3 rounded-md border border-transparent p-2 transition-colors">
                                                                                <Checkbox
                                                                                    id={`scope-${scope.scopeId}`}
                                                                                    className="mt-0.5"
                                                                                    checked={field.value?.includes(
                                                                                        scope.scopeName
                                                                                    )}
                                                                                    onCheckedChange={(
                                                                                        checked
                                                                                    ) =>
                                                                                        toggleScope(
                                                                                            scope.scopeName,
                                                                                            !!checked,
                                                                                            field.value ??
                                                                                                [],
                                                                                            field.onChange
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <label
                                                                                    htmlFor={`scope-${scope.scopeId}`}
                                                                                    className="flex flex-1 cursor-pointer flex-col gap-1 select-none">
                                                                                    <span className="text-sm leading-none font-medium">
                                                                                        {
                                                                                            scope.displayName
                                                                                        }
                                                                                    </span>
                                                                                    {scope.description && (
                                                                                        <span className="text-muted-foreground text-xs leading-snug">
                                                                                            {
                                                                                                scope.description
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Actions */}
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                type="reset">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreatingRole || isUpdatingRole}>
                                {isCreatingRole || isUpdatingRole
                                    ? "Saving..."
                                    : role
                                      ? "Update Role"
                                      : "Create Role"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default RoleAddDialog;
