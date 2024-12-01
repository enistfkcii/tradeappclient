import React, { createContext, useState, useContext,useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const TransactionContext = createContext();

export const useTransaction = () => {
  return useContext(TransactionContext);
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = async (transaction) => {
    try {
        const response = await axios.post("http://localhost:5000/api/costs", transaction);
        
        if (response.status === 201) {
          const updatedTransactions = [...transactions, transaction];
          setTransactions(updatedTransactions);
          localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
          toast.success("New record added successfully!");
        }
      } catch (error) {
        console.error("Error adding transaction:", error);
        toast.error("Failed to add record to backend!");
      }
  };

  const removeTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);

    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
     toast.info("Record deleted successfully!");
  };
  
  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);


  
  return (
    <TransactionContext.Provider value={{ transactions, addTransaction,removeTransaction  }}>
      {children}
    </TransactionContext.Provider>
  );
};
