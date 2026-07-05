import { useState } from "react";
import { updateUser as updateUserAPI } from "@/services/api/user-ep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


import QueryConst from "@/constants/query-constants";
import useAuth from "@/hooks/use-auth";

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phoneNumber: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^\+?\d{10,15}$/.test(val),
            "Enter a valid phone number"
        ),
});

export type ProfileFormValues = z.infer<typeof formSchema>;

export const useProfileSection = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            email: user?.email ?? "",
            phoneNumber: user?.phoneNumber || "",
        },
    });

    const { mutateAsync: updateUserAsync, isPending: isUpdatingUser } =
        useMutation({
            mutationKey: [QueryConst.user.update, user?.id],
            mutationFn: updateUserAPI,
        });

    const submitProfile = (values: ProfileFormValues) => {
        if (!user) return;

        updateUserAsync({
            userId: user.id,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phoneNumber || undefined,
            roleId: user.roleId,
            entityId: user.entityId,
            userType: user.userType,
        })
            .then(() => {
                updateUser({
                    ...user,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phoneNumber: values.phoneNumber || user.phoneNumber,
                });

                toast.success("Profile updated successfully");
                setIsEditing(false);
            })
            .catch((err) => {
            toast.error(err?.message || "Failed to update profile");
            });
    };

    const startEdit = () => setIsEditing(true);

    const cancelEdit = () => {
        form.reset();
        setIsEditing(false);
    };

    return {
        user,
        form,
        isEditing,
        startEdit,
        cancelEdit,
        submitProfile,
        isSaving: isUpdatingUser,
    };
};
