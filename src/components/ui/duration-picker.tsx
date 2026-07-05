"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DurationPickerProps {
    value?: number;
    onChange: (value: number) => void;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export function DurationPicker({ value = 0, onChange }: DurationPickerProps) {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const update = (h = hours, m = minutes, s = seconds) => {
        onChange(h * 3600 + m * 60 + s);
    };

    return (
        <div className="grid grid-cols-3 gap-2 sm:flex">
            <Select
                value={String(hours)}
                onValueChange={(v) => update(Number(v))}>
                <SelectTrigger className="w-full sm:w-20">
                    <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                    {range(24).map((h) => (
                        <SelectItem key={h} value={String(h)}>
                            {h} h
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={String(minutes)}
                onValueChange={(v) => update(hours, Number(v))}>
                <SelectTrigger className="w-full sm:w-20">
                    <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                    {range(60).map((m) => (
                        <SelectItem key={m} value={String(m)}>
                            {m} m
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={String(seconds)}
                onValueChange={(v) => update(hours, minutes, Number(v))}>
                <SelectTrigger className="w-full sm:w-20">
                    <SelectValue placeholder="SS" />
                </SelectTrigger>
                <SelectContent>
                    {range(60).map((s) => (
                        <SelectItem key={s} value={String(s)}>
                            {s} s
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
