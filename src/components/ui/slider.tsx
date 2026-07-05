"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const sliderVariants = cva(
    "relative flex w-full touch-none select-none items-center",
    {
        variants: {
            size: {
                sm: "h-4",
                md: "h-5",
                lg: "h-6",
            },
            variant: {
                default: "",
                primary: "",
                secondary: "",
                success: "",
                warning: "",
                destructive: "",
            },
        },
        defaultVariants: {
            size: "md",
            variant: "default",
        },
    }
);

const trackVariants = cva(
    "relative w-full grow overflow-hidden rounded-full bg-secondary",
    {
        variants: {
            size: {
                sm: "h-1.5",
                md: "h-2",
                lg: "h-2.5",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

const rangeVariants = cva("absolute h-full", {
    variants: {
        variant: {
            default: "bg-primary",
            primary: "bg-primary",
            secondary: "bg-secondary-foreground",
            success: "bg-green-500",
            warning: "bg-yellow-500",
            destructive: "bg-destructive",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const thumbVariants = cva(
    "block rounded-full border-2 bg-background ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            size: {
                sm: "h-4 w-4",
                md: "h-5 w-5",
                lg: "h-6 w-6",
            },
            variant: {
                default:
                    "border-primary shadow-md hover:shadow-lg hover:scale-110 active:scale-95",
                primary:
                    "border-primary shadow-md hover:shadow-lg hover:scale-110 active:scale-95",
                secondary:
                    "border-secondary-foreground shadow-md hover:shadow-lg hover:scale-110 active:scale-95",
                success:
                    "border-green-500 shadow-md hover:shadow-lg hover:scale-110 active:scale-95",
                warning:
                    "border-yellow-500 shadow-md hover:shadow-lg hover:scale-110 active:scale-95",
                destructive:
                    "border-destructive shadow-md hover:shadow-lg hover:scale-110 active:scale-95",
            },
        },
        defaultVariants: {
            size: "md",
            variant: "default",
        },
    }
);

export interface SliderProps
    extends
        React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
        VariantProps<typeof sliderVariants> {
    showTooltip?: boolean;
    formatValue?: (value: number) => string;
    showSteps?: boolean;
    stepMarkers?: number[];
}

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    SliderProps
>(
    (
        {
            className,
            size,
            variant,
            showTooltip = false,
            formatValue,
            showSteps = false,
            stepMarkers,
            ...props
        },
        ref
    ) => {
        const thumbCount = Array.isArray(props.value)
            ? props.value.length
            : Array.isArray(props.defaultValue)
              ? props.defaultValue.length
              : 1;

        const [hoveredThumb, setHoveredThumb] = React.useState<number | null>(
            null
        );
        const [isDragging, setIsDragging] = React.useState(false);

        const currentValues = props.value || props.defaultValue || [0];

        const defaultFormatValue = React.useCallback((value: number) => {
            return value.toString();
        }, []);

        const valueFormatter = formatValue || defaultFormatValue;

        return (
            <div className="relative w-full">
                <SliderPrimitive.Root
                    ref={ref}
                    className={cn(sliderVariants({ size, variant, className }))}
                    onValueChange={(value) => {
                        setIsDragging(true);
                        props.onValueChange?.(value);
                    }}
                    onValueCommit={(value) => {
                        setIsDragging(false);
                        props.onValueCommit?.(value);
                    }}
                    {...props}>
                    <SliderPrimitive.Track
                        className={cn(trackVariants({ size }))}>
                        <SliderPrimitive.Range
                            className={cn(rangeVariants({ variant }))}
                        />
                    </SliderPrimitive.Track>

                    {/* Step markers */}
                    {showSteps && stepMarkers && (
                        <div className="absolute inset-0 flex items-center justify-between px-1">
                            {stepMarkers.map((step, index) => {
                                const position =
                                    ((step - (props.min || 0)) /
                                        ((props.max || 100) -
                                            (props.min || 0))) *
                                    100;
                                return (
                                    <div
                                        key={index}
                                        className="bg-muted-foreground/40 absolute h-1 w-1 rounded-full"
                                        style={{
                                            left: `${position}%`,
                                            transform: "translateX(-50%)",
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Thumbs with tooltips */}
                    {Array.from({ length: thumbCount }, (_, i) => (
                        <SliderPrimitive.Thumb
                            key={i}
                            className={cn(thumbVariants({ size, variant }))}
                        />
                    ))}
                </SliderPrimitive.Root>

                {/* Value labels for range sliders */}
                {thumbCount > 1 && (
                    <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                        <span>
                            Min: {valueFormatter(currentValues[0] || 0)}
                        </span>
                        <span>
                            Max: {valueFormatter(currentValues[1] || 0)}
                        </span>
                    </div>
                )}
            </div>
        );
    }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
