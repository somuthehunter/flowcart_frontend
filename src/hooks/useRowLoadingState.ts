import { useCallback, useState } from "react";

/**
 * Generic hook for managing loading states of table rows
 * Supports multiple concurrent operations per row
 *
 * @template TRowId - Type of the row identifier (string | number)
 * @template TAction - Union type of possible actions (e.g., 'edit' | 'delete' | 'assign')
 *
 * @example
 * ```typescript
 * type VanAction = 'assignTechnician' | 'unassignTechnician' | 'changeStatus';
 * const rowLoading = useRowLoadingState<string, VanAction>();
 *
 * // Set loading
 * rowLoading.setLoading('van-123', 'assignTechnician');
 *
 * // Check if loading
 * const isLoading = rowLoading.isLoading('van-123', 'assignTechnician');
 *
 * // Clear specific action
 * rowLoading.clearLoading('van-123', 'assignTechnician');
 *
 * // Clear all actions for a row
 * rowLoading.clearLoading('van-123');
 * ```
 */
export const useRowLoadingState = <
    TRowId extends string | number,
    TAction extends string,
>() => {
    const [loadingState, setLoadingState] = useState<Map<TRowId, Set<TAction>>>(
        new Map()
    );

    /**
     * Check if a row has any loading action or a specific action
     * @param rowId - The identifier of the row
     * @param action - Optional specific action to check
     * @returns true if the row is loading (any action or specific action)
     */
    const isLoading = useCallback(
        (rowId: TRowId, action?: TAction): boolean => {
            const actions = loadingState.get(rowId);
            if (!actions) return false;
            return action ? actions.has(action) : actions.size > 0;
        },
        [loadingState]
    );

    /**
     * Check if a row has any of the specified actions loading
     * @param rowId - The identifier of the row
     * @param actions - Array of actions to check
     * @returns true if any of the specified actions are loading
     */
    const isLoadingAny = useCallback(
        (rowId: TRowId, actions: TAction[]): boolean => {
            const rowActions = loadingState.get(rowId);
            if (!rowActions) return false;
            return actions.some((action) => rowActions.has(action));
        },
        [loadingState]
    );

    /**
     * Check if a row has all of the specified actions loading
     * @param rowId - The identifier of the row
     * @param actions - Array of actions to check
     * @returns true if all of the specified actions are loading
     */
    const isLoadingAll = useCallback(
        (rowId: TRowId, actions: TAction[]): boolean => {
            const rowActions = loadingState.get(rowId);
            if (!rowActions) return false;
            return actions.every((action) => rowActions.has(action));
        },
        [loadingState]
    );

    /**
     * Set a specific action as loading for a row
     * @param rowId - The identifier of the row
     * @param action - The action to mark as loading
     */
    const setLoading = useCallback((rowId: TRowId, action: TAction) => {
        setLoadingState((prev) => {
            const newState = new Map(prev);
            const actions = newState.get(rowId) || new Set<TAction>();
            actions.add(action);
            newState.set(rowId, actions);
            return newState;
        });
    }, []);

    /**
     * Set multiple actions as loading for a row
     * @param rowId - The identifier of the row
     * @param actions - Array of actions to mark as loading
     */
    const setLoadingMultiple = useCallback(
        (rowId: TRowId, actions: TAction[]) => {
            setLoadingState((prev) => {
                const newState = new Map(prev);
                const rowActions = newState.get(rowId) || new Set<TAction>();
                actions.forEach((action) => rowActions.add(action));
                newState.set(rowId, rowActions);
                return newState;
            });
        },
        []
    );

    /**
     * Clear loading state for a row
     * @param rowId - The identifier of the row
     * @param action - Optional specific action to clear. If omitted, clears all actions for the row
     */
    const clearLoading = useCallback((rowId: TRowId, action?: TAction) => {
        setLoadingState((prev) => {
            const newState = new Map(prev);
            if (!action) {
                // Clear all actions for this row
                newState.delete(rowId);
            } else {
                // Clear specific action
                const actions = newState.get(rowId);
                if (actions) {
                    actions.delete(action);
                    if (actions.size === 0) {
                        newState.delete(rowId);
                    } else {
                        newState.set(rowId, actions);
                    }
                }
            }
            return newState;
        });
    }, []);

    /**
     * Clear multiple actions for a row
     * @param rowId - The identifier of the row
     * @param actions - Array of actions to clear
     */
    const clearLoadingMultiple = useCallback(
        (rowId: TRowId, actions: TAction[]) => {
            setLoadingState((prev) => {
                const newState = new Map(prev);
                const rowActions = newState.get(rowId);
                if (rowActions) {
                    actions.forEach((action) => rowActions.delete(action));
                    if (rowActions.size === 0) {
                        newState.delete(rowId);
                    } else {
                        newState.set(rowId, rowActions);
                    }
                }
                return newState;
            });
        },
        []
    );

    /**
     * Clear all loading states
     */
    const clearAll = useCallback(() => {
        setLoadingState(new Map());
    }, []);

    /**
     * Get all actions currently loading for a row
     * @param rowId - The identifier of the row
     * @returns Array of actions currently loading
     */
    const getLoadingActions = useCallback(
        (rowId: TRowId): TAction[] => {
            const actions = loadingState.get(rowId);
            return actions ? Array.from(actions) : [];
        },
        [loadingState]
    );

    /**
     * Get count of loading actions for a row
     * @param rowId - The identifier of the row
     * @returns Number of actions currently loading
     */
    const getLoadingCount = useCallback(
        (rowId: TRowId): number => {
            const actions = loadingState.get(rowId);
            return actions ? actions.size : 0;
        },
        [loadingState]
    );

    /**
     * Get total count of all loading actions across all rows
     * @returns Total number of loading actions
     */
    const getTotalLoadingCount = useCallback((): number => {
        let count = 0;
        loadingState.forEach((actions) => {
            count += actions.size;
        });
        return count;
    }, [loadingState]);

    /**
     * Get all rows that have any loading action
     * @returns Array of row identifiers that are loading
     */
    const getLoadingRows = useCallback((): TRowId[] => {
        return Array.from(loadingState.keys());
    }, [loadingState]);

    return {
        isLoading,
        isLoadingAny,
        isLoadingAll,
        setLoading,
        setLoadingMultiple,
        clearLoading,
        clearLoadingMultiple,
        clearAll,
        getLoadingActions,
        getLoadingCount,
        getTotalLoadingCount,
        getLoadingRows,
    };
};

export type RowLoadingState<
    TRowId extends string | number,
    TAction extends string,
> = ReturnType<typeof useRowLoadingState<TRowId, TAction>>;
