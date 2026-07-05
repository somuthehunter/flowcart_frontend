import { FC } from "react";
import { Clock, Pencil } from "lucide-react";

import { DepartmentBusinessHours } from "@/types/response/dealer-response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DealerHoursProps = {
    hours: DepartmentBusinessHours[];
    onEdit?: () => void;
};

const formatTime = (time: string | null) => {
    if (!time) return "Closed";
    // Assuming time is in "HH:MM:SS" or "HH:MM" format
    return time.slice(0, 5);
};

export const DealerHours: FC<DealerHoursProps> = ({ hours, onEdit }) => {
    if (!hours || hours.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Business Hours</CardTitle>
                    <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit Hours
                    </Button>
                </CardHeader>
                <CardContent className="text-muted-foreground flex items-center justify-center py-8 text-sm">
                    No business hours registered for this dealer.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Business Hours</h3>
                <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Hours
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {hours.map((dept, index) => (
                    <Card key={index}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Clock className="text-primary h-5 w-5" />
                                <CardTitle className="text-base">{dept.deptName}</CardTitle>
                            </div>
                            {dept.timeZone && (
                                <p className="text-muted-foreground text-xs">Timezone: {dept.timeZone}</p>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                {[
                                    { day: "Monday", from: dept.monFrom, to: dept.monTo },
                                    { day: "Tuesday", from: dept.tueFrom, to: dept.tueTo },
                                    { day: "Wednesday", from: dept.wedFrom, to: dept.wedTo },
                                    { day: "Thursday", from: dept.thuFrom, to: dept.thuTo },
                                    { day: "Friday", from: dept.friFrom, to: dept.friTo },
                                    { day: "Saturday", from: dept.satFrom, to: dept.satTo },
                                    { day: "Sunday", from: dept.sunFrom, to: dept.sunTo },
                                ].map(({ day, from, to }) => (
                                    <div key={day} className="flex justify-between border-b last:border-0 pb-2 last:pb-0">
                                        <span className="font-medium">{day}</span>
                                        <span className="text-muted-foreground">
                                            {!from && !to ? "Closed" : `${formatTime(from)} - ${formatTime(to)}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
