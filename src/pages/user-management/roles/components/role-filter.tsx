import { Search, X } from "lucide-react";

import { Autocomplete } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";

import { RoleFilterProps } from "../hooks/use-role-filter";

export const RoleFilter = (props: RoleFilterProps) => {
    const selectedStatus =
        props.status !== null && props.status !== undefined
            ? (props.statusOptions.find(
                  (opt) => String(opt.value) === String(props.status)
              ) ?? null)
            : null;

    return (
        <div className="space-y-2">
            {/* Search + Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative min-w-0 flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search roles..."
                        className="h-9 pr-10 pl-10"
                        value={props.searchKeyword}
                        onChange={(e) =>
                            props.handleChange("searchKeyword", e.target.value)
                        }
                    />
                    {props.searchKeyword && (
                        <X
                            onClick={() =>
                                props.handleChange("searchKeyword", "")
                            }
                            className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 cursor-pointer"
                        />
                    )}
                </div>

                {/* Status Filter */}
                <div className="flex flex-row gap-3">
                    <Autocomplete
                        options={props.statusOptions}
                        value={selectedStatus}
                        onChange={(val) =>
                            props.handleChange(
                                "status",
                                val ? Number(val.value ?? val) : null
                            )
                        }
                        placeholder="All Statuses"
                        className="min-w-50"
                    />
                </div>
            </div>
        </div>
    );
};
