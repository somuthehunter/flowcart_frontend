import { FC } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { AuthedRoutes } from "@/constants/route-constants";
import FailedMessage from "@/components/failed-message";
import { Button } from "@/components/ui/button";

const NotfoundPage: FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background flex items-center justify-center p-4">
            <div className="flex max-w-md flex-col items-center text-center">
                <FailedMessage type="error" />

                <div className="mt-6 space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">
                        404 - Page Not Found
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        The page you're looking for doesn't exist or has been
                        moved.
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        size="lg">
                        <ArrowLeft />
                        Go Back
                    </Button>
                    <Button asChild size="lg">
                        <Link to={AuthedRoutes.home}>
                            <Home />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotfoundPage;
