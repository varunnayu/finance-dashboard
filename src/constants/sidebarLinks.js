import {
    FaHome,
    FaMoneyBillWave,
    FaChartPie,
    FaLightbulb,
    FaBullseye,
} from "react-icons/fa";

export const sidebarLinks = [
    {
        path: "/",
        label: "Dashboard",
        icon: FaHome,
    },
    {
        path: "/transactions",
        label: "Transactions",
        icon: FaMoneyBillWave,
    },
    {
        path: "/analytics",
        label: "Analytics",
        icon: FaChartPie,
    },
    {
        path: "/insights",
        label: "AI Insights",
        icon: FaLightbulb,
    },
    {
        path: "/goals",
        label: "Goals",
        icon: FaBullseye,
    },
];