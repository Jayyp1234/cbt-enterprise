import React from 'react';
import { X, Lightbulb, BookOpen, Target, Zap } from 'lucide-react';
import Button from './Button';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId?: number;
}

const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, questionId = 1 }) => {
  // Sample hints data - in real app, this would come from props or API
  const hints = [
    {
      level: 1,
      title: "Getting Started",
      content: "This is an algebraic equation. Start by identifying what you need to solve for.",
      icon: Target,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50"
    },
    {
      level: 2,
      title: "Isolation Strategy",
      content: "To solve for x, you need to isolate it on one side of the equation. What operation can you perform on both sides?",
      icon: Lightbulb,
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50"
    },
    {
      level: 3,
      title: "Step-by-Step Solution",
      content: "Subtract 3 from both sides: 2x + 3 - 3 = 11 - 3, which gives you 2x = 8. Then divide both sides by 2.",
      icon: BookOpen,
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50"
    }
  ];

  const [currentHintLevel, setCurrentHintLevel] = React.useState(0);
  const [unlockedHints, setUnlockedHints] = React.useState([0]);

  const unlockNextHint = () => {
    if (currentHintLevel < hints.length - 1) {
      const nextLevel = currentHintLevel + 1;
      setCurrentHintLevel(nextLevel);
      setUnlockedHints(prev => [...prev, nextLevel]);
    }
  };

  const selectHint = (level: number) => {
    if (unlockedHints.includes(level)) {
      setCurrentHintLevel(level);
    }
  };

  if (!isOpen) return null;

  const currentHint = hints[currentHintLevel];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Smart Hints</h3>
                <p className="text-indigo-100 text-sm">Get step-by-step guidance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hint Level Selector */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-700">Hint Levels</h4>
            <span className="text-sm text-gray-500">
              {unlockedHints.length} of {hints.length} unlocked
            </span>
          </div>
          <div className="flex space-x-2">
            {hints.map((hint, index) => (
              <button
                key={index}
                onClick={() => selectHint(index)}
                disabled={!unlockedHints.includes(index)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                  currentHintLevel === index
                    ? `${hint.color} border-transparent text-white shadow-lg`
                    : unlockedHints.includes(index)
                    ? 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  <hint.icon className={`w-5 h-5 mx-auto mb-1 ${
                    currentHintLevel === index ? 'text-white' : 
                    unlockedHints.includes(index) ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <div className="text-xs font-medium">Level {index + 1}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Hint Content */}
        <div className="p-6">
          <div className={`${currentHint.bgColor} rounded-xl p-6 mb-6`}>
            <div className="flex items-start space-x-4">
              <div className={`${currentHint.color} p-3 rounded-lg`}>
                <currentHint.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h5 className={`font-bold ${currentHint.textColor} mb-2`}>
                  {currentHint.title}
                </h5>
                <p className={`${currentHint.textColor} leading-relaxed`}>
                  {currentHint.content}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {currentHintLevel < hints.length - 1 ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  onClick={unlockNextHint}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Next Hint
                </Button>
              </>
            ) : (
              <Button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Target className="w-4 h-4 mr-2" />
                Got it! Let's solve
              </Button>
            )}
          </div>

          {/* Hint Usage Warning */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 bg-amber-400 rounded-full mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="text-amber-800 text-sm font-medium">Premium Feature</p>
                <p className="text-amber-700 text-xs mt-1">
                  Using hints may affect your performance score. Use them wisely to learn better!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HintModal;