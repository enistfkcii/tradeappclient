import React, { useState, useEffect } from 'react';
import CostForm from "./components/CostForm";
import { TransactionProvider } from "./context/TransactionContext";
import CostTable from "./components/CostTable";
import { ToastContainer } from "react-toastify";
import TotalSummary from "./components/TotalSummary";
import logo from './images/logo3.png';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  return (
    <TransactionProvider>
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt="FruPro Logo"
              className="h-8"
            />
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              Trade Management
            </span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={toggleDarkMode}
              className="flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-100 rounded-lg shadow-md hover:bg-orange-200 dark:hover:bg-orange-700 transition focus:outline-none"
            >
              {darkMode ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m8.66-7.34h-1M4.34 12H3m15.07 6.07l-.71-.71M6.34 6.34l-.71-.71M17.66 6.34l.71-.71M6.34 17.66l.71.71M12 5a7 7 0 100 14 7 7 0 000-14z"
                    />
                  </svg>
                  Light Mode
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3a9 9 0 100 18 9 9 0 010-18zm0 0v1m0 16v1m8.66-7.34h-1M4.34 12H3m15.07 6.07l-.71-.71M6.34 6.34l-.71-.71M17.66 6.34l.71-.71M6.34 17.66l.71.71"
                    />
                  </svg>
                  Dark Mode
                </>
              )}
            </button>
          </div>

        </div>
      </div>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors duration-300 pt-20">
        <div className="container mx-auto p-4">
          <div className="space-y-6">
            <CostForm />
            <CostTable />
            <TotalSummary />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </TransactionProvider>
  );
}

export default App;
