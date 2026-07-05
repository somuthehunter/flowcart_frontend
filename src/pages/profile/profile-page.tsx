import PageWithHeaderFooter from "@/layouts/page-with-header-footer";

import ProfileSection from "./components/profile-section";
import { ResetPassword } from "./components/reset-password";

const ProfilePage = () => {
    return (
        <PageWithHeaderFooter
            title="Account"
            description="Manage your account information and security settings">
            <div className="grid gap-6 py-6">
                <ProfileSection />
                <ResetPassword />
            </div>
        </PageWithHeaderFooter>
    );
};

export default ProfilePage;
