import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProductsFilterProps } from "../lib/types";
import { useQuery } from "@tanstack/react-query";
import QueryConst from "@/constants/query-constants";
import httpService from "@/services/http-service";

const ProductsFilter = ({
    searchKeyword,
    categoryId,
    status,
    handleFilterChange,
    resetFilters,
}: ProductsFilterProps) => {
    const [searchValue, setSearchValue] = useState(searchKeyword || "");
    const [debouncedSearch] = useDebounce(searchValue, 500);

    // Fetch categories for the filter dropdown
    const { data: categoriesResponse } = useQuery({
        queryKey: [QueryConst.categories.list],
        queryFn: async () => {
            const response = await httpService.get(QueryConst.categories.list);
            return response.data;
        },
    });
    
    // In FlowCart, the response data structure might vary, adjust accordingly if needed
    const categories = categoriesResponse?.data || [];

    useEffect(() => {
        if (debouncedSearch !== searchKeyword) {
            handleFilterChange("searchKeyword", debouncedSearch || null);
        }
    }, [debouncedSearch, searchKeyword, handleFilterChange]);

    const hasActiveFilters = !!searchKeyword || !!categoryId || !!status;

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
                <div className="relative w-full md:w-80">
                    <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
                    <Input
                        placeholder="Search products by SKU, name, barcode..."
                        className="pl-8"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
                
                <Select
                    value={categoryId || "all"}
                    onValueChange={(val) => handleFilterChange("categoryId", val === "all" ? null : val)}
                >
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>
                                {c.name || c.english_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <Select
                    value={status || "all"}
                    onValueChange={(val) => handleFilterChange("status", val === "all" ? null : val)}
                >
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    onClick={() => {
                        setSearchValue("");
                        resetFilters();
                    }}
                    className="h-9 px-3 lg:px-4 text-muted-foreground"
                >
                    Reset
                    <X className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default ProductsFilter;
