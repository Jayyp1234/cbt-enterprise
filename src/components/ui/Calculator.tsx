import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import Button from './Button';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
    }
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Calculator</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display */}
        <div className="bg-gray-900 p-6">
          <div className="text-right">
            <div className="text-white text-3xl font-light min-h-[3rem] flex items-center justify-end overflow-hidden">
              {display}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <button
              onClick={clear}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 rounded-xl transition-colors"
            >
              AC
            </button>
            <button
              onClick={clearEntry}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 rounded-xl transition-colors"
            >
              CE
            </button>
            <button
              onClick={percentage}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 rounded-xl transition-colors"
            >
              %
            </button>
            <button
              onClick={() => inputOperation('÷')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              ÷
            </button>

            {/* Row 2 */}
            <button
              onClick={() => inputNumber('7')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              7
            </button>
            <button
              onClick={() => inputNumber('8')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              8
            </button>
            <button
              onClick={() => inputNumber('9')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              9
            </button>
            <button
              onClick={() => inputOperation('×')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              ×
            </button>

            {/* Row 3 */}
            <button
              onClick={() => inputNumber('4')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              4
            </button>
            <button
              onClick={() => inputNumber('5')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              5
            </button>
            <button
              onClick={() => inputNumber('6')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              6
            </button>
            <button
              onClick={() => inputOperation('-')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              −
            </button>

            {/* Row 4 */}
            <button
              onClick={() => inputNumber('1')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              1
            </button>
            <button
              onClick={() => inputNumber('2')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              2
            </button>
            <button
              onClick={() => inputNumber('3')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              3
            </button>
            <button
              onClick={() => inputOperation('+')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={() => inputNumber('0')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200 col-span-2"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl transition-colors border border-gray-200"
            >
              .
            </button>
            <button
              onClick={performCalculation}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              =
            </button>
          </div>

          {/* Additional Functions */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              onClick={toggleSign}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-xl transition-colors"
            >
              +/−
            </button>
            <button
              onClick={() => {
                const value = parseFloat(display);
                setDisplay(String(Math.sqrt(value)));
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-xl transition-colors"
            >
              √
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;