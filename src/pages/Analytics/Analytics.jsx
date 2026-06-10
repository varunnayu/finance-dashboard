import ExpensePieChart from "../../components/charts/ExpensePieChart";
import FinanceBarChart from "../../components/charts/FinanceBarChart";
import FinanceLineChart from "../../components/charts/FinanceLineChart";


const Analytics = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
                Analytics
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <FinanceLineChart />
                <ExpensePieChart />
                <FinanceBarChart />
            </div>
        </div>
    );
};

export default Analytics;