import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import {
    AsYouType,
    CountryCode,
    getCountries,
    getCountryCallingCode,
    parsePhoneNumberWithError,
} from "libphonenumber-js";
import { Check, Globe, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, // <-- Make sure this is imported
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// This is a built-in Browser tool to get country names in any language
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const ALL_COUNTRY_CODES = getCountries();

// Generate a full list automatically
const COUNTRY_DATA = ALL_COUNTRY_CODES.reduce(
    (acc, code) => {
        try {
            acc[code] = {
                name: regionNames.of(code) || code,
            };
        } catch {
            acc[code] = { name: code };
        }
        return acc;
    },
    {} as Record<string, { name: string }>
);

// Then in your component:
const ALL_COUNTRIES = ALL_COUNTRY_CODES;

const phoneInputVariants = cva(
    "flex w-full min-w-0 rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[1px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    {
        variants: {
            size: {
                sm: "h-8 text-xs",
                md: "h-9 text-sm",
                lg: "h-11 text-base",
            },
            disabled: {
                true: "bg-muted cursor-not-allowed opacity-50 pointer-events-none",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);
export interface PhoneNumberInputProps extends VariantProps<
    typeof phoneInputVariants
> {
    value?: string;
    defaultCountry?: CountryCode;
    onChange?: (value: string, isValid: boolean, country: string) => void;
    onBlur?: () => void;
    disabled?: boolean;
    disabledCountrySelect?: boolean;
    placeholder?: string;
    className?: string;
    error?: boolean;
    errorMessage?: string;
}
export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
    value = "",
    defaultCountry = "US",
    onChange,
    onBlur,
    disabled = false,
    disabledCountrySelect = false,
    placeholder = "Enter phone number",
    className,
    error = false,
    errorMessage,
    size = "md",
}) => {
    const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [open, setOpen] = useState(false);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const lastEmittedValue = useRef<string | null>(null);

    // Initialize phone number from value
    useEffect(() => {
        // FIX: If the incoming value is exactly what we just emitted, do nothing!
        // This prevents the active typing format from being overwritten.
        if (value === lastEmittedValue.current) return;

        if (value) {
            try {
                const parsed = parsePhoneNumberWithError(value);
                if (parsed) {
                    const country = parsed.country || defaultCountry;
                    setSelectedCountry(country);

                    // FIX: Ensure the initial loaded value is nicely formatted, not just raw digits
                    const formatter = new AsYouType(country);
                    const formatted = formatter.input(parsed.nationalNumber);
                    setPhoneNumber(formatted);

                    lastEmittedValue.current = value;
                } else {
                    setPhoneNumber(value);
                }
            } catch {
                setPhoneNumber(value);
            }
        } else {
            setPhoneNumber("");
            lastEmittedValue.current = "";
        }
    }, [value, defaultCountry]);

    // Format phone number as user types
    const handlePhoneNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        let inputValue = e.target.value;

        // --- BACKSPACE/DELETE FIX ---
        // Check if the user is deleting at the very end of the string
        const isDeletingAtEnd =
            phoneNumber.length > inputValue.length &&
            phoneNumber.startsWith(inputValue);

        if (isDeletingAtEnd) {
            const previousDigits = phoneNumber.replace(/\D/g, "");
            const currentDigits = inputValue.replace(/\D/g, "");

            // If deleting a character didn't change the number of digits,
            // it means they deleted a formatting character (like a space or ')').
            if (previousDigits === currentDigits) {
                // Find and remove the last digit from the input string
                let lastDigitIndex = -1;
                for (let i = inputValue.length - 1; i >= 0; i--) {
                    if (/\d/.test(inputValue[i])) {
                        lastDigitIndex = i;
                        break;
                    }
                }

                if (lastDigitIndex !== -1) {
                    // Splice out the last digit
                    inputValue =
                        inputValue.slice(0, lastDigitIndex) +
                        inputValue.slice(lastDigitIndex + 1);
                }
            }
        }
        // ------------------------------

        // Use AsYouType formatter for auto-masking with the adjusted input
        const formatter = new AsYouType(selectedCountry);
        const formatted = formatter.input(inputValue);

        setPhoneNumber(formatted);

        // Validate and notify parent
        try {
            const fullNumber = `+${getCountryCallingCode(selectedCountry)}${inputValue.replace(/\D/g, "")}`;
            const parsed = parsePhoneNumberWithError(fullNumber);
            const isValid = parsed ? parsed.isValid() : false;

            onChange?.(fullNumber, isValid, selectedCountry);
        } catch {
            onChange?.(inputValue, false, selectedCountry);
        }
    };

    const handleCountryChange = (country: CountryCode) => {
        setSelectedCountry(country);
        setOpen(false);

        // Reformat phone number for new country
        if (phoneNumber) {
            try {
                const digitsOnly = phoneNumber.replace(/\D/g, "");
                const formatter = new AsYouType(country);
                const formatted = formatter.input(digitsOnly);
                setPhoneNumber(formatted);

                const fullNumber = `+${getCountryCallingCode(country)}${digitsOnly}`;
                const parsed = parsePhoneNumberWithError(fullNumber);
                const isValid = parsed ? parsed.isValid() : false;

                onChange?.(fullNumber, isValid, country);
            } catch {
                onChange?.(phoneNumber, false, country);
            }
        }

        // Auto-focus phone input after selection (still highly recommended for UX!)
        setTimeout(() => {
            phoneInputRef.current?.focus();
        }, 100);
    };

    const callingCode = useMemo(() => {
        try {
            return `+${getCountryCallingCode(selectedCountry)}`;
        } catch {
            return "+1";
        }
    }, [selectedCountry]);

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    phoneInputVariants({ size, disabled: disabled })
                )}>
                {/* Country Selector */}
                <Popover open={open} onOpenChange={setOpen} modal>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={open}
                            disabled={disabledCountrySelect || disabled}
                            className={cn(
                                "hover:bg-muted/50 h-full min-w-fit justify-between rounded-r-none border-r bg-transparent px-3 dark:bg-transparent!",
                                "focus-visible:ring-0 focus-visible:ring-offset-0"
                            )}>
                            <div className="flex items-center gap-2">
                                <FlagImage
                                    key={selectedCountry}
                                    country={selectedCountry}
                                    name={COUNTRY_DATA[selectedCountry]?.name}
                                />
                                <span className="text-muted-foreground text-sm font-medium">
                                    {callingCode}
                                </span>
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-70 p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search country..." />

                            {/* FIX: CommandList is REQUIRED for keyboard nav and scrolling to work */}
                            <CommandList className="max-h-75 overflow-auto">
                                <CommandEmpty>No country found.</CommandEmpty>
                                {/* FIX: Removed scrolling classes from CommandGroup */}
                                <CommandGroup>
                                    {ALL_COUNTRIES.map((country) => {
                                        const countryName =
                                            COUNTRY_DATA[country]?.name;
                                        const countryCallingCode =
                                            getCountryCallingCode(country);
                                        // Include name, code, and calling code so searching works for all
                                        const searchValue = `${countryName} ${country} +${countryCallingCode}`;

                                        return (
                                            <CommandItem
                                                key={country}
                                                value={searchValue}
                                                onSelect={() =>
                                                    handleCountryChange(country)
                                                }
                                                className="cursor-pointer">
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedCountry ===
                                                            country
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />

                                                <FlagImage
                                                    key={country}
                                                    country={country}
                                                    name={countryName}
                                                    className="mr-2"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {countryName}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        +{countryCallingCode}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* Phone Number Input */}
                <div className="relative flex-1">
                    <Input
                        type="tel"
                        ref={phoneInputRef}
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        onBlur={() => {
                            onBlur?.();
                        }}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={cn(
                            "h-full rounded-l-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
                            "pr-10 pl-3"
                        )}
                    />
                    <Phone className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                </div>
            </div>

            {/* Error Message */}
            {error && errorMessage && (
                <p className="mt-1.5 text-sm text-red-500">{errorMessage}</p>
            )}
        </div>
    );
};

const FlagImage = ({
    country,
    name,
    className,
}: {
    country: string;
    name: string;
    className?: string;
}) => {
    const [error, setError] = React.useState(false);

    if (error) {
        // Fallback to a neutral Globe icon if the CDN fails
        return (
            <Globe className={cn("text-muted-foreground h-4 w-4", className)} />
        );
    }

    return (
        <img
            key={country}
            src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${country.toLowerCase()}.png 2x`}
            width="20"
            alt={name}
            className={cn("object-cover", className)}
            onError={() => setError(true)}
        />
    );
};
