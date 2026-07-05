export type FeatureFlags =
    | "DARK_MODE"
    | "COLOR_MODE_DETECTOR"
    | "NOTIFICATIONS"
    | "TEST_MODE_BANNER";

export type FeatureFlagDataSet = Record<FeatureFlags, boolean>;
