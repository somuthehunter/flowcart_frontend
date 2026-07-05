import { useAuthStore } from "@/stores/auth-store";

const useAuth = () => {
    const auth = useAuthStore();

    return {
        ...auth,
    };
};

export default useAuth;
