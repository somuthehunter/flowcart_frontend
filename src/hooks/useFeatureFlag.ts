import { FeatureFlags } from "@/types/feature-flags";
import { useFeatureFlagContext } from "@/contexts/feature-flag-context";

const useFeatureFlag = (key: FeatureFlags) => {
    const { featureFlagSet } = useFeatureFlagContext();

    return featureFlagSet[key];
};

export default useFeatureFlag;
