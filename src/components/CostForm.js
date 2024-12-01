import React, { useState, useEffect } from "react";
import { COST_TYPES } from "../utils/constants";
import { toast } from "react-toastify";
import { useTransaction } from "../context/TransactionContext";

function CostForm() {
    const { addTransaction } = useTransaction();
    const [costType, setCostType] = useState(COST_TYPES[0].name);
    const [description, setDescription] = useState("");
    const [pricingType, setPricingType] = useState("Price per box");
    const [currency, setCurrency] = useState("EUR");
    const [price, setPrice] = useState("");
    const [vatRate, setVatRate] = useState("");
    const [costTotal, setCostTotal] = useState("0.00");
    const [vatAmount, setVatAmount] = useState("0.00");
    const [consignment, setConsignment] = useState("");
    const [kilogram, setKilogram] = useState("");

    useEffect(() => {
        const initialCostType = COST_TYPES[0];
        if (initialCostType.vatRate !== null) {
            setVatRate(initialCostType.vatRate);
            const initialVatAmount = (0 * initialCostType.vatRate) / 100;
            setVatAmount(initialVatAmount.toFixed(2));
        }
    }, []);

    const handlePricingTypeChange = (value) => {
        setPricingType(value);
        setConsignment("");
        setKilogram("");
        setCostTotal("0.00");
        setVatAmount("0.00");
        setPrice("");
    };
    
    const handleConsignmentChange = (value) => {
        const parsedConsignment = Math.max(0, parseFloat(value || 0));
        setConsignment(parsedConsignment);
    
        if (pricingType === "Price per box") {
            const calculatedPrice = price * parsedConsignment;

            if (vatRate) {
                const vat = (calculatedPrice * vatRate) / 100;
                setVatAmount(vat.toFixed(2));
                setCostTotal((calculatedPrice + vat).toFixed(2));
            } else {
                setCostTotal(calculatedPrice.toFixed(2));
            }
        }
    };

    const handleKilogramChange = (value) => {
        const parsedKilogram = Math.max(0, parseFloat(value || 0));
        setKilogram(parsedKilogram);
    
        if (pricingType === "Price per kilo") {
            const calculatedPrice = price * parsedKilogram;

            if (vatRate) {
                const vat = (calculatedPrice * vatRate) / 100;
                setVatAmount(vat.toFixed(2));
                setCostTotal((calculatedPrice + vat).toFixed(2));
            } else {
                setCostTotal(calculatedPrice.toFixed(2));
            }
        }
    };

    const handleCostTypeChange = (selectedType) => {
        setCostType(selectedType);
        const selectedCostType = COST_TYPES.find((type) => type.name === selectedType);

        if (selectedCostType && selectedCostType.vatRate !== null) {
            setVatRate(selectedCostType.vatRate);
            const vatAmount = (price * selectedCostType.vatRate) / 100;
            setVatAmount(vatAmount.toFixed(2));
        } else {
            setVatRate("");
            setVatAmount("0.00");
        }
    };

    const handlePriceChange = (value) => {
        const parsedPrice = Math.max(0, parseFloat(value || 0));
        setPrice(parsedPrice);

        
        let calculatedPrice = parsedPrice;
        if (pricingType === "Price per kilo" && kilogram) {
            calculatedPrice *= parseFloat(kilogram);
        } else if (pricingType === "Price per box" && consignment) {
            calculatedPrice *= parseFloat(consignment);
        }

        if (vatRate) {
            const vat = (calculatedPrice * vatRate) / 100;
            setVatAmount(vat.toFixed(2));
            setCostTotal((calculatedPrice + vat).toFixed(2));
        } else {
            setCostTotal(calculatedPrice.toFixed(2));
        }
    };

    const handleVatRateChange = (value) => {
        const parsedVatRate = Math.max(0, parseFloat(value || 0));
        setVatRate(parsedVatRate);

        const calculatedPrice =
            pricingType === "Price per kilo" && kilogram
                ? price * kilogram
                : pricingType === "Price per box" && consignment
                ? price * consignment
                : price;

        const vat = (calculatedPrice * parsedVatRate) / 100;
        setVatAmount(vat.toFixed(2));
        setCostTotal((calculatedPrice + vat).toFixed(2));
    };

    const handleVatAmountChange = (value) => {
        const parsedVatAmount = parseFloat(value || 0);
        setVatAmount(parsedVatAmount.toFixed(2));
    };

    const handleAddCost = () => {
        if (!price || !vatRate || !costType) {
            toast.error("Please fill in all required fields!");
            return;
        }
    if (pricingType === "Price per box" && (!consignment || consignment <= 0)) {
        toast.error("Please enter a valid consignment count!");
        return;
    }

    if (pricingType === "Price per kilo" && (!kilogram || kilogram <= 0)) {
        toast.error("Please enter a valid kilogram amount!");
        return;
    }

        const newTransaction = {
            costType,
            description,
            pricingType,
            price: parseFloat(price),
            vatRate: parseFloat(vatRate),
            costTotal: parseFloat(costTotal),
            vatAmount: parseFloat(vatAmount),
            consignment: pricingType === "Price per box" ? consignment : null,
            kilogram: pricingType === "Price per kilo" ? kilogram : null,
            currency,
        };

        addTransaction(newTransaction);
        resetForm();
    };

    const resetForm = () => {
        setCostType(COST_TYPES[0].name);
        setDescription("");
        setPricingType("Price per box");
        setCurrency("EUR");
        setPrice("");
        setVatRate("");
        setCostTotal("0.00");
        setVatAmount("0.00");
        setConsignment("");
        setKilogram("");
    };

    return (
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-4 border-gray-300 dark:border-gray-700 shadow-lg rounded-lg p-6 space-y-6">
            <div className={`grid ${pricingType === "Price per box" || pricingType === "Price per kilo" ? "grid-cols-3" : "grid-cols-2"} gap-6`}>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                        Cost Type
                    </label>
                    <select
                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-400"
                        value={costType}
                        onChange={(e) => handleCostTypeChange(e.target.value)}
                    >
                        {COST_TYPES.map((type, index) => (
                            <option key={index} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                        Pricing Type
                    </label>
                    <select
                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-400"
                        value={pricingType}
                        onChange={(e) => handlePricingTypeChange(e.target.value)}
                    >
                        <option value="Price per box">Price per box</option>
                        <option value="Price per kilo">Price per kilo</option>
                        <option value="Price per consignment">Price per consignment</option>
                    </select>
                </div>
                {pricingType === "Price per box" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                            Consignment (Box Count)
                        </label>
                        <input
                            min="0"
                            type="number"
                            className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md"
                            value={consignment}
                            onChange={(e) => handleConsignmentChange(e.target.value)}
                        />
                    </div>
                )}
                {pricingType === "Price per kilo" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                            Kilogram
                        </label>
                        <input
                            min="0"
                            type="number"
                            className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md"
                            value={kilogram}
                            onChange={(e) => handleKilogramChange(e.target.value)}
                        />
                    </div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Description
                </label>
                <input
                    type="text"
                    className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-400"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Currency
                </label>
                <div className="flex items-center gap-4">
                    <select
                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-400"
                        value={"EUR"}
                        disabled
                    >
                        <option value="EUR">EUR</option>
                    </select>
                    <input
                        type="text"
                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-400"
                        value="1.18"
                        disabled
                    />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                        Price
                    </label>
                    <input
                        min="0"
                        type="number"
                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-400"
                        value={price}
                        onChange={(e) => handlePriceChange(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                        Cost Total
                    </label>
                    <input
                        type="text"
                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-400"
                        value={costTotal}
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                        VAT Rate %
                    </label>
                    <input
                        min="0"
                        type="number"
                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-400"
                        value={vatRate}
                        onChange={(e) => handleVatRateChange(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                        VAT Amount
                    </label>
                    <input
                        min="0"
                        type="number"
                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-400"
                        value={vatAmount}
                        onChange={(e) => handleVatAmountChange(e.target.value)}
                    />
                </div>
            </div>
    
            <div className="flex justify-start">
                <button
                    type="button"
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    onClick={handleAddCost}
                >
                    Add Cost
                </button>
            </div>
        </div>
    );
    
    
}

export default CostForm;
