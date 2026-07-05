import {
    isValidPhoneNumber,
    parsePhoneNumberWithError,
} from "libphonenumber-js";
import { z } from "zod";

/**
 * Phone number validation options
 */
export interface PhoneNumberValidationOptions {
    /**
     * Array of allowed country codes (e.g., ['US', 'GB', 'IN'])
     * If not provided, all countries are allowed
     */
    allowedCountries?: string[];

    /**
     * Whether to allow mobile numbers only
     */
    mobileOnly?: boolean;

    /**
     * Custom error messages
     */
    errorMessages?: {
        invalid?: string;
        required?: string;
        countryNotAllowed?: string;
        notMobile?: string;
    };
}

/**
 * Create a Zod schema for phone number validation
 *
 * @param options - Validation options
 * @returns Zod schema for phone number validation
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   phone: createPhoneNumberSchema({
 *     allowedCountries: ['US', 'CA'],
 *     mobileOnly: true,
 *   }),
 * });
 * ```
 */
export function createPhoneNumberSchema(
    options?: PhoneNumberValidationOptions
) {
    const {
        allowedCountries,
        mobileOnly = false,
        errorMessages = {},
    } = options || {};

    const defaultMessages = {
        invalid: "Please enter a valid phone number",
        required: "Phone number is required",
        countryNotAllowed: `Phone number must be from one of these countries: ${allowedCountries?.join(", ")}`,
        notMobile: "Please enter a mobile phone number",
    };

    const messages = { ...defaultMessages, ...errorMessages };

    return z
        .string({ error: messages.required })
        .min(1, messages.required)
        .refine(
            (value) => {
                try {
                    return isValidPhoneNumber(value);
                } catch {
                    return false;
                }
            },
            { message: messages.invalid }
        )
        .refine(
            (value) => {
                if (!allowedCountries || allowedCountries.length === 0)
                    return true;

                try {
                    const parsed = parsePhoneNumberWithError(value);
                    return (
                        parsed &&
                        allowedCountries.includes(parsed.country || "")
                    );
                } catch {
                    return false;
                }
            },
            { message: messages.countryNotAllowed }
        )
        .refine(
            (value) => {
                if (!mobileOnly) return true;

                try {
                    const parsed = parsePhoneNumberWithError(value);
                    return parsed && parsed.getType() === "MOBILE";
                } catch {
                    return false;
                }
            },
            { message: messages.notMobile }
        );
}

/**
 * Basic phone number schema (validates any valid phone number)
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   phone: phoneNumberSchema,
 * });
 * ```
 */
export const phoneNumberSchema = createPhoneNumberSchema();

/**
 * Optional phone number schema (allows empty string)
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   phone: phoneNumberSchemaOptional,
 * });
 * ```
 */
export const phoneNumberSchemaOptional = z
    .string()
    .optional()
    .refine(
        (value) => {
            if (!value || value === "") return true;
            try {
                return isValidPhoneNumber(value);
            } catch {
                return false;
            }
        },
        { message: "Please enter a valid phone number" }
    );

/**
 * Validate a phone number string
 *
 * @param phoneNumber - Phone number to validate
 * @param options - Validation options
 * @returns Validation result with isValid flag and error message
 *
 * @example
 * ```typescript
 * const result = validatePhoneNumber('+1234567890', { allowedCountries: ['US'] });
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validatePhoneNumber(
    phoneNumber: string,
    options?: PhoneNumberValidationOptions
): { isValid: boolean; error?: string; country?: string; type?: string } {
    const schema = createPhoneNumberSchema(options);
    const result = schema.safeParse(phoneNumber);

    if (result.success) {
        try {
            const parsed = parsePhoneNumberWithError(phoneNumber);
            return {
                isValid: true,
                country: parsed?.country,
                type: parsed?.getType(),
            };
        } catch {
            // This should ideally not happen if safeParse succeeded
            return { isValid: true };
        }
    }

    return { isValid: false, error: result.error.issues[0]?.message };
}

/**
 * Format a phone number to international format
 *
 * @param phoneNumber - Phone number to format
 * @param format - Format type ('international' | 'national' | 'e164' | 'rfc3966')
 * @returns Formatted phone number or null if invalid
 *
 * @example
 * ```typescript
 * formatPhoneNumber('+14155552671', 'international'); // "+1 415 555 2671"
 * formatPhoneNumber('+14155552671', 'national'); // "(415) 555-2671"
 * formatPhoneNumber('+14155552671', 'e164'); // "+14155552671"
 * ```
 */
export function formatPhoneNumber(
    phoneNumber: string,
    format: "international" | "national" | "e164" | "rfc3966" = "international"
): string | null {
    try {
        const parsed = parsePhoneNumberWithError(phoneNumber);
        if (!parsed) return null;

        switch (format) {
            case "international":
                return parsed.formatInternational();
            case "national":
                return parsed.formatNational();
            case "e164":
                return parsed.format("E.164");
            case "rfc3966":
                return parsed.format("RFC3966");
            default:
                return parsed.formatInternational();
        }
    } catch {
        return null;
    }
}

/**
 * Extract country code from phone number
 *
 * @param phoneNumber - Phone number to extract country from
 * @returns Country code or null if invalid
 *
 * @example
 * ```typescript
 * getPhoneNumberCountry('+14155552671'); // "US"
 * ```
 */
export function getPhoneNumberCountry(phoneNumber: string): string | null {
    try {
        const parsed = parsePhoneNumberWithError(phoneNumber);
        return parsed?.country || null;
    } catch {
        return null;
    }
}

/**
 * Get phone number type (MOBILE, FIXED_LINE, etc.)
 *
 * @param phoneNumber - Phone number to check
 * @returns Phone number type or null if invalid
 *
 * @example
 * ```typescript
 * getPhoneNumberType('+14155552671'); // "MOBILE" | "FIXED_LINE" | etc.
 * ```
 */
export function getPhoneNumberType(phoneNumber: string): string | null {
    try {
        const parsed = parsePhoneNumberWithError(phoneNumber);
        return parsed?.getType() || null;
    } catch {
        return null;
    }
}
