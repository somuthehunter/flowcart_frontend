import { cn } from "@/lib/utils";

interface VerticalStepperProps<T> {
    steps: T[];
    currentStep: number;
    onStepClick?: (index: number) => void;
    getStepLabel?: (step: T, index: number) => string;
    allowAllStepsClickable?: boolean;
}

export function VerticalStepper<T>({
    steps,
    currentStep,
    onStepClick,
    getStepLabel,
    allowAllStepsClickable = false,
}: VerticalStepperProps<T>) {
    return (
        <div
            className={cn(
                "flex w-full",
                // Mobile & Tablet
                "flex-row items-start justify-between gap-2",
                // Desktop
                "lg:flex-col lg:items-start lg:justify-start lg:gap-5"
            )}>
            {steps.map((step, index) => {
                const stepNumber = index + 1;

                const isCurrent = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;

                const isClickable =
                    !!onStepClick &&
                    (allowAllStepsClickable ||
                        isCompleted ||
                        stepNumber <= currentStep);

                return (
                    <div
                        key={index}
                        className={cn(
                            "flex min-w-0 flex-1",
                            "flex-col items-center",
                            "lg:flex-none lg:flex-row lg:items-start lg:gap-4"
                        )}>
                        {/* Circle + Line */}
                        <div
                            className={cn(
                                "flex w-full items-center",
                                "lg:w-auto lg:flex-col"
                            )}>
                            <button
                                type="button"
                                onClick={() =>
                                    isClickable && onStepClick?.(index)
                                }
                                className={cn(
                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                                    isCurrent || isCompleted
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground/30 bg-background text-muted-foreground",
                                    isClickable &&
                                        "hover:border-primary hover:text-primary cursor-pointer"
                                )}>
                                {stepNumber}
                            </button>

                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "bg-border",
                                        // Mobile / Tablet
                                        "mx-2 h-px flex-1",
                                        // Desktop
                                        "lg:mx-0 lg:my-2 lg:h-10 lg:w-px"
                                    )}
                                />
                            )}
                        </div>

                        {/* Label */}
                        <div
                            className={cn(
                                "mt-2 max-w-22.5 text-center",
                                "lg:mt-0 lg:max-w-none lg:pt-1 lg:text-left"
                            )}>
                            <div
                                className={cn(
                                    "text-xs leading-tight font-medium sm:text-sm",
                                    isCurrent
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}>
                                {getStepLabel?.(step, index) ??
                                    `Step ${stepNumber}`}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default VerticalStepper;
