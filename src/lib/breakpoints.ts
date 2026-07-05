import json2mq from "json2mq";

const BreakPoint = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
};
type BreakPointKey = keyof typeof BreakPoint;

export class Breakpoints {
    public static up(limit: BreakPointKey) {
        const matchString = json2mq({ minWidth: BreakPoint[limit] });
        return matchString;
    }

    public static down(limit: BreakPointKey) {
        const matchString = json2mq({ maxWidth: BreakPoint[limit] });
        return matchString;
    }

    public static between(minLimit: BreakPointKey, maxLimit: BreakPointKey) {
        const matchString = json2mq({
            minWidth: BreakPoint[minLimit],
            maxWidth: BreakPoint[maxLimit],
        });
        return matchString;
    }
}
