
import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';

interface QuizProps {
  questions: QuizQuestion[];
}

const QuizComponent: React.FC<QuizProps> = ({ questions }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-xl text-center border-t-8 border-[#8b7355] animate-in zoom-in duration-300">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-100 rounded-full mb-6">
          <Trophy className="text-[#8b7355]" size={48} />
        </div>
        <h2 className="text-3xl font-bold text-[#4a3227] mb-2">测试完成！</h2>
        <p className="text-gray-600 mb-8">您的最终得分是</p>
        <div className="text-6xl font-bold text-[#8b7355] mb-12">
          {Math.round((score / questions.length) * 100)}%
        </div>
        <button 
          onClick={resetQuiz}
          className="flex items-center gap-2 mx-auto px-8 py-3 bg-[#4a3227] text-white rounded-full hover:bg-[#2c1810] transition-all"
        >
          <RotateCcw size={18} />
          再次挑战
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm font-bold text-[#8b7355]">
        <span>知识检测 ({currentIdx + 1}/{questions.length})</span>
        <div className="w-48 h-2 bg-[#e8dcc4] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#8b7355] transition-all duration-500" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-xl border border-[#e8dcc4] animate-in slide-in-from-right duration-500">
        <h3 className="text-xl lg:text-2xl font-bold text-[#2c1810] mb-8 leading-relaxed">
          {q.question}
        </h3>

        <div className="space-y-4">
          {q.options.map((opt, idx) => {
            let stateClass = "bg-[#fdfaf5] border-[#e8dcc4] hover:border-[#8b7355] hover:bg-amber-50";
            if (showResult) {
              if (idx === q.correctAnswer) {
                stateClass = "bg-green-50 border-green-500 text-green-700";
              } else if (idx === selectedOption) {
                stateClass = "bg-red-50 border-red-500 text-red-700";
              } else {
                stateClass = "opacity-50 border-[#e8dcc4]";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all group ${stateClass}`}
              >
                <span className="font-medium">{opt}</span>
                {showResult && idx === q.correctAnswer && <CheckCircle2 size={20} className="text-green-500" />}
                {showResult && idx === selectedOption && idx !== q.correctAnswer && <XCircle size={20} className="text-red-500" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-100 animate-in fade-in duration-700">
            <h4 className="font-bold text-[#8b7355] mb-2">解析：</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{q.explanation}</p>
            <button 
              onClick={nextQuestion}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-[#4a3227] text-white rounded-lg hover:bg-[#2c1810] transition-all"
            >
              下一题
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
