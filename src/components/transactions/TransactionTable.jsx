import { useFinance } from "../../context/FinanceContext";
import toast from "react-hot-toast";

const TransactionTable = ({
    transactions,
    onEdit,
}) => {
    const { deleteTransaction } =
        useFinance();

    const handleDelete = (id) => {
        deleteTransaction(id);

        toast.success(
            "Transaction Deleted"
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">

            <table className="w-full">

                <thead>
                    <tr className="border-b">

                        <th className="p-4 text-left">
                            Date
                        </th>

                        <th className="p-4 text-left">
                            Title
                        </th>

                        <th className="p-4 text-left">
                            Category
                        </th>

                        <th className="p-4 text-left">
                            Type
                        </th>

                        <th className="p-4 text-left">
                            Amount
                        </th>

                        <th className="p-4 text-center">
                            Actions
                        </th>

                    </tr>
                </thead>

                <tbody>

                    {transactions.map(
                        (transaction) => (
                            <tr
                                key={
                                    transaction.id
                                }
                                className="border-b hover:bg-gray-50 dark:hover:bg-slate-700"
                            >
                                <td className="p-4">
                                    {
                                        transaction.date
                                    }
                                </td>

                                <td className="p-4">
                                    {
                                        transaction.title
                                    }
                                </td>

                                <td className="p-4">
                                    {
                                        transaction.category
                                    }
                                </td>

                                <td className="p-4 capitalize">
                                    {
                                        transaction.type
                                    }
                                </td>

                                <td
                                    className={`p-4 font-bold ${transaction.type ===
                                            "income"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    ₹
                                    {
                                        transaction.amount
                                    }
                                </td>

                                <td className="p-4 flex justify-center gap-2">

                                    <button
                                        onClick={() =>
                                            onEdit(
                                                transaction
                                            )
                                        }
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                transaction.id
                                            )
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        )
                    )}

                </tbody>

            </table>

        </div>
    );
};

export default TransactionTable;