import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePosStore } from "@/stores/pos-store";
import { Play } from "lucide-react";

const startSessionSchema = z.object({
    name: z.string().min(1, "Customer name is required"),
    mobile: z.string().min(10, "Valid mobile number is required"),
});

type StartSessionFormValues = z.infer<typeof startSessionSchema>;

interface StartSessionDialogProps {
    children: React.ReactNode;
}

export function StartSessionDialog({ children }: StartSessionDialogProps) {
    const [open, setOpen] = useState(false);
    const startSession = usePosStore((state) => state.startSession);

    const form = useForm<StartSessionFormValues>({
        resolver: zodResolver(startSessionSchema) as any,
        defaultValues: {
            name: "",
            mobile: "",
        },
    });

    const onSubmit = (data: StartSessionFormValues) => {
        startSession(data);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Start New Session</DialogTitle>
                    <DialogDescription>
                        Enter customer details to begin a new billing session.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Play className="mr-2 h-4 w-4" /> Start
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
