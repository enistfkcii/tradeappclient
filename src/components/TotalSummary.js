import React from "react";
import { useTransaction } from "../context/TransactionContext";

function TotalSummary() {
    const { transactions } = useTransaction();

    const calculateTotalCostAmount = () => {
        return transactions.reduce((total, transaction) => total + (transaction.costTotal || 0), 0);
    };
    const calculateTotalVatAmount = () => {
        return transactions.reduce((total, transaction) => total + (transaction.vatAmount || 0), 0);
    };

    const calculateTotalAmount = () => {
        return calculateTotalCostAmount() + calculateTotalVatAmount();
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 border-4 border-gray-300 dark:border-gray-700 shadow-lg rounded-lg mt-6 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-start md:items-center justify-between bg-white dark:bg-[rgb(56,127,89)] rounded-lg shadow p-4">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-100">Total Cost Amount</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">
                    €{calculateTotalCostAmount().toFixed(2)}
                </p>
            </div>
            <div className="flex flex-col items-start md:items-center justify-between bg-white dark:bg-[rgb(56,127,89)] rounded-lg shadow p-4">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-100">Total VAT Amount</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-300">
                    €{calculateTotalVatAmount().toFixed(2)}
                </p>
            </div>
            <div className="flex flex-col items-start md:items-center justify-between bg-white dark:bg-[rgb(56,127,89)] rounded-lg shadow p-4">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-100">Total Amount</p>
                <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                    €{calculateTotalAmount().toFixed(2)}
                </p>
            </div>
        </div>
    );
}

export default TotalSummary;
