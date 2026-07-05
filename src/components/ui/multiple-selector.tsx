import * as React from "react";
import { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export interface Option {
    value: string;
    label: string;
    disable?: boolean;
    /** fixed option that can't be removed. */
    fixed?: boolean;
}

export interface GroupableOption extends Option {
    /** Group the options by providing key. */
    group?: string;
}

interface GroupOption {
    [key: string]: Option[];
}

interface MultipleSelectorProps {
    value?: Option[];
    defaultOptions?: Option[];
    /** manually controlled options */
    options?: Option[];
    placeholder?: string;
    /** Loading component. */
    loadingIndicator?: React.ReactNode;
    /** Empty component. */
    emptyIndicator?: React.ReactNode;
    /** Debounce time for async search. Only work with `onSearch`. */
    delay?: number;
    /**
     * Only work with `onSearch` prop. Trigger search when `onFocus`.
     * For example, when user click on the input, it will trigger the search to get initial options.
     **/
    triggerSearchOnFocus?: boolean;
    /** async search */
    onSearch?: (value: string) => Promise<Option[]>;
    /**
     * sync search. This search will not showing loadingIndicator.
     * The rest props are the same as async search.
     * i.e.: creatable, groupBy, delay.
     **/
    onSearchSync?: (value: string) => Option[];
    onChange?: (options: Option[]) => void;
    /** Called when search fails */
    onSearchError?: (error: unknown) => void;
    /** Limit the maximum number of selected options. */
    maxSelected?: number;
    /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
    onMaxSelected?: (maxLimit: number) => void;
    /** Hide the placeholder when there are options selected. */
    hidePlaceholderWhenSelected?: boolean;
    disabled?: boolean;
    /** Group the options base on provided key. */
    groupBy?: string;
    className?: string;
    badgeClassName?: string;
    /**
     * First item selected is a default behavior by cmdk. That is why the default is true.
     * This is a workaround solution by add a dummy item.
     *
     * @reference: https://github.com/pacocoursey/cmdk/issues/171
     */
    selectFirstItem?: boolean;
    /** Allow user to create option when there is no option matched. */
    creatable?: boolean;
    /** Props of `Command` */
    commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
    /** Props of `CommandInput` */
    inputProps?: Omit<
        React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
        "value" | "placeholder" | "disabled"
    >;
    /** hide the clear all button. */
    hideClearAllButton?: boolean;
    /** Limit the number of selected badges shown before collapsing. */
    limit?: number;
}

export interface MultipleSelectorRef {
    selectedValue: Option[];
    input: HTMLInputElement;
    focus: () => void;
    reset: () => void;
}

// Deep equality check for objects
function deepEqual<T>(a: T, b: T): boolean {
    if (a === b) return true;

    if (a === null || b === null) return false;
    if (typeof a !== "object" || typeof b !== "object") return false;

    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!keysB.includes(key)) return false;

        const valA = (a as Record<string, unknown>)[key];
        const valB = (b as Record<string, unknown>)[key];

        if (!deepEqual(valA, valB)) {
            return false;
        }
    }

    return true;
}

// Memoized group transformation
const transToGroupOption = (
    options: Option[],
    groupBy?: string
): GroupOption => {
    if (options.length === 0) return {};

    if (!groupBy) return { "": options };

    return options.reduce((acc, option) => {
        const key =
            ((option as unknown as Record<string, unknown>)[
                groupBy
            ] as string) || "";
        if (!acc[key]) acc[key] = [];
        acc[key].push(option);
        return acc;
    }, {} as GroupOption);
};

const removePickedOption = (
    groupOption: GroupOption,
    picked: Option[]
): GroupOption => {
    const pickedValues = new Set(picked.map((p) => p.value));
    const result: GroupOption = {};

    for (const [key, value] of Object.entries(groupOption)) {
        result[key] = value.filter((val) => !pickedValues.has(val.value));
    }

    return result;
};

const isOptionsExist = (
    groupOption: GroupOption,
    targetOption: Option[]
): boolean => {
    const targetValues = new Set(targetOption.map((t) => t.value));

    for (const value of Object.values(groupOption)) {
        if (value.some((option) => targetValues.has(option.value))) {
            return true;
        }
    }
    return false;
};

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
    const render = useCommandState((state) => state.filtered.count === 0);

    if (!render) return null;

    return (
        <div
            ref={forwardedRef}
            className={cn("py-6 text-center text-sm", className)}
            cmdk-empty=""
            role="presentation"
            {...props}
        />
    );
});

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = React.forwardRef<
    MultipleSelectorRef,
    MultipleSelectorProps
>(
    (
        {
            value,
            onChange,
            placeholder,
            defaultOptions: arrayDefaultOptions = [],
            options: arrayOptions,
            delay = 500,
            onSearch,
            onSearchSync,
            onSearchError,
            loadingIndicator,
            emptyIndicator,
            maxSelected = Number.MAX_SAFE_INTEGER,
            onMaxSelected,
            hidePlaceholderWhenSelected,
            disabled,
            groupBy,
            className,
            badgeClassName,
            selectFirstItem = true,
            creatable = false,
            triggerSearchOnFocus = false,
            commandProps,
            inputProps,
            hideClearAllButton = false,
            limit = 20,
        }: MultipleSelectorProps,
        ref: React.Ref<MultipleSelectorRef>
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const dropdownRef = useRef<HTMLDivElement>(null);
        const searchIdRef = useRef(0);

        // Determine if component is controlled
        const isControlled = value !== undefined;

        const [open, setOpen] = React.useState(false);
        const [onScrollbar, setOnScrollbar] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(false);
        const [expanded, setExpanded] = React.useState(false);

        const [internalSelected, setInternalSelected] = React.useState<
            Option[]
        >(() => value || []);
        const [inputValue, setInputValue] = React.useState("");

        // Use controlled value if provided, otherwise use internal state
        const selected = isControlled ? value! : internalSelected;

        // Memoize initial options transformation
        const [options, setOptions] = React.useState<GroupOption>(() =>
            transToGroupOption(arrayDefaultOptions, groupBy)
        );

        const debouncedSearchTerm = useDebounce(inputValue, delay);

        // Handle selection changes with proper controlled/uncontrolled support
        const handleSelectionChange = useCallback(
            (newOptions: Option[]) => {
                if (!isControlled) {
                    setInternalSelected(newOptions);
                }
                onChange?.(newOptions);
            },
            [isControlled, onChange]
        );

        React.useImperativeHandle(
            ref,
            () => ({
                selectedValue: [...selected],
                input: inputRef.current as HTMLInputElement,
                focus: () => inputRef?.current?.focus(),
                reset: () => handleSelectionChange([]),
            }),
            [selected, handleSelectionChange]
        );

        // Improved click outside handler with proper cleanup
        useEffect(() => {
            if (!open) return;

            const handleClickOutside = (event: MouseEvent | TouchEvent) => {
                const target = event.target as Node;
                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(target) &&
                    inputRef.current &&
                    !inputRef.current.contains(target)
                ) {
                    setOpen(false);
                    inputRef.current.blur();
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchend", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
                document.removeEventListener("touchend", handleClickOutside);
            };
        }, [open]);

        // Sync controlled value changes
        useEffect(() => {
            if (isControlled && value) {
                setInternalSelected(value);
            }
        }, [value, isControlled]);

        // Reset expansion state when selection changes significantly
        useEffect(() => {
            if (selected.length <= limit && expanded) {
                setExpanded(false);
            }
        }, [selected.length, limit, expanded]);

        // Handle array options changes with proper comparison
        useEffect(() => {
            if (!arrayOptions || onSearch) return;

            const newOption = transToGroupOption(arrayOptions, groupBy);
            if (!deepEqual(newOption, options)) {
                setOptions(newOption);
            }
        }, [arrayOptions, groupBy, onSearch, options]);

        // Handle unselect with proper callback memoization
        const handleUnselect = useCallback(
            (option: Option) => {
                const newOptions = selected.filter(
                    (s) => s.value !== option.value
                );
                handleSelectionChange(newOptions);
            },
            [selected, handleSelectionChange]
        );

        // Improved keyboard handling
        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                const input = inputRef.current;
                if (!input) return;

                switch (e.key) {
                    case "Delete":
                    case "Backspace":
                        if (input.value === "" && selected.length > 0) {
                            const lastSelectOption =
                                selected[selected.length - 1];
                            if (!lastSelectOption.fixed) {
                                handleUnselect(lastSelectOption);
                            }
                        }
                        break;
                    case "Escape":
                        setOpen(false);
                        input.blur();
                        break;
                    case "ArrowDown":
                        if (!open) {
                            setOpen(true);
                            e.preventDefault();
                        }
                        break;
                }
            },
            [handleUnselect, selected, open]
        );

        // Async search with race condition protection
        useEffect(() => {
            if (!onSearch || !open) return;

            const doSearch = async () => {
                const currentSearchId = ++searchIdRef.current;
                setIsLoading(true);

                try {
                    const res = await onSearch(debouncedSearchTerm);

                    // Only update if this is still the latest search
                    if (currentSearchId === searchIdRef.current) {
                        setOptions(transToGroupOption(res || [], groupBy));
                    }
                } catch (error) {
                    if (currentSearchId === searchIdRef.current) {
                        console.error("Search failed:", error);
                        onSearchError?.(error);
                    }
                } finally {
                    if (currentSearchId === searchIdRef.current) {
                        setIsLoading(false);
                    }
                }
            };

            const exec = async () => {
                if (triggerSearchOnFocus) {
                    await doSearch();
                }

                if (debouncedSearchTerm) {
                    await doSearch();
                }
            };

            void exec();
        }, [
            debouncedSearchTerm,
            groupBy,
            open,
            triggerSearchOnFocus,
            onSearch,
            onSearchError,
        ]);

        // Sync search
        useEffect(() => {
            if (!onSearchSync || !open) return;

            const doSearchSync = () => {
                const res = onSearchSync(debouncedSearchTerm);
                setOptions(transToGroupOption(res || [], groupBy));
            };

            if (triggerSearchOnFocus) {
                doSearchSync();
            }

            if (debouncedSearchTerm) {
                doSearchSync();
            }
        }, [
            debouncedSearchTerm,
            groupBy,
            open,
            triggerSearchOnFocus,
            onSearchSync,
        ]);

        // Memoized creatable item
        const CreatableItem = useMemo(() => {
            if (!creatable) return null;

            if (
                isOptionsExist(options, [
                    { value: inputValue, label: inputValue },
                ]) ||
                selected.find((s) => s.value === inputValue)
            ) {
                return null;
            }

            const Item = (
                <CommandItem
                    value={inputValue}
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onSelect={(value: string) => {
                        if (selected.length >= maxSelected) {
                            onMaxSelected?.(selected.length);
                            return;
                        }
                        setInputValue("");
                        const newOptions = [
                            ...selected,
                            { value, label: value },
                        ];
                        handleSelectionChange(newOptions);
                    }}>
                    {`Create "${inputValue}"`}
                </CommandItem>
            );

            // For normal creatable
            if (!onSearch && inputValue.length > 0) {
                return Item;
            }

            // For async search creatable
            if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
                return Item;
            }

            return null;
        }, [
            creatable,
            options,
            inputValue,
            selected,
            onSearch,
            debouncedSearchTerm,
            isLoading,
            maxSelected,
            onMaxSelected,
            handleSelectionChange,
        ]);

        // Memoized selectables
        const selectables = useMemo<GroupOption>(
            () => removePickedOption(options, selected),
            [options, selected]
        );

        // Memoized all options selected check
        const allOptionsSelected = useMemo(() => {
            const totalSelectable = Object.values(selectables).flat().length;
            return totalSelectable === 0;
        }, [selectables]);

        // Memoized empty item
        const EmptyItem = useMemo(() => {
            if (!emptyIndicator || allOptionsSelected) return null;

            if (onSearch && !creatable && Object.keys(options).length === 0) {
                return (
                    <CommandItem value="-" disabled>
                        {emptyIndicator}
                    </CommandItem>
                );
            }

            return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
        }, [allOptionsSelected, creatable, emptyIndicator, onSearch, options]);

        // Memoized command filter
        const commandFilter = useMemo(() => {
            if (commandProps?.filter) {
                return commandProps.filter;
            }

            if (creatable) {
                return (value: string, search: string) => {
                    return value.toLowerCase().includes(search.toLowerCase())
                        ? 1
                        : -1;
                };
            }

            return undefined;
        }, [creatable, commandProps?.filter]);

        // Improved select all handler
        const handleSelectAll = useCallback(() => {
            const selectableOptions = Object.values(selectables).flat();
            const availableSlots = maxSelected - selected.length;

            if (availableSlots <= 0) {
                onMaxSelected?.(maxSelected);
                return;
            }

            const toAdd = selectableOptions.slice(0, availableSlots);
            const newSelection = [...selected, ...toAdd];

            setInputValue("");
            handleSelectionChange(newSelection);
        }, [
            selectables,
            maxSelected,
            selected,
            onMaxSelected,
            handleSelectionChange,
        ]);

        // Clear all handler
        const handleClearAll = useCallback(() => {
            const fixedOptions = selected.filter((s) => s.fixed);
            handleSelectionChange(fixedOptions);
        }, [selected, handleSelectionChange]);

        return (
            <Command
                ref={dropdownRef}
                {...commandProps}
                onKeyDown={(e) => {
                    handleKeyDown(e);
                    commandProps?.onKeyDown?.(e);
                }}
                className={cn(
                    "h-auto overflow-visible bg-transparent",
                    commandProps?.className
                )}
                shouldFilter={
                    commandProps?.shouldFilter !== undefined
                        ? commandProps.shouldFilter
                        : !onSearch
                }
                filter={commandFilter}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox">
                <div
                    className={cn(
                        "border-input ring-offset-background focus-within:ring-ring min-h-10 rounded-md border text-base focus-within:ring-2 focus-within:ring-offset-2 md:text-sm",
                        {
                            "px-3 py-2": selected.length !== 0,
                            "cursor-text": !disabled && selected.length !== 0,
                        },
                        className
                    )}
                    onClick={() => {
                        if (disabled) return;
                        if (allOptionsSelected && !creatable) return;
                        inputRef?.current?.focus();
                    }}>
                    <div className="relative flex flex-wrap gap-1">
                        {(expanded ? selected : selected.slice(0, limit)).map(
                            (option) => (
                                <Badge
                                    key={option.value}
                                    className={cn(
                                        "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                                        "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                                        badgeClassName
                                    )}
                                    data-fixed={option.fixed}
                                    data-disabled={disabled || undefined}>
                                    {option.label}
                                    <button
                                        type="button"
                                        className={cn(
                                            "ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2",
                                            (disabled || option.fixed) &&
                                                "hidden"
                                        )}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUnselect(option);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={() => handleUnselect(option)}
                                        aria-label={`Remove ${option.label}`}>
                                        <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                                    </button>
                                </Badge>
                            )
                        )}

                        {/* Show +N badge if not expanded and there are more selected */}
                        {!expanded && selected.length > limit && (
                            <Badge
                                className={cn(
                                    "bg-muted-foreground text-muted hover:bg-muted-foreground/80 cursor-pointer",
                                    badgeClassName
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(true);
                                }}>
                                +{selected.length - limit}
                            </Badge>
                        )}

                        {/* Collapse button if expanded and more than limit */}
                        {expanded && selected.length > limit && (
                            <Badge
                                className={cn(
                                    "bg-muted-foreground text-muted hover:bg-muted-foreground/80 cursor-pointer",
                                    badgeClassName
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(false);
                                }}>
                                Show less
                            </Badge>
                        )}

                        {/* Input field */}
                        {(!allOptionsSelected || creatable) && (
                            <CommandPrimitive.Input
                                {...inputProps}
                                ref={inputRef}
                                value={inputValue}
                                disabled={disabled}
                                onValueChange={(value) => {
                                    setInputValue(value);
                                    inputProps?.onValueChange?.(value);
                                }}
                                onBlur={(event) => {
                                    if (!onScrollbar) {
                                        setOpen(false);
                                    }
                                    inputProps?.onBlur?.(event);
                                }}
                                onFocus={(event) => {
                                    setOpen(true);
                                    inputProps?.onFocus?.(event);
                                }}
                                placeholder={
                                    hidePlaceholderWhenSelected &&
                                    selected.length !== 0
                                        ? ""
                                        : placeholder
                                }
                                className={cn(
                                    "placeholder:text-muted-foreground flex-1 bg-transparent outline-none",
                                    {
                                        "w-full": hidePlaceholderWhenSelected,
                                        "px-3 py-2": selected.length === 0,
                                        "ml-1": selected.length !== 0,
                                        "cursor-not-allowed opacity-50":
                                            disabled,
                                    },
                                    inputProps?.className
                                )}
                                aria-label="Search options"
                            />
                        )}

                        {/* Clear all button */}
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className={cn(
                                "absolute right-0 h-6 w-6 p-0",
                                (hideClearAllButton ||
                                    disabled ||
                                    selected.length < 1 ||
                                    selected.filter((s) => s.fixed).length ===
                                        selected.length) &&
                                    "hidden"
                            )}
                            aria-label="Clear all selections">
                            <X />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {open && (!allOptionsSelected || creatable) && (
                        <CommandList
                            className="bg-popover text-popover-foreground animate-in absolute top-1 z-10 w-full rounded-md border shadow-md outline-none"
                            onMouseLeave={() => setOnScrollbar(false)}
                            onMouseEnter={() => setOnScrollbar(true)}
                            onMouseUp={() => inputRef?.current?.focus()}>
                            {isLoading ? (
                                <>{loadingIndicator}</>
                            ) : (
                                <>
                                    {EmptyItem}
                                    {CreatableItem}
                                    {!selectFirstItem && (
                                        <CommandItem
                                            value="-"
                                            className="hidden"
                                        />
                                    )}
                                    {!allOptionsSelected && (
                                        <CommandItem onSelect={handleSelectAll}>
                                            Select All
                                        </CommandItem>
                                    )}
                                    {Object.entries(selectables).map(
                                        ([key, dropdowns]) => (
                                            <CommandGroup
                                                key={key}
                                                heading={key}
                                                className="h-full overflow-auto">
                                                {dropdowns.map((option) => (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.label}
                                                        disabled={
                                                            option.disable
                                                        }
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        onSelect={() => {
                                                            if (
                                                                selected.length >=
                                                                maxSelected
                                                            ) {
                                                                onMaxSelected?.(
                                                                    selected.length
                                                                );
                                                                return;
                                                            }
                                                            setInputValue("");
                                                            const newOptions = [
                                                                ...selected,
                                                                option,
                                                            ];
                                                            handleSelectionChange(
                                                                newOptions
                                                            );
                                                        }}
                                                        className={cn(
                                                            "cursor-pointer",
                                                            option.disable &&
                                                                "text-muted-foreground cursor-default"
                                                        )}>
                                                        {option.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )
                                    )}
                                </>
                            )}
                        </CommandList>
                    )}
                </div>
            </Command>
        );
    }
);

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;
