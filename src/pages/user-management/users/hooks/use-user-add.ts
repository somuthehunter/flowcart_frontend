import { getRoleSuggestions } from "@/services/api/role-ep";
import { createUser, updateUser } from "@/services/api/user-ep";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    CreateUserRequest,
    UpdateUserRequest,
} from "@/types/request/user-request";
import {
    UserDetails,
    UserStatus,
    UserType,
} from "@/types/response/user-response";
import QueryConst from "@/constants/query-constants";

export const userSchema = z.object({
    firstName: z.string().min(1, "First Name is required").max(100),
    lastName: z.string().min(1, "Last Name is required").max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z
        .string()
        .min(8, "Password should atleast 8 characters")

        .optional(),
    roleId: z.string().min(1, "Role is required"),
    status: z.nativeEnum(UserStatus),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UseUserAddProps {
    user?: UserDetails;
    isOpen: boolean;
    onClose: () => void;
}

export const useUserAdd = ({ user, isOpen, onClose }: UseUserAddProps) => {
    const queryClient = useQueryClient();
    const authUser = useAuthStore((s) => s.user);

    const defaultEntityId = authUser?.entityId || "default-entity-id";

    const defaultValues: UserFormValues = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        password: user ? undefined : "",
        roleId: user?.roleId || "",
        status: user?.status || UserStatus.Active,
    };

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        values: defaultValues,
    });

    // Fetch Role suggestions for dropdown
    const { data: roleSuggestions = [], isLoading: isLoadingRoles } = useQuery({
        queryKey: [QueryConst.role.suggestions],
        queryFn: getRoleSuggestions,
        enabled: isOpen,
    });

    const createMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast.success("User created successfully");
            handleClose();
            queryClient.invalidateQueries({ queryKey: [QueryConst.user.list] });
        },
        onError: () => {
            toast.error("Failed to create user");
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            toast.success("User updated successfully");
            handleClose();
            queryClient.invalidateQueries({ queryKey: [QueryConst.user.list] });
        },
        onError: () => {
            toast.error("Failed to update user");
        },
    });

    const onSubmit = form.handleSubmit((data) => {
        if (user) {
            updateMutation.mutate({
                ...data,
                userId: user.userId,
                entityId: user.entityId || defaultEntityId,
            } as UpdateUserRequest);
        } else {
            createMutation.mutate({
                ...data,
                entityId: defaultEntityId,
            } as CreateUserRequest);
        }
    });

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const isPending = createMutation.isPending || updateMutation.isPending;



    return {
        form,
        roleSuggestions,
        isLoadingRoles,
        isPending,
        onSubmit,
        handleClose,
    };
};
