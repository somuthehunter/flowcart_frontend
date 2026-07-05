import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

interface ThemeSwitchProps {
    className?: string;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ className }) => {
    const { theme, setTheme } = useTheme();

    const handleThemeChange = (checked: boolean) => {
        setTheme(checked ? "dark" : "light");
    };

    return (
        <Switch
            className={cn("", className)}
            checked={theme === "dark"}
            onCheckedChange={handleThemeChange}
            aria-label="Toggle dark mode"
        />
    );
};

export default ThemeSwitch;
