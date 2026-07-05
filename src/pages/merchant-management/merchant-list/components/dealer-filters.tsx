import { Search, X } from "lucide-react";

import { Autocomplete } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";

import { DealersFilterProps } from "../lib/types";

export const DealerFilters = ({
    searchKeyword,
    selectedStatus,
    statusOptions,
    handleSearchChange,
    handleStatusChange,
    clearSearch,
    filters,
}: DealersFilterProps) => {
    return (
        <div className="mb-4 space-y-3">
            {/* Search + Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative min-w-0 flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search by dealer , dealer code..."
                        className="h-9 pr-10 pl-10"
                        value={searchKeyword}
                        onChange={handleSearchChange}
                    />
                    {filters.search && (
                        <X
                            onClick={clearSearch}
                            className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 cursor-pointer"
                        />
                    )}
                </div>

                {/* Status Filter */}
                <div className="flex flex-row gap-3">
                    <Autocomplete
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        placeholder="All Status"
                        className="min-w-50"
                    />
                </div>
            </div>
        </div>
    );
};
