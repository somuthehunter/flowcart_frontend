import { useConfirmationContext } from "@/contexts/confirmation-context";

const useConfirm = () => {
    const { confirm } = useConfirmationContext();
    return confirm;
};

export default useConfirm;
