import * as React from "react";
import { cn } from "@/lib/utils";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

function InputOTP({
    className,
    containerClassName,
    ...props
}: React.ComponentProps<typeof OTPInput> & {
    containerClassName?: string;
}) {
    return (
        <OTPInput
            data-slot="input-otp"
            containerClassName={cn(
                "flex items-center gap-2 has-disabled:opacity-50",
                containerClassName
            )}
            className={cn("disabled:cursor-not-allowed", className)}
            {...props}
        />
    );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="input-otp-group"
            className={cn("flex items-center gap-2", className)}
            {...props}
        />
    );
}

function InputOTPSlot({
    index,
    className,
    ...props
}: React.ComponentProps<"div"> & { index: number }) {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } =
        inputOTPContext?.slots[index] ?? {};

    return (
        <div
            data-slot="input-otp-slot"
            data-active={isActive}
            className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-lg border text-base font-medium shadow-sm transition-all",
                "border-input bg-background",
                "data-[active=true]:border-ring data-[active=true]:ring-ring/40 data-[active=true]:ring-2",
                "aria-invalid:border-destructive",
                className
            )}
            {...props}>
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="animate-caret-blink bg-foreground h-5 w-px" />
                </div>
            )}
        </div>
    );
}

function InputOTPSeparator(props: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="input-otp-separator"
            role="separator"
            className="text-muted-foreground mx-1 flex items-center"
            {...props}>
            <MinusIcon size={16} />
        </div>
    );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
