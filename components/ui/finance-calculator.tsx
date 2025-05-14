"use client"

import { useState, useEffect } from "react"

interface FinanceCalculatorProps {
  vehiclePrice: number
  className?: string
}

/**
 * Finance Calculator Component
 *
 * A component that allows users to calculate monthly payments for vehicle financing
 *
 * @param vehiclePrice - The price of the vehicle
 * @param className - Additional CSS classes
 */
export const FinanceCalculator = ({ vehiclePrice, className = "" }: FinanceCalculatorProps) => {
  // State for calculator values
  const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * 0.2)) // 20% default down payment
  const [loanTerm, setLoanTerm] = useState(48) // 48 months default
  const [interestRate, setInterestRate] = useState(0.0699) // 6.99% default
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)

  // Calculate financing when values change
  useEffect(() => {
    calculateFinancing()
  }, [vehiclePrice, downPayment, loanTerm, interestRate])

  // Calculate financing values
  const calculateFinancing = () => {
    setIsCalculating(true)
    
    // Simulate calculation delay
    setTimeout(() => {
      try {
        // Calculate loan amount
        const loanAmount = vehiclePrice - downPayment
        
        // Calculate monthly interest rate
        const monthlyRate = interestRate / 12
        
        // Calculate monthly payment
        const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm))
        
        // Calculate total interest
        const totalPaid = payment * loanTerm;
        const interestPaid = totalPaid - loanAmount;

        // Update state with calculated values
        setMonthlyPayment(payment);
        setTotalInterest(interestPaid);
        setTotalCost(vehiclePrice - downPayment + interestPaid);

      } catch (error) {
        console.error("Error calculating financing:", error);
        // Optionally, set error states here
      } finally {
        setIsCalculating(false);
      }
    }, 500); // Simulate 0.5 second delay
  };

  // JSX for the component
  return (
    <div className={`p-6 bg-white shadow-lg rounded-lg ${className}`}>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Calculadora de Financiación</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="vehiclePrice" className="block text-sm font-medium text-gray-700 mb-1">Precio del Vehículo</label>
          <input 
            type="number" 
            id="vehiclePrice" 
            value={vehiclePrice} 
            readOnly 
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">Pago Inicial ({((downPayment / vehiclePrice) * 100).toFixed(0)}%)</label>
          <input 
            type="range" 
            id="downPayment" 
            min={Math.round(vehiclePrice * 0.1)} // Min 10% 
            max={Math.round(vehiclePrice * 0.5)} // Max 50%
            step={100}
            value={downPayment} 
            onChange={(e) => setDownPayment(Number(e.target.value))} 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="text-sm text-gray-600 mt-1">${downPayment.toLocaleString()}</div>
        </div>
        <div>
          <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">Plazo del Préstamo (meses)</label>
          <select 
            id="loanTerm" 
            value={loanTerm} 
            onChange={(e) => setLoanTerm(Number(e.target.value))} 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24">24 meses</option>
            <option value="36">36 meses</option>
            <option value="48">48 meses</option>
            <option value="60">60 meses</option>
            <option value="72">72 meses</option>
          </select>
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">Tasa de Interés Anual (%)</label>
          <input 
            type="number" 
            id="interestRate" 
            step="0.01"
            value={(interestRate * 100).toFixed(2)} 
            onChange={(e) => setInterestRate(Number(e.target.value) / 100)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {isCalculating ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Calculando...</p>
        </div>
      ) : (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Resumen de Financiación</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Pago Mensual Estimado:</span>
              <span className="font-semibold text-blue-600">${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Interés Total Pagado:</span>
              <span className="font-semibold text-blue-600">${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Costo Total del Préstamo (con pago inicial):</span>
              <span className="font-semibold text-blue-600">${(totalCost + downPayment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
