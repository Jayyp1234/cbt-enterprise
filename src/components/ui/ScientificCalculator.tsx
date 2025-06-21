import React, { useState } from 'react';
import { X, RotateCcw, History } from 'lucide-react';

interface ScientificCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');

  const addToHistory = (calculation: string) => {
    setHistory(prev => [calculation, ...prev.slice(0, 9)]); // Keep last 10 calculations
  };

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
      
      addToHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      case '^': return Math.pow(firstValue, secondValue);
      case 'mod': return firstValue % secondValue;
      default: return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      addToHistory(`${previousValue} ${operation} ${inputValue} = ${newValue}`);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const scientificFunction = (func: string) => {
    const value = parseFloat(display);
    let result: number;
    
    switch (func) {
      case 'sin':
        result = angleMode === 'DEG' ? Math.sin(value * Math.PI / 180) : Math.sin(value);
        break;
      case 'cos':
        result = angleMode === 'DEG' ? Math.cos(value * Math.PI / 180) : Math.cos(value);
        break;
      case 'tan':
        result = angleMode === 'DEG' ? Math.tan(value * Math.PI / 180) : Math.tan(value);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'x²':
        result = Math.pow(value, 2);
        break;
      case 'x³':
        result = Math.pow(value, 3);
        break;
      case '1/x':
        result = 1 / value;
        break;
      case 'e^x':
        result = Math.exp(value);
        break;
      case '10^x':
        result = Math.pow(10, value);
        break;
      case 'x!':
        result = factorial(value);
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        result = value;
    }
    
    addToHistory(`${func}(${value}) = ${result}`);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
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

  const memoryStore = () => {
    setMemory(parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-white font-bold text-lg">Scientific Calculator</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              angleMode === 'DEG' ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'
            }`}>
              {angleMode}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              title="History"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="bg-gray-100 p-4 border-b max-h-32 overflow-y-auto">
            <h4 className="font-semibold text-gray-700 mb-2">History</h4>
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">No calculations yet</p>
            ) : (
              <div className="space-y-1">
                {history.map((calc, index) => (
                  <div key={index} className="text-sm text-gray-600 font-mono">
                    {calc}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Display */}
        <div className="bg-gray-900 p-6">
          <div className="text-right">
            <div className="text-white text-2xl font-light min-h-[2.5rem] flex items-center justify-end overflow-hidden">
              {display}
            </div>
            {memory !== 0 && (
              <div className="text-yellow-400 text-sm mt-1">M: {memory}</div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 bg-gray-50">
          {/* Mode and Memory Row */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            <button
              onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              {angleMode}
            </button>
            <button
              onClick={memoryClear}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              MC
            </button>
            <button
              onClick={memoryRecall}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              MR
            </button>
            <button
              onClick={memoryStore}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              MS
            </button>
            <button
              onClick={memoryAdd}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              M+
            </button>
          </div>

          {/* Scientific Functions Row 1 */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            <button
              onClick={() => scientificFunction('sin')}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              sin
            </button>
            <button
              onClick={() => scientificFunction('cos')}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              cos
            </button>
            <button
              onClick={() => scientificFunction('tan')}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              tan
            </button>
            <button
              onClick={() => scientificFunction('log')}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              log
            </button>
            <button
              onClick={() => scientificFunction('ln')}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              ln
            </button>
          </div>

          {/* Scientific Functions Row 2 */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            <button
              onClick={() => scientificFunction('x²')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              x²
            </button>
            <button
              onClick={() => scientificFunction('x³')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              x³
            </button>
            <button
              onClick={() => inputOperation('^')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              x^y
            </button>
            <button
              onClick={() => scientificFunction('sqrt')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              √x
            </button>
            <button
              onClick={() => scientificFunction('1/x')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              1/x
            </button>
          </div>

          {/* Constants and Special Functions */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            <button
              onClick={() => scientificFunction('π')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              π
            </button>
            <button
              onClick={() => scientificFunction('e')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              e
            </button>
            <button
              onClick={() => scientificFunction('x!')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              x!
            </button>
            <button
              onClick={() => inputOperation('mod')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              mod
            </button>
            <button
              onClick={() => {
                setDisplay(display.slice(0, -1) || '0');
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              ⌫
            </button>
          </div>

          {/* Basic Calculator Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <button
              onClick={clear}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-xl transition-colors"
            >
              AC
            </button>
            <button
              onClick={clearEntry}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-xl transition-colors"
            >
              CE
            </button>
            <button
              onClick={toggleSign}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-xl transition-colors"
            >
              +/−
            </button>
            <button
              onClick={() => inputOperation('÷')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              ÷
            </button>

            {/* Numbers and Operations */}
            {[7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => inputNumber(String(num))}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition-colors border border-gray-200"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => inputOperation('×')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              ×
            </button>

            {[4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => inputNumber(String(num))}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition-colors border border-gray-200"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => inputOperation('-')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              −
            </button>

            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => inputNumber(String(num))}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition-colors border border-gray-200"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => inputOperation('+')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              +
            </button>

            <button
              onClick={() => inputNumber('0')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition-colors border border-gray-200 col-span-2"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition-colors border border-gray-200"
            >
              .
            </button>
            <button
              onClick={performCalculation}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;