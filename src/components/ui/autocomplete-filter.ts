import type { AutocompleteOption } from "./autocomplete";

// ---------------------------------------------------------------------------
// createFilterOptions  (MUI-compatible factory)
// ---------------------------------------------------------------------------

export interface CreateFilterOptionsConfig<T = AutocompleteOption> {
    ignoreAccents?: boolean;
    ignoreCase?: boolean;
    limit?: number | null;
    matchFrom?: "any" | "start";
    stringify?: (option: T) => string;
    trim?: boolean;
}

const stripDiacritics = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function createFilterOptions<T = AutocompleteOption>(
    config: CreateFilterOptionsConfig<T> = {}
) {
    const {
        ignoreAccents = true,
        ignoreCase = true,
        limit = null,
        matchFrom = "any",
        stringify,
        trim = false,
    } = config;

    return (
        options: T[],
        state: {
            inputValue: string;
            getOptionLabel: (option: T) => string;
        }
    ): T[] => {
        let input = state.inputValue;
        if (trim) input = input.trim();
        if (ignoreCase) input = input.toLowerCase();
        if (ignoreAccents) input = stripDiacritics(input);

        const filtered = !input
            ? options
            : options.filter((option) => {
                  let candidate = stringify
                      ? stringify(option)
                      : state.getOptionLabel(option);
                  if (ignoreCase) candidate = candidate.toLowerCase();
                  if (ignoreAccents) candidate = stripDiacritics(candidate);
                  return matchFrom === "start"
                      ? candidate.startsWith(input)
                      : candidate.includes(input);
              });

        return limit ? filtered.slice(0, limit) : filtered;
    };
}
