import React, { useState } from "react";
import { useTransaction } from "../context/TransactionContext";
import ReactPaginate from "react-paginate";
import { FaTrash } from "react-icons/fa";

function CostTable() {
  const { transactions, removeTransaction } = useTransaction();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const recordsPerPage = 5;

  const filteredTransactions = transactions.filter((transaction) =>
    Object.values(transaction).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRecord = (currentPage + 1) * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredTransactions.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleDelete = (index) => {
    const absoluteIndex = currentPage * recordsPerPage + index;
    removeTransaction(absoluteIndex);

    if (currentRecords.length === 1 && currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          No records found. Please add a cost.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gray-100 dark:bg-gray-900 border-4 border-gray-300 dark:border-gray-700 shadow-lg rounded-lg p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-[rgb(85,217,146)] dark:bg-[rgb(56,127,89)] text-gray-800 dark:text-gray-100">
            <tr>
              <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-left text-lg font-semibold">
                Cost Type
              </th>
              <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-left text-lg font-semibold">
                Description
              </th>
              <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-left text-lg font-semibold">
                Pricing Type
              </th>
              <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-left text-lg font-semibold">
                Price
              </th>
              <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-left text-lg font-semibold">
                VAT Rate
              </th>
              <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-left text-lg font-semibold">
                Cost Total
              </th>
              <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-left text-lg font-semibold">
                VAT Amount
              </th>
              <th className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-left text-lg font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((transaction, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-gray-50 dark:bg-gray-800"
                } hover:bg-gray-200 dark:hover:bg-gray-600`}
              >
                <td className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-base font-medium text-gray-900 dark:text-gray-300">
                  {transaction.costType}
                </td>
                <td className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-base font-medium text-gray-900 dark:text-gray-300">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-base font-medium text-gray-900 dark:text-gray-300">
                  {transaction.pricingType}
                </td>
                <td className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-base font-medium text-gray-900 dark:text-gray-300">
                  €{(transaction.price || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-base font-medium text-gray-900 dark:text-gray-300">
                  {transaction.vatRate}%
                </td>
                <td className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-base font-medium text-gray-900 dark:text-gray-300">
                  €{(transaction.costTotal || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-base font-medium text-gray-900 dark:text-gray-300">
                  €{(transaction.vatAmount || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 border border-gray-400 dark:border-gray-600 text-base font-medium text-center">
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length > recordsPerPage && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredTransactions.length / recordsPerPage)}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={
            "pagination flex flex-wrap justify-center mt-4 gap-2"
          }
          pageClassName={
            "px-3 py-2 border border-gray-400 dark:border-gray-700 rounded-lg bg-[rgb(85,217,146)] dark:bg-[rgb(56,127,89)] text-gray-800 dark:text-gray-100 hover:bg-[rgb(76,200,130)] dark:hover:bg-[rgb(48,115,81)]"
          }
          activeClassName={
            "bg-[rgb(56,127,89)] text-white dark:bg-[rgb(85,217,146)] font-bold"
          }
          previousClassName={
            "px-3 py-2 border border-gray-400 dark:border-gray-700 rounded-lg bg-[rgb(85,217,146)] dark:bg-[rgb(56,127,89)] text-gray-800 dark:text-gray-100 hover:bg-[rgb(76,200,130)] dark:hover:bg-[rgb(48,115,81)]"
          }
          nextClassName={
            "px-3 py-2 border border-gray-400 dark:border-gray-700 rounded-lg bg-[rgb(85,217,146)] dark:bg-[rgb(56,127,89)] text-gray-800 dark:text-gray-100 hover:bg-[rgb(76,200,130)] dark:hover:bg-[rgb(48,115,81)]"
          }
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      )}
    </div>
  );
}

export default CostTable;
