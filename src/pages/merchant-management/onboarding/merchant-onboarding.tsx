import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    SendHorizontal,
} from "lucide-react";
import { FormProvider } from "react-hook-form";

import PageWithHeaderFooter from "@/layouts/page-with-header-footer";
import { Button } from "@/components/ui/button";
import { VerticalStepper } from "@/components/ui/vertical-stepper";

import StepAddresses from "./components/step-addresses";
import StepBasicInfo from "./components/step-basic-info";
import StepContacts from "./components/step-contacts";
import StepHours from "./components/step-hours";
import StepReview from "./components/step-review";
import { useMerchantOnboarding } from "./hooks/use-merchant-onboarding";

export default function DealerOnboardingPage() {
    const {
        form,
        navigation,
        mutation,
        options,
        addresses,
        contacts,
        businessHours,
    } = useMerchantOnboarding();

    const { steps, currentStep, setCurrentStep, onNext, onPrev, onReset } =
        navigation;
    const { onSubmitFinal, isPendingDealerCreate } = mutation;
    const {
        dealershipTypeOptions,
        brandOptions,
        addressTypeOptions,
        timezoneOptions,
    } = options;

    return (
        <PageWithHeaderFooter
            title="Dealer Onboarding"
            description="Complete the steps below to register and activate a new dealership in the system.">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-4 lg:flex-row">
                {/* ── Stepper Sidebar ── */}
                <div className="w-full shrink-0 lg:w-64">
                    <div className="bg-card rounded-xl border p-6 shadow-sm lg:sticky lg:top-6">
                        <h3 className="text-muted-foreground mb-6 hidden text-sm font-bold tracking-wider uppercase lg:block">
                            Progress
                        </h3>
                        <VerticalStepper
                            steps={steps}
                            currentStep={currentStep}
                            onStepClick={(index) => setCurrentStep(index + 1)}
                            getStepLabel={(step) => step}
                        />
                    </div>
                </div>

                {/* ── Form content ── */}
                <div className="bg-card flex flex-1 flex-col rounded-xl border shadow-sm">
                    <FormProvider {...form}>
                        <form
                            onSubmit={onSubmitFinal}
                            className="flex flex-1 flex-col"
                            noValidate>
                            {/* Step content area */}
                            <div className="min-h-100 flex-1 p-6">
                                {currentStep === 1 && (
                                    <StepBasicInfo
                                        dealershipTypeOptions={
                                            dealershipTypeOptions
                                        }
                                        brandOptions={brandOptions}
                                    />
                                )}
                                {currentStep === 2 && (
                                    <StepAddresses
                                        fields={addresses.fields}
                                        onAdd={addresses.onAdd}
                                        onRemove={addresses.onRemove}
                                        onSetPrimary={addresses.onSetPrimary}
                                        onCopyToAll={addresses.onCopyToAll}
                                        addressTypeOptions={addressTypeOptions}
                                    />
                                )}
                                {currentStep === 3 && (
                                    <StepContacts
                                        fields={contacts.fields}
                                        onAdd={contacts.onAdd}
                                        onRemove={contacts.onRemove}
                                        onSetUser={contacts.onSetUser}
                                    />
                                )}
                                {currentStep === 4 && (
                                    <StepHours
                                        fields={businessHours.fields}
                                        onAdd={businessHours.onAdd}
                                        onRemove={businessHours.onRemove}
                                        onDayToggle={businessHours.onDayToggle}
                                        timezoneOptions={timezoneOptions}
                                    />
                                )}
                                {currentStep === 5 && (
                                    <StepReview
                                        dealershipTypeOptions={
                                            dealershipTypeOptions
                                        }
                                        brandOptions={brandOptions}
                                    />
                                )}
                            </div>

                            {/* ── Footer navigation ── */}
                            <div className="bg-muted/30 rounded-b-xl border-t px-6 py-4">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={onReset}
                                        className="w-full sm:w-auto">
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Reset Form
                                    </Button>

                                    <div className="flex w-full justify-end gap-3 sm:w-auto">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={currentStep === 1}
                                            onClick={onPrev}
                                            className="w-full sm:w-auto">
                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>

                                        {currentStep < steps.length ? (
                                            <Button
                                                key="next-btn"
                                                type="button"
                                                onClick={onNext}
                                                className="w-full sm:w-auto">
                                                Next
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                key="submit-btn"
                                                type="submit"
                                                disabled={isPendingDealerCreate}
                                                className="bg-primary text-primary-foreground hover:bg-primary/95 w-full shadow-sm sm:w-auto">
                                                {isPendingDealerCreate ? (
                                                    "Submitting..."
                                                ) : (
                                                    <>
                                                        Submit Onboarding
                                                        <SendHorizontal className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </PageWithHeaderFooter>
    );
}
