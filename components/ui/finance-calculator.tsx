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
        const totalPaid = payment * loanTerm
        const interestPaid = totalPaid - loanAmount
