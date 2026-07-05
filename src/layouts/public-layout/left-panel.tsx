import { FC } from "react";
import { motion } from "framer-motion";
import {
    Bot,
    Clock,
    MessageCircle,
    Phone,
    Shield,
    TrendingUp,
    Zap,
} from "lucide-react";

const slideUpFade = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
};

const FEATURE_CARDS = [
    {
        Icon: Phone,
        label: "AI Voice",
        description: "Smart call handling & qualification",
        color: "#EA4E0A",
        bg: "rgba(234, 78, 10, 0.2)",
    },
    {
        Icon: MessageCircle,
        label: "Omnichannel Chat",
        description: "Web, SMS, WhatsApp, Social",
        color: "#3B82F6",
        bg: "rgba(37, 99, 235, 0.2)",
    },
    {
        Icon: TrendingUp,
        label: "Lead Generation",
        description: "Automated capture & nurturing",
        color: "#22C55E",
        bg: "rgba(34, 197, 94, 0.2)",
    },
    {
        Icon: Zap,
        label: "Instant Response",
        description: "Sub 2-second AI replies",
        color: "#A855F7",
        bg: "rgba(168, 85, 247, 0.2)",
    },
];

const STATS = [
    {
        Icon: Shield,
        value: "98%",
        label: "Satisfaction",
        color: "#EA4E0A",
        bg: "rgba(234, 78, 10, 0.15)",
    },
    {
        Icon: TrendingUp,
        value: "2.5x",
        label: "More Leads",
        color: "#3B82F6",
        bg: "rgba(37, 99, 235, 0.15)",
    },
    {
        Icon: Clock,
        value: "<2s",
        label: "Response",
        color: "#22C55E",
        bg: "rgba(34, 197, 94, 0.15)",
    },
];

export const LeftPanel: FC = () => {
    return (
        <div
            className="relative flex h-full flex-col overflow-hidden"
            style={{
                background:
                    "linear-gradient(135deg, #1F3A6B 0%, #152a4d 50%, #0f1f38 100%)",
            }}>
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute h-150 w-150 rounded-full opacity-30 blur-3xl"
                    style={{
                        background:
                            "radial-gradient(circle, #2563EB 0%, transparent 70%)",
                        top: "-200px",
                        right: "-100px",
                    }}
                />
                <div
                    className="absolute h-100 w-100 rounded-full opacity-20 blur-3xl"
                    style={{
                        background:
                            "radial-gradient(circle, #EA4E0A 0%, transparent 70%)",
                        bottom: "-100px",
                        left: "-50px",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col p-12">
                {/* Logo */}
                <motion.div
                    className="mb-12 flex items-center gap-3"
                    variants={slideUpFade}
                    initial="hidden"
                    animate="show"
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: "#EA4E0A" }}>
                        <Bot className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-white">Vista</span>
                </motion.div>

                {/* Main content */}
                <motion.div
                    className="flex max-w-xl flex-1 flex-col justify-center"
                    variants={slideUpFade}
                    initial="hidden"
                    animate="show"
                    transition={{
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.1,
                    }}>
                    <h1 className="mb-4 text-5xl leading-tight font-bold text-white">
                        AI-Powered Customer Engagement
                    </h1>
                    <p className="mb-2 text-xl" style={{ color: "#EA4E0A" }}>
                        For Automotive Dealerships
                    </p>
                    <p className="mb-10 text-lg text-gray-300">
                        Transform your dealership with intelligent voice and
                        chat solutions that convert leads 24/7.
                    </p>

                    {/* Feature cards grid */}
                    <div className="mb-10 grid grid-cols-2 gap-4">
                        {FEATURE_CARDS.map((card, i) => (
                            <motion.div
                                key={card.label}
                                className="rounded-xl p-4"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    backdropFilter: "blur(10px)",
                                }}
                                variants={slideUpFade}
                                initial="hidden"
                                animate="show"
                                transition={{
                                    duration: 0.8,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: 0.3 + i * 0.1,
                                }}>
                                <div
                                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: card.bg }}>
                                    <card.Icon
                                        className="h-5 w-5"
                                        style={{ color: card.color }}
                                    />
                                </div>
                                <h3 className="mb-1 font-semibold text-white">
                                    {card.label}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {card.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats footer */}
                <motion.div
                    className="flex items-center gap-8 border-t pt-8"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    variants={slideUpFade}
                    initial="hidden"
                    animate="show"
                    transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.7,
                    }}>
                    {STATS.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex items-center gap-3">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full"
                                style={{ backgroundColor: stat.bg }}>
                                <stat.Icon
                                    className="h-6 w-6"
                                    style={{ color: stat.color }}
                                />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
