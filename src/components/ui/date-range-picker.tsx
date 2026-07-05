"use client";

import React, {
    ReactElement,
    useEffect,
    useRef,
    useState,
    type FC,
} from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { DateInput } from "./date-input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";
import { Switch } from "./switch";

export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
    /** Initial value for start date */
    initialDateFrom?: Date | string;
    /** Initial value for end date */
    initialDateTo?: Date | string;
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string;
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string;
    /** Initial date range (alternative to individual from/to props) */
    initialDateRange?: DateRange;
    /** Alignment of popover */
    align?: "start" | "center" | "end";
    /** Option for locale */
    locale?: string;
    /** Option for showing compare feature */
    showCompare?: boolean;
    /** Custom presets to override default ones */
    customPresets?: Preset[];
    /** Whether to show presets */
    showPresets?: boolean;
    /** Custom date formatter function */
    formatDate?: (date: Date, locale?: string) => string;
    /** Custom button content renderer */
    renderTrigger?: (props: {
        range: DateRange;
        rangeCompare?: DateRange;
        isOpen: boolean;
        locale: string;
        formatDate: (date: Date, locale?: string) => string;
    }) => React.ReactNode;
    /** Custom class names for styling */
    classNames?: {
        trigger?: string;
        popover?: string;
        calendar?: string;
        presetButton?: string;
        presetContainer?: string;
        dateInputContainer?: string;
        compareContainer?: string;
        buttonContainer?: string;
    };
    /** Custom text labels */
    labels?: {
        compare?: string;
        cancel?: string;
        update?: string;
        selectPlaceholder?: string;
    };
    /** Number of months to display in calendar */
    numberOfMonths?: number;
    /** Whether to show the date inputs */
    showDateInputs?: boolean;
    /** Button variant for trigger */
    triggerVariant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    /** Button size for trigger */
    triggerSize?: "sm" | "md" | "lg" | "icon";
    /** Disable past dates */
    disablePastDates?: boolean;
    /** Disable future dates */
    disableFutureDates?: boolean;
    /** Custom min/max dates */
    minDate?: Date;
    maxDate?: Date;
}

const formatDate = (date: Date, locale: string = "en-us"): string => {
    return date.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const PresetButton = ({
    preset,
    label,
    isSelected,
    setPreset,
    getPresetRange,
    isRangeWithinConstraints,
    classNames,
}: {
    preset: string;
    label: string;
    isSelected: boolean;
    setPreset: (preset: string) => void;
    getPresetRange: (presetName: string) => DateRange;
    isRangeWithinConstraints: (range: DateRange) => boolean;
    classNames: DateRangePickerProps["classNames"];
}): ReactElement => {
    // Check if this preset would create a valid range within constraints
    const presetRange = getPresetRange(preset);
    const isPresetValid = isRangeWithinConstraints(presetRange);

    return (
        <Button
            className={cn(
                isSelected && "pointer-events-none",
                classNames?.presetButton
            )}
            variant="ghost"
            disabled={!isPresetValid}
            onClick={() => {
                setPreset(preset);
            }}>
            <>
                <span
                    className={cn(
                        "pr-2 opacity-0",
                        isSelected && "opacity-70"
                    )}>
                    <CheckIcon width={18} height={18} />
                </span>
                {label}
            </>
        </Button>
    );
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
    if (typeof dateInput === "string") {
        // Split the date string to get year, month, and day parts
        // eslint-disable-next-line radix
        const parts = dateInput.split("-").map((part) => parseInt(part, 10));
        // Create a new Date object using the local timezone
        // Note: Month is 0-indexed, so subtract 1 from the month part
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date;
    }
    // If dateInput is already a Date object, return it directly
    return dateInput;
};

export interface DateRange {
    from: Date;
    to: Date | undefined;
}

interface Preset {
    name: string;
    label: string;
    /** Custom function to calculate the date range for this preset */
    dateRange?: () => DateRange;
}

// Define presets
const PRESETS: Preset[] = [
    { name: "today", label: "Today" },
    { name: "yesterday", label: "Yesterday" },
    { name: "last7", label: "Last 7 days" },
    { name: "last14", label: "Last 14 days" },
    { name: "last30", label: "Last 30 days" },
    { name: "thisWeek", label: "This Week" },
    { name: "lastWeek", label: "Last Week" },
    { name: "thisMonth", label: "This Month" },
    { name: "lastMonth", label: "Last Month" },
];

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> = ({
    initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
    initialDateTo,
    initialCompareFrom,
    initialCompareTo,
    initialDateRange,
    onUpdate,
    align = "end",
    locale = "en-US",
    showCompare = true,
    customPresets,
    showPresets = true,
    formatDate: customFormatDate,
    renderTrigger,
    classNames = {},
    labels = {},
    numberOfMonths,
    showDateInputs = true,
    triggerVariant = "outline",
    triggerSize = "md",
    disablePastDates = false,
    disableFutureDates = false,
    minDate,
    maxDate,
}): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);

    // Use customPresets if provided, otherwise use default PRESETS
    const presets = customPresets || PRESETS;

    // Use custom format function if provided, otherwise use default
    const dateFormatter = customFormatDate || formatDate;

    // Helper function to create a valid initial range
    const createValidInitialRange = (): DateRange => {
        let fromDate: Date;
        let toDate: Date;

        if (initialDateRange) {
            fromDate = getDateAdjustedForTimezone(initialDateRange.from);
            toDate = initialDateRange.to
                ? getDateAdjustedForTimezone(initialDateRange.to)
                : getDateAdjustedForTimezone(initialDateRange.from);
        } else {
            fromDate = getDateAdjustedForTimezone(initialDateFrom);
            toDate = initialDateTo
                ? getDateAdjustedForTimezone(initialDateTo)
                : getDateAdjustedForTimezone(initialDateFrom);
        }

        // Ensure from is not after to
        if (fromDate > toDate) {
            [fromDate, toDate] = [toDate, fromDate];
        }

        return { from: fromDate, to: toDate };
    };

    const [range, setRange] = useState<DateRange>(createValidInitialRange);

    const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
        () => {
            if (initialCompareFrom) {
                const fromDate = new Date(
                    new Date(initialCompareFrom).setHours(0, 0, 0, 0)
                );
                const toDate = initialCompareTo
                    ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
                    : new Date(
                          new Date(initialCompareFrom).setHours(0, 0, 0, 0)
                      );

                // Ensure from is not after to
                if (fromDate > toDate) {
                    return { from: toDate, to: fromDate };
                }

                return { from: fromDate, to: toDate };
            }
            return undefined;
        }
    );

    // Refs to store the values of range and rangeCompare when the date picker is opened
    const openedRangeRef = useRef<DateRange | undefined>(null);
    const openedRangeCompareRef = useRef<DateRange | undefined>(null);

    const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
        undefined
    );

    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== "undefined" ? window.innerWidth < 960 : false
    );

    useEffect(() => {
        const handleResize = (): void => {
            setIsSmallScreen(window.innerWidth < 960);
        };

        window.addEventListener("resize", handleResize);

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const getPresetRange = (presetName: string): DateRange => {
        const preset = presets.find(({ name }) => name === presetName);
        if (!preset)
            throw new Error(`Unknown date range preset: ${presetName}`);

        // If the preset has a custom dateRange function, use it
        if (preset.dateRange) {
            return preset.dateRange();
        }

        // Otherwise, use the built-in preset logic for backward compatibility
        const from = new Date();
        const to = new Date();

        switch (preset.name) {
            case "today":
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case "yesterday":
                from.setDate(from.getDate() - 1);
                from.setHours(0, 0, 0, 0);
                to.setDate(to.getDate() - 1);
                to.setHours(23, 59, 59, 999);
                break;
            case "last7":
                from.setDate(from.getDate() - 6);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case "last14":
                from.setDate(from.getDate() - 13);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case "last30":
                from.setDate(from.getDate() - 29);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case "thisWeek": {
                // Calculate the start of the current week (Sunday)
                const daysFromSunday = from.getDay();
                from.setDate(from.getDate() - daysFromSunday);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            }
            case "lastWeek": {
                // Calculate last week's date range (Sunday to Saturday)
                const currentDay = from.getDay();
                const startOfLastWeek = new Date(from);
                startOfLastWeek.setDate(from.getDate() - currentDay - 7);
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);

                from.setTime(startOfLastWeek.getTime());
                from.setHours(0, 0, 0, 0);
                to.setTime(endOfLastWeek.getTime());
                to.setHours(23, 59, 59, 999);
                break;
            }
            case "thisMonth":
                from.setDate(1);
                from.setHours(0, 0, 0, 0);
                // Set 'to' to the last day of current month
                to.setMonth(to.getMonth() + 1, 0); // Next month, day 0 = last day of current month
                to.setHours(23, 59, 59, 999);
                break;
            case "lastMonth":
                from.setMonth(from.getMonth() - 1);
                from.setDate(1);
                from.setHours(0, 0, 0, 0);
                to.setDate(0); // This sets to last day of previous month
                to.setHours(23, 59, 59, 999);
                break;
            default:
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
        }

        return { from, to };
    };

    const setPreset = (preset: string): void => {
        const newRange = getPresetRange(preset);

        if (isRangeWithinConstraints(newRange)) {
            setRange(newRange);

            let newCompare = rangeCompare;

            if (rangeCompare) {
                newCompare = {
                    from: new Date(
                        newRange.from.getFullYear() - 1,
                        newRange.from.getMonth(),
                        newRange.from.getDate()
                    ),
                    to: newRange.to
                        ? new Date(
                              newRange.to.getFullYear() - 1,
                              newRange.to.getMonth(),
                              newRange.to.getDate()
                          )
                        : undefined,
                };

                setRangeCompare(newCompare);
            }

            onUpdate?.({
                range: newRange,
                rangeCompare: newCompare,
            });

            setIsOpen(false);
        }
    };
    const checkPreset = (): void => {
        for (let i = 0; i < presets.length; i++) {
            const preset = presets[i];
            const presetRange = getPresetRange(preset.name);

            const normalizedRangeFrom = new Date(range.from);
            normalizedRangeFrom.setHours(0, 0, 0, 0);
            const normalizedPresetFrom = new Date(
                presetRange.from.setHours(0, 0, 0, 0)
            );

            const normalizedRangeTo = new Date(range.to ?? 0);
            normalizedRangeTo.setHours(0, 0, 0, 0);
            const normalizedPresetTo = new Date(
                presetRange.to?.setHours(0, 0, 0, 0) ?? 0
            );

            if (
                normalizedRangeFrom.getTime() ===
                    normalizedPresetFrom.getTime() &&
                normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
            ) {
                setSelectedPreset(preset.name);
                return;
            }
        }

        setSelectedPreset(undefined);
    };

    const resetValues = (): void => {
        // Reset to the initial valid range
        setRange(createValidInitialRange());

        // Reset compare range if it was initially provided
        if (initialCompareFrom) {
            const fromDate = new Date(
                new Date(initialCompareFrom).setHours(0, 0, 0, 0)
            );
            const toDate = initialCompareTo
                ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
                : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0));

            // Ensure from is not after to
            if (fromDate > toDate) {
                setRangeCompare({ from: toDate, to: fromDate });
            } else {
                setRangeCompare({ from: fromDate, to: toDate });
            }
        } else {
            setRangeCompare(undefined);
        }
    };

    useEffect(() => {
        checkPreset();
    }, [range]);

    const areRangesEqual = (
        a?: DateRange | null,
        b?: DateRange | null
    ): boolean => {
        if (!a || !b) return a === b;

        const fromEqual = a.from.getTime() === b.from.getTime();

        const toEqual = Boolean(
            (!a.to && !b.to) ||
            (a.to && b.to && a.to.getTime() === b.to.getTime())
        );

        return fromEqual && toEqual;
    };
    // Helper function to validate if a date range is valid
    const isValidRange = (range: DateRange): boolean => {
        return Boolean(range.from && range.to && range.from <= range.to);
    };

    // Helper function to validate if a date is within constraints
    const isDateWithinConstraints = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        if (disablePastDates && checkDate < today) return false;
        if (disableFutureDates && checkDate > today) return false;
        if (minDate) {
            const minDateNormalized = new Date(minDate);
            minDateNormalized.setHours(0, 0, 0, 0);
            if (checkDate < minDateNormalized) return false;
        }
        if (maxDate) {
            const maxDateNormalized = new Date(maxDate);
            maxDateNormalized.setHours(0, 0, 0, 0);
            if (checkDate > maxDateNormalized) return false;
        }
        return true;
    };

    // Helper function to validate if a range is within constraints
    const isRangeWithinConstraints = (range: DateRange): boolean => {
        if (!range.from || !range.to) return false;
        return (
            isDateWithinConstraints(range.from) &&
            isDateWithinConstraints(range.to)
        );
    };

    // Enhanced validation that checks both validity and constraints
    const isValidAndConstrainedRange = (range: DateRange): boolean => {
        return isValidRange(range) && isRangeWithinConstraints(range);
    };

    useEffect(() => {
        if (isOpen) {
            openedRangeRef.current = range;
            openedRangeCompareRef.current = rangeCompare;
        }
    }, [isOpen]);

    return (
        <Popover
            modal
            open={isOpen}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    const hasMainChanged = !areRangesEqual(
                        openedRangeRef.current,
                        range
                    );

                    const hasCompareChanged = !areRangesEqual(
                        openedRangeCompareRef.current,
                        rangeCompare
                    );

                    if (hasMainChanged || hasCompareChanged) {
                        onUpdate?.({
                            range,
                            rangeCompare,
                        });
                    }
                }

                setIsOpen(open);
            }}>
            <PopoverTrigger asChild>
                {renderTrigger ? (
                    <div>
                        {renderTrigger({
                            range,
                            rangeCompare,
                            isOpen,
                            locale,
                            formatDate: dateFormatter,
                        })}
                    </div>
                ) : (
                    <Button
                        size={triggerSize}
                        variant={triggerVariant}
                        className={cn(classNames.trigger)}>
                        <div className="text-right">
                            <div className="py-1">
                                <div>{`${dateFormatter(range.from, locale)}${
                                    range.to != null
                                        ? ` - ${dateFormatter(
                                              range.to,
                                              locale
                                          )}`
                                        : ""
                                }`}</div>
                            </div>
                            {rangeCompare != null && (
                                <div className="-mt-1 text-xs opacity-60">
                                    vs.{" "}
                                    {dateFormatter(rangeCompare.from, locale)}
                                    {rangeCompare.to != null
                                        ? ` - ${dateFormatter(
                                              rangeCompare.to,
                                              locale
                                          )}`
                                        : ""}
                                </div>
                            )}
                        </div>
                        <div className="-mr-2 scale-125 pl-1 opacity-60">
                            {isOpen ? (
                                <ChevronUpIcon width={24} />
                            ) : (
                                <ChevronDownIcon width={24} />
                            )}
                        </div>
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                className={cn("w-auto p-0", classNames.popover)}>
                <div className="flex flex-col">
                    <div className="flex flex-col gap-3 border-b p-4">
                        {/* Compare Toggle */}
                        {showCompare && (
                            <div className="flex items-center justify-center gap-2">
                                <Switch
                                    checked={Boolean(rangeCompare)}
                                    onCheckedChange={(checked: boolean) => {
                                        if (checked) {
                                            if (!range.to) {
                                                setRange({
                                                    from: range.from,
                                                    to: range.from,
                                                });
                                            }

                                            setRangeCompare({
                                                from: new Date(
                                                    range.from.getFullYear() -
                                                        1,
                                                    range.from.getMonth(),
                                                    range.from.getDate()
                                                ),
                                                to: range.to
                                                    ? new Date(
                                                          range.to.getFullYear() -
                                                              1,
                                                          range.to.getMonth(),
                                                          range.to.getDate()
                                                      )
                                                    : new Date(
                                                          range.from.getFullYear() -
                                                              1,
                                                          range.from.getMonth(),
                                                          range.from.getDate()
                                                      ),
                                            });
                                        } else {
                                            setRangeCompare(undefined);
                                        }
                                    }}
                                />
                                <Label>{labels.compare || "Compare"}</Label>
                            </div>
                        )}

                        {/* Date Inputs */}
                        {showDateInputs && (
                            <div className="flex items-center justify-center gap-2">
                                <DateInput
                                    value={range.from}
                                    onChange={(date) => {
                                        if (isDateWithinConstraints(date)) {
                                            const toDate =
                                                range.to && range.to >= date
                                                    ? range.to
                                                    : date;

                                            setRange((prev) => ({
                                                ...prev,
                                                from: date,
                                                to: toDate,
                                            }));
                                        }
                                    }}
                                />

                                <span className="text-muted-foreground">—</span>

                                <DateInput
                                    value={range.to}
                                    onChange={(date) => {
                                        if (isDateWithinConstraints(date)) {
                                            const fromDate =
                                                range.from <= date
                                                    ? range.from
                                                    : date;

                                            setRange((prev) => ({
                                                ...prev,
                                                from: fromDate,
                                                to: date,
                                            }));
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {isSmallScreen && showPresets && (
                            <div className="flex justify-center">
                                <Select
                                    value={selectedPreset}
                                    onValueChange={(value) => setPreset(value)}>
                                    <SelectTrigger className="w-45">
                                        <SelectValue
                                            placeholder={
                                                labels.selectPlaceholder ||
                                                "Select preset"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {presets.map((preset) => (
                                            <SelectItem
                                                key={preset.name}
                                                value={preset.name}>
                                                {preset.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="flex">
                        <div className="p-2">
                            <Calendar
                                mode="range"
                                onSelect={(value) => {
                                    if (value?.from != null) {
                                        let fromDate = value.from;
                                        let toDate = value.to ?? value.from;

                                        if (fromDate > toDate) {
                                            [fromDate, toDate] = [
                                                toDate,
                                                fromDate,
                                            ];
                                        }

                                        if (
                                            isDateWithinConstraints(fromDate) &&
                                            isDateWithinConstraints(toDate)
                                        ) {
                                            const newRange = {
                                                from: fromDate,
                                                to: toDate,
                                            };

                                            setRange(newRange);
                                        }
                                    }
                                }}
                                selected={range}
                                numberOfMonths={
                                    numberOfMonths || (isSmallScreen ? 1 : 2)
                                }
                                defaultMonth={range?.from}
                                className={cn(classNames.calendar)}
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);

                                    const checkDate = new Date(date);
                                    checkDate.setHours(0, 0, 0, 0);

                                    if (disablePastDates && checkDate < today)
                                        return true;
                                    if (disableFutureDates && checkDate > today)
                                        return true;
                                    if (minDate && checkDate < minDate)
                                        return true;
                                    if (maxDate && checkDate > maxDate)
                                        return true;

                                    return false;
                                }}
                            />
                        </div>

                        {!isSmallScreen && showPresets && (
                            <div className="max-h-80 w-35 overflow-y-auto border-l px-0 py-1">
                                <div className="flex flex-col gap-1">
                                    {presets.map((preset) => (
                                        <PresetButton
                                            key={preset.name}
                                            preset={preset.name}
                                            label={preset.label}
                                            isSelected={
                                                selectedPreset === preset.name
                                            }
                                            setPreset={setPreset}
                                            getPresetRange={getPresetRange}
                                            isRangeWithinConstraints={
                                                isRangeWithinConstraints
                                            }
                                            classNames={classNames}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

DateRangePicker.displayName = "DateRangePicker";
