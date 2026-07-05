"use client";

import * as React from "react";
import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown, Loader2, X } from "lucide-react";

import { createFilterOptions } from "@/components/ui/autocomplete-filter";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AutocompleteOption {
    value: string;
    label: string;
    disabled?: boolean;
    group?: string;
    [key: string]: unknown;
}

type OptionOrString = AutocompleteOption | string;

/** Normalise string | AutocompleteOption → AutocompleteOption */
function normalizeOption(opt: OptionOrString): AutocompleteOption {
    if (typeof opt === "string") return { value: opt, label: opt };
    return opt;
}

function normalizeOptions(opts: OptionOrString[]): AutocompleteOption[] {
    return opts.map(normalizeOption);
}

// default filter instance
const defaultFilter = createFilterOptions<AutocompleteOption>();

// ---------------------------------------------------------------------------
// Autocomplete props
// ---------------------------------------------------------------------------

type SingleValue = AutocompleteOption | null;
type MultipleValue = AutocompleteOption[];

interface AutocompleteBaseProps {
    /** The list of options. Accepts `string[]` or `AutocompleteOption[]`. */
    options: OptionOrString[];

    // ----- option accessors -----
    getOptionLabel?: (option: AutocompleteOption) => string;
    getOptionKey?: (option: AutocompleteOption) => string;
    isOptionEqualToValue?: (
        option: AutocompleteOption,
        value: AutocompleteOption
    ) => boolean;
    getOptionDisabled?: (option: AutocompleteOption) => boolean;
    groupBy?: (option: AutocompleteOption) => string;

    // ----- input -----
    inputValue?: string;
    onInputChange?: (
        value: string,
        reason: "input" | "reset" | "clear"
    ) => void;
    placeholder?: string;
    label?: string;

    // ----- behaviour -----
    freeSolo?: boolean;
    disableClearable?: boolean;
    disableCloseOnSelect?: boolean;
    clearOnBlur?: boolean;
    clearOnEscape?: boolean;
    selectOnFocus?: boolean;
    autoHighlight?: boolean;
    openOnFocus?: boolean;
    blurOnSelect?: boolean | "mouse" | "touch";
    readOnly?: boolean;
    disabled?: boolean;
    loading?: boolean;

    // ----- filtering -----
    filterOptions?: (
        options: AutocompleteOption[],
        state: {
            inputValue: string;
            getOptionLabel: (option: AutocompleteOption) => string;
        }
    ) => AutocompleteOption[];

    // ----- creatable -----
    creatable?: boolean;
    getCreatableLabel?: (inputValue: string) => string;

    // ----- rendering -----
    renderOption?: (
        option: AutocompleteOption,
        state: { selected: boolean; disabled: boolean; index: number }
    ) => React.ReactNode;
    renderGroup?: (params: {
        key: string;
        group: string;
        children: React.ReactNode;
    }) => React.ReactNode;
    renderValue?: (
        value: AutocompleteOption,
        onRemove: () => void
    ) => React.ReactNode;
    noOptionsText?: React.ReactNode;
    loadingText?: React.ReactNode;

    // ----- async -----
    onSearch?: (value: string) => Promise<AutocompleteOption[]>;
    onSearchSync?: (value: string) => AutocompleteOption[];
    searchDelay?: number;

    // ----- virtualization -----
    virtualized?: boolean;
    estimateSize?: number;

    // ----- sizing -----
    size?: "sm" | "default";

    // ----- events -----
    onOpen?: () => void;
    onClose?: () => void;

    // ----- style -----
    className?: string;
    popoverClassName?: string;
    inputClassName?: string;
}

interface AutocompleteSingleProps extends AutocompleteBaseProps {
    multiple?: false;
    value?: SingleValue;
    defaultValue?: SingleValue;
    onChange?: (value: SingleValue) => void;
    limitTags?: never;
    getLimitTagsText?: never;
}

interface AutocompleteMultipleProps extends AutocompleteBaseProps {
    multiple: true;
    value?: MultipleValue;
    defaultValue?: MultipleValue;
    onChange?: (value: MultipleValue) => void;
    limitTags?: number;
    getLimitTagsText?: (more: number) => React.ReactNode;
}

export type AutocompleteProps =
    | AutocompleteSingleProps
    | AutocompleteMultipleProps;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function Autocomplete(props: AutocompleteProps) {
    const {
        options: rawOptions,
        multiple = false,

        // option accessors
        getOptionLabel: getOptionLabelProp,
        getOptionKey: getOptionKeyProp,
        isOptionEqualToValue: isOptionEqualToValueProp,
        getOptionDisabled,
        groupBy,

        // value
        value: valueProp,
        defaultValue,
        onChange,

        // input
        inputValue: inputValueProp,
        onInputChange,
        placeholder,

        // behaviour
        freeSolo = false,
        disableClearable = false,
        disableCloseOnSelect: disableCloseOnSelectProp,
        clearOnBlur: clearOnBlurProp,
        clearOnEscape = false,
        selectOnFocus = false,
        // autoHighlight — reserved for future use (auto-highlight first item)
        openOnFocus = false,
        blurOnSelect = false,
        readOnly = false,
        disabled = false,
        loading = false,

        // filtering
        filterOptions: filterOptionsProp,

        // creatable
        creatable = false,
        getCreatableLabel = (v: string) => `Add "${v}"`,

        // rendering
        renderOption: renderOptionProp,
        renderGroup: renderGroupProp,
        renderValue: renderValueProp,
        noOptionsText = "No options",
        loadingText = "Loading…",

        // async
        onSearch,
        onSearchSync,
        searchDelay = 300,

        // virtualization
        virtualized = false,
        estimateSize = 36,

        // multi
        limitTags,
        getLimitTagsText = (more: number) => `+${more}`,

        // sizing
        size = "default",

        // events
        onOpen,
        onClose,

        // style
        className,
        popoverClassName,
        inputClassName,
    } = props;

    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    // normalise options
    const options = useMemo(() => normalizeOptions(rawOptions), [rawOptions]);

    // ----- accessors -----
    const getOptionLabel = useCallback(
        (opt: AutocompleteOption) =>
            getOptionLabelProp ? getOptionLabelProp(opt) : opt.label,
        [getOptionLabelProp]
    );

    const getOptionKey = useCallback(
        (opt: AutocompleteOption) =>
            getOptionKeyProp ? getOptionKeyProp(opt) : opt.value,
        [getOptionKeyProp]
    );

    const isOptionEqualToValue = useCallback(
        (a: AutocompleteOption, b: AutocompleteOption) =>
            isOptionEqualToValueProp
                ? isOptionEqualToValueProp(a, b)
                : a.value === b.value,
        [isOptionEqualToValueProp]
    );

    // ----- value state (controlled / uncontrolled) -----
    const isValueControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<
        SingleValue | MultipleValue
    >(() => {
        if (defaultValue !== undefined) return defaultValue;
        return multiple ? [] : null;
    });

    const value = isValueControlled ? valueProp! : internalValue;

    const setValue = useCallback(
        (next: SingleValue | MultipleValue) => {
            if (!isValueControlled) setInternalValue(next);
            if (multiple) {
                (onChange as AutocompleteMultipleProps["onChange"])?.(
                    next as MultipleValue
                );
            } else {
                (onChange as AutocompleteSingleProps["onChange"])?.(
                    next as SingleValue
                );
            }
        },
        [isValueControlled, multiple, onChange]
    );

    // helpers
    const selectedAsArray: AutocompleteOption[] = useMemo(
        () =>
            multiple
                ? (value as MultipleValue)
                : (value as SingleValue)
                  ? [value as AutocompleteOption]
                  : [],
        [value, multiple]
    );

    const isSelected = useCallback(
        (opt: AutocompleteOption) =>
            selectedAsArray.some((s) => isOptionEqualToValue(s, opt)),
        [selectedAsArray, isOptionEqualToValue]
    );

    // ----- input value state -----
    const isInputControlled = inputValueProp !== undefined;
    const [internalInputValue, setInternalInputValue] = useState(() => {
        if (!multiple && defaultValue) {
            return getOptionLabel(defaultValue as AutocompleteOption);
        }
        return "";
    });

    const inputValue = isInputControlled ? inputValueProp! : internalInputValue;

    const setInputValue = useCallback(
        (next: string, reason: "input" | "reset" | "clear") => {
            if (!isInputControlled) setInternalInputValue(next);
            onInputChange?.(next, reason);
        },
        [isInputControlled, onInputChange]
    );

    // ----- open state -----
    const [open, setOpen] = useState(false);

    const openPopover = useCallback(() => {
        if (disabled || readOnly) return;
        setOpen(true);
        onOpen?.();
    }, [disabled, readOnly, onOpen]);

    const closePopover = useCallback(() => {
        setOpen(false);
        onClose?.();
    }, [onClose]);

    // ----- async search -----
    const isAsync = !!onSearch || !!onSearchSync;
    const [asyncOptions, setAsyncOptions] = useState<AutocompleteOption[]>([]);
    const [asyncLoading, setAsyncLoading] = useState(false);
    const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        if (!isAsync || !open) return;

        const searchValue = inputValue;

        if (onSearchSync) {
            setAsyncOptions(onSearchSync(searchValue));
            return;
        }

        if (onSearch) {
            setAsyncLoading(true);
            clearTimeout(searchTimerRef.current);
            searchTimerRef.current = setTimeout(() => {
                onSearch(searchValue)
                    .then((results) => {
                        setAsyncOptions(results);
                    })
                    .finally(() => {
                        setAsyncLoading(false);
                    });
            }, searchDelay);
        }

        return () => clearTimeout(searchTimerRef.current);
    }, [inputValue, open, isAsync, onSearch, onSearchSync, searchDelay]);

    // ----- compute filtered options -----
    const baseOptions = isAsync ? asyncOptions : options;
    const isLoading = loading || asyncLoading;

    const filteredOptions = useMemo(() => {
        // when async, server already filtered — skip client filter
        if (isAsync) return baseOptions;

        const filterFn = filterOptionsProp ?? defaultFilter;
        return filterFn(baseOptions, { inputValue, getOptionLabel });
    }, [baseOptions, filterOptionsProp, inputValue, getOptionLabel, isAsync]);

    // ----- grouped options -----
    const groupedOptions = useMemo(() => {
        if (!groupBy) return [{ group: "", options: filteredOptions }];

        const map = new Map<string, AutocompleteOption[]>();
        for (const opt of filteredOptions) {
            const key = groupBy(opt);
            const existing = map.get(key);
            if (existing) existing.push(opt);
            else map.set(key, [opt]);
        }
        return Array.from(map.entries()).map(([group, options]) => ({
            group,
            options,
        }));
    }, [filteredOptions, groupBy]);

    // flat list for virtualization
    const flatItems = useMemo(() => {
        if (!virtualized) return [];
        const items: Array<
            | { type: "group"; group: string }
            | { type: "option"; option: AutocompleteOption; index: number }
        > = [];
        let globalIndex = 0;
        for (const g of groupedOptions) {
            if (g.group) items.push({ type: "group", group: g.group });
            for (const opt of g.options) {
                items.push({
                    type: "option",
                    option: opt,
                    index: globalIndex++,
                });
            }
        }
        return items;
    }, [groupedOptions, virtualized]);

    // creatable entry
    const showCreatable = useMemo(() => {
        if (!creatable || !inputValue.trim()) return false;
        return !filteredOptions.some(
            (opt) =>
                getOptionLabel(opt).toLowerCase() ===
                inputValue.trim().toLowerCase()
        );
    }, [creatable, inputValue, filteredOptions, getOptionLabel]);

    // ----- selection logic -----
    const handleSelect = useCallback(
        (opt: AutocompleteOption) => {
            if (getOptionDisabled?.(opt) || opt.disabled) return;

            if (multiple) {
                const current = value as MultipleValue;
                const exists = current.some((s) =>
                    isOptionEqualToValue(s, opt)
                );
                const next = exists
                    ? current.filter((s) => !isOptionEqualToValue(s, opt))
                    : [...current, opt];
                setValue(next);
                setInputValue("", "reset");
            } else {
                setValue(opt);
                setInputValue(getOptionLabel(opt), "reset");
            }

            const disableCloseOnSelect = disableCloseOnSelectProp ?? multiple;

            if (!disableCloseOnSelect) {
                closePopover();
            }

            if (blurOnSelect === true) {
                inputRef.current?.blur();
            }
        },
        [
            multiple,
            value,
            setValue,
            setInputValue,
            getOptionLabel,
            getOptionDisabled,
            isOptionEqualToValue,
            disableCloseOnSelectProp,
            closePopover,
            blurOnSelect,
        ]
    );

    const handleCreateOption = useCallback(() => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        const newOpt: AutocompleteOption = {
            value: trimmed,
            label: trimmed,
        };
        handleSelect(newOpt);
    }, [inputValue, handleSelect]);

    // ----- clear -----
    const handleClear = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (multiple) {
                setValue([]);
            } else {
                setValue(null);
            }
            setInputValue("", "clear");
            inputRef.current?.focus();
        },
        [multiple, setValue, setInputValue]
    );

    // ----- remove tag (multi) -----
    const handleRemoveTag = useCallback(
        (opt: AutocompleteOption) => {
            if (disabled || readOnly) return;
            const current = value as MultipleValue;
            setValue(current.filter((s) => !isOptionEqualToValue(s, opt)));
        },
        [value, setValue, isOptionEqualToValue, disabled, readOnly]
    );

    // ----- input handlers -----
    const handleInputChange = useCallback(
        (val: string) => {
            setInputValue(val, "input");
            if (!open) openPopover();

            // In single-select mode, typing clears the current selection
            // so the user can pick a new option (matches MUI behavior)
            if (!multiple && (value as SingleValue)) {
                setValue(null);
            }
        },
        [setInputValue, open, openPopover, multiple, value, setValue]
    );

    const handleInputFocus = useCallback(() => {
        if (selectOnFocus) inputRef.current?.select();
        if (openOnFocus) openPopover();
    }, [selectOnFocus, openOnFocus, openPopover]);

    const handleInputBlur = useCallback(() => {
        const clearOnBlur =
            clearOnBlurProp !== undefined ? clearOnBlurProp : !freeSolo;

        if (clearOnBlur && !multiple) {
            const selected = value as SingleValue;
            if (selected) {
                setInputValue(getOptionLabel(selected), "reset");
            } else {
                setInputValue("", "reset");
            }
        }
    }, [
        clearOnBlurProp,
        freeSolo,
        multiple,
        value,
        getOptionLabel,
        setInputValue,
    ]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") {
                if (clearOnEscape) {
                    e.preventDefault();
                    if (multiple) setValue([]);
                    else setValue(null);
                    setInputValue("", "clear");
                }
                closePopover();
                return;
            }

            // In freeSolo mode, Enter with text but no highlighted item
            // should accept the typed value
            if (e.key === "Enter" && freeSolo && inputValue.trim()) {
                // Let cmdk handle if an item is highlighted
                // This gets picked up by cmdk's own Enter handling when an item is selected
                // If nothing is highlighted + freeSolo, we accept the text value
                // cmdk will handle selection if a command item is highlighted
            }

            // Backspace on empty input in multi mode → remove last tag
            if (
                e.key === "Backspace" &&
                multiple &&
                !inputValue &&
                selectedAsArray.length > 0
            ) {
                const last = selectedAsArray[selectedAsArray.length - 1];
                handleRemoveTag(last);
            }
        },
        [
            clearOnEscape,
            closePopover,
            freeSolo,
            inputValue,
            multiple,
            selectedAsArray,
            setValue,
            setInputValue,
            handleRemoveTag,
        ]
    );

    // Sync input value when single value changes externally
    useEffect(() => {
        if (!multiple && !isInputControlled) {
            const selected = value as SingleValue;
            if (selected && !open) {
                setInternalInputValue(getOptionLabel(selected));
            } else if (!selected && !open) {
                setInternalInputValue("");
            }
        }
    }, [value, multiple, isInputControlled, getOptionLabel, open]);

    // ----- sizing -----
    const sizeClasses = size === "sm" ? "min-h-8 text-xs" : "min-h-9 text-sm";
    const badgeSize = size === "sm" ? "sm" : "md";
    const iconSize = size === "sm" ? "size-3" : "size-4";

    const hasValue = multiple
        ? (value as MultipleValue).length > 0
        : !!(value as SingleValue);

    const showClear = !disableClearable && !disabled && !readOnly && hasValue;

    // ----- multi: limit tags -----
    const visibleTags = useMemo(() => {
        if (!multiple) return [];
        const tags = value as MultipleValue;
        if (limitTags !== undefined && limitTags >= 0 && !open) {
            return tags.slice(0, limitTags);
        }
        return tags;
    }, [multiple, value, limitTags, open]);

    const hiddenTagCount = useMemo(() => {
        if (!multiple || limitTags === undefined || limitTags < 0) return 0;
        const total = (value as MultipleValue).length;
        return open ? 0 : Math.max(0, total - limitTags);
    }, [multiple, value, limitTags, open]);

    // ----- virtualization -----
    const parentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: flatItems.length,
        getScrollElement: () => parentRef.current,
        estimateSize: (index) => {
            const item = flatItems[index];
            if (item?.type === "group") return 28;
            return estimateSize;
        },
        overscan: 5,
        enabled: virtualized && open,
    });

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    const renderOptionDefault = (
        opt: AutocompleteOption,
        state: { selected: boolean; disabled: boolean; index: number }
    ) => {
        if (renderOptionProp) return renderOptionProp(opt, state);
        return (
            <span className="flex items-center gap-2 truncate">
                {multiple && (
                    <span
                        className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                            state.selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30"
                        )}>
                        {state.selected && <Check className="size-3" />}
                    </span>
                )}
                {!multiple && state.selected && (
                    <Check className={cn(iconSize, "shrink-0")} />
                )}
                <span className="truncate">{getOptionLabel(opt)}</span>
            </span>
        );
    };

    const renderGroupDefault = (params: {
        key: string;
        group: string;
        children: React.ReactNode;
    }) => {
        if (renderGroupProp) return renderGroupProp(params);
        return (
            <div key={params.key} role="group">
                <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                    {params.group}
                </div>
                {params.children}
            </div>
        );
    };

    const renderTag = (opt: AutocompleteOption) => {
        if (renderValueProp) {
            return renderValueProp(opt, () => handleRemoveTag(opt));
        }
        return (
            <Badge
                key={getOptionKey(opt)}
                variant="flat"
                size={badgeSize}
                className="max-w-48 min-w-0 shrink [&>span]:min-w-0 [&>span]:truncate [&>span]:overflow-hidden"
                onClose={
                    disabled || readOnly
                        ? undefined
                        : () => handleRemoveTag(opt)
                }>
                <span className="truncate">{getOptionLabel(opt)}</span>
            </Badge>
        );
    };

    // Options list rendering (non-virtualized)
    const renderOptionsList = () => {
        if (isLoading) {
            return (
                <div className="text-muted-foreground py-6 text-center text-sm">
                    <Loader2 className="mx-auto mb-2 size-4 animate-spin" />
                    {loadingText}
                </div>
            );
        }

        const hasOptions = filteredOptions.length > 0 || showCreatable;

        if (!hasOptions) {
            return (
                <div className="text-muted-foreground py-6 text-center text-sm">
                    {noOptionsText}
                </div>
            );
        }

        if (virtualized) {
            return (
                <div
                    ref={parentRef}
                    className="max-h-75 overflow-x-hidden overflow-y-auto">
                    <div
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: "100%",
                            position: "relative",
                        }}>
                        {virtualizer.getVirtualItems().map((virtualRow) => {
                            const item = flatItems[virtualRow.index];
                            if (!item) return null;

                            if (item.type === "group") {
                                return (
                                    <div
                                        key={`group-${item.group}`}
                                        className="text-muted-foreground absolute top-0 left-0 w-full px-2 py-1.5 text-xs font-medium"
                                        style={{
                                            transform: `translateY(${virtualRow.start}px)`,
                                            height: `${virtualRow.size}px`,
                                        }}>
                                        {item.group}
                                    </div>
                                );
                            }

                            const opt = item.option;
                            const optDisabled =
                                opt.disabled ||
                                (getOptionDisabled?.(opt) ?? false);
                            const selected = isSelected(opt);

                            return (
                                <div
                                    key={getOptionKey(opt)}
                                    role="option"
                                    aria-selected={selected}
                                    aria-disabled={optDisabled}
                                    data-disabled={optDisabled || undefined}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        if (!optDisabled) handleSelect(opt);
                                    }}
                                    className={cn(
                                        "absolute top-0 left-0 flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        optDisabled &&
                                            "pointer-events-none opacity-50"
                                    )}
                                    style={{
                                        transform: `translateY(${virtualRow.start}px)`,
                                        height: `${virtualRow.size}px`,
                                    }}>
                                    {renderOptionDefault(opt, {
                                        selected,
                                        disabled: optDisabled,
                                        index: item.index,
                                    })}
                                </div>
                            );
                        })}
                    </div>
                    {showCreatable && (
                        <div
                            role="option"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleCreateOption();
                            }}
                            className="hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none">
                            {getCreatableLabel(inputValue.trim())}
                        </div>
                    )}
                </div>
            );
        }

        // non-virtualized
        return (
            <CommandPrimitive.List className="max-h-75 scroll-py-1 overflow-x-hidden overflow-y-auto">
                {groupedOptions.map((group) => {
                    const items = group.options.map((opt, i) => {
                        const optDisabled =
                            opt.disabled || (getOptionDisabled?.(opt) ?? false);
                        const selected = isSelected(opt);

                        return (
                            <CommandPrimitive.Item
                                key={getOptionKey(opt)}
                                value={getOptionLabel(opt)}
                                disabled={optDisabled}
                                onSelect={() => handleSelect(opt)}
                                className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50">
                                {renderOptionDefault(opt, {
                                    selected,
                                    disabled: optDisabled,
                                    index: i,
                                })}
                            </CommandPrimitive.Item>
                        );
                    });

                    if (group.group) {
                        return renderGroupDefault({
                            key: group.group,
                            group: group.group,
                            children: items,
                        });
                    }

                    return items;
                })}

                {showCreatable && (
                    <CommandPrimitive.Item
                        value={inputValue}
                        onSelect={handleCreateOption}
                        className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none">
                        {getCreatableLabel(inputValue.trim())}
                    </CommandPrimitive.Item>
                )}
            </CommandPrimitive.List>
        );
    };

    // ----- click outside to close -----
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                closePopover();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, closePopover]);

    return (
        <CommandPrimitive
            data-slot="autocomplete"
            shouldFilter={false}
            loop
            className={cn("relative w-full", className)}
            ref={wrapperRef}>
            {/* Trigger / input area */}
            <div
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-owns={`${id}-listbox`}
                data-slot="autocomplete-trigger"
                className={cn(
                    "border-input dark:bg-input flex w-full flex-wrap items-center gap-1 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow]",
                    "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[1px]",
                    sizeClasses,
                    disabled &&
                        "pointer-events-none cursor-not-allowed opacity-50",
                    readOnly && "pointer-events-none"
                )}
                onClick={() => {
                    if (!disabled && !readOnly) {
                        inputRef.current?.focus();
                        if (!open) openPopover();
                    }
                }}>
                {/* Multi-select tags */}
                {multiple && (
                    <>
                        {visibleTags.map(renderTag)}
                        {hiddenTagCount > 0 && (
                            <span className="text-muted-foreground text-xs">
                                {getLimitTagsText(hiddenTagCount)}
                            </span>
                        )}
                    </>
                )}

                {/* Input */}
                <CommandPrimitive.Input
                    ref={inputRef}
                    data-slot="autocomplete-input"
                    value={inputValue}
                    onValueChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        multiple && selectedAsArray.length > 0
                            ? undefined
                            : placeholder
                    }
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-controls={`${id}-listbox`}
                    aria-autocomplete={freeSolo ? "list" : "both"}
                    className={cn(
                        "placeholder:text-muted-foreground min-w-20 flex-1 bg-transparent outline-none disabled:cursor-not-allowed",
                        size === "sm" ? "text-xs" : "text-sm",
                        inputClassName
                    )}
                />

                {/* End adornments */}
                <div className="flex shrink-0 items-center gap-0.5">
                    {isLoading && (
                        <Loader2
                            className={cn(
                                iconSize,
                                "text-muted-foreground animate-spin"
                            )}
                        />
                    )}
                    {showClear && (
                        <button
                            type="button"
                            onClick={handleClear}
                            tabIndex={-1}
                            aria-label="Clear"
                            className="hover:bg-accent hover:text-accent-foreground rounded-sm p-0.5">
                            <X className={iconSize} />
                        </button>
                    )}
                    <ChevronDown
                        className={cn(
                            iconSize,
                            "text-muted-foreground transition-transform",
                            open && "rotate-180"
                        )}
                    />
                </div>
            </div>

            {/* Dropdown */}
            {open && (
                <div
                    id={`${id}-listbox`}
                    role="listbox"
                    data-slot="autocomplete-content"
                    onMouseDown={(e) => e.preventDefault()}
                    className={cn(
                        "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md",
                        popoverClassName
                    )}>
                    {renderOptionsList()}
                </div>
            )}
        </CommandPrimitive>
    );
}

Autocomplete.displayName = "Autocomplete";

export { Autocomplete };
export type { AutocompleteOption as AutocompleteOptionType };
