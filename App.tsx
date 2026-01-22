
import React, { useState } from 'react';
import { Section } from './types.ts';
import { FULL_TEXT, QUIZ } from './constants.tsx';
import TextReader from './components/TextReader.tsx';
import AITutor from './components/AITutor.tsx';
import QuizComponent from './components/QuizComponent.tsx';
import { BookOpen, HelpCircle, MessageSquare, Award, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.Reading);
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#fdfaf5] text-[#2c2c2c]">
      {/* Sidebar Navigation */}
      <nav className="lg:w-20 bg-[#2c1810] text-[#e8dcc4] flex lg:flex-col items-center justify-around py-4 lg:py-8 shadow-2xl z-50 sticky top-0 lg:h-screen w-full">
        <div className="hidden lg:block mb-8">
          <div className="w-12 h-12 bg-[#8b7355] rounded-full flex items-center justify-center text-xl font-bold border-2 border-[#e8dcc4]">阁</div>
        </div>
        <NavItem icon={<BookOpen size={24} />} label="诵读" active={activeSection === Section.Reading} onClick={() => setActiveSection(Section.Reading)} />
        <NavItem icon={<Info size={24} />} label="赏析" active={activeSection === Section.Analysis} onClick={() => setActiveSection(Section.Analysis)} />
        <NavItem icon={<MessageSquare size={24} />} label="问答" active={activeSection === Section.AITutor} onClick={() => setActiveSection(Section.AITutor)} />
        <NavItem icon={<Award size={24} />} label="测试" active={activeSection === Section.Quiz} onClick={() => setActiveSection(Section.Quiz)} />
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-20 border-b border-[#e8dcc4] flex items-center px-6 lg:px-12 bg-white/80 backdrop-blur-md justify-between z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#4a3227] tracking-widest">滕王阁序</h1>
            <span className="text-sm bg-[#8b7355] text-white px-2 py-1 rounded">王勃</span>
          </div>
          <button 
            onClick={() => setShowIntro(true)}
            className="text-[#8b7355] hover:text-[#4a3227] transition-colors"
          >
            <HelpCircle size={24} />
          </button>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] relative">
          <div className="max-w-5xl mx-auto p-4 lg:p-12 min-h-full">
            {activeSection === Section.Reading && <TextReader mode="reading" />}
            {activeSection === Section.Analysis && <TextReader mode="analysis" />}
            {activeSection === Section.AITutor && <AITutor />}
            {activeSection === Section.Quiz && <QuizComponent questions={QUIZ} />}
          </div>
        </div>
      </main>

      {/* Intro Modal */}
      {showIntro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#fdfaf5] max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="h-48 bg-[url('https://picsum.photos/id/1015/800/400')] bg-cover bg-center relative">
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h2 className="text-4xl text-white font-bold tracking-[0.5em] ink-shadow">落霞与孤鹜</h2>
              </div>
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-[#4a3227]">欢迎来到交互式学习空间</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                《滕王阁序》是唐代文学家王勃创作的骈文名篇。本系统将带您穿越千年，通过AI导师、互动解析和意境探索，深入领略这篇旷世神作的魅力。
              </p>
              <button 
                onClick={() => setShowIntro(false)}
                className="bg-[#4a3227] text-[#e8dcc4] px-8 py-3 rounded-full hover:bg-[#2c1810] transition-all transform hover:scale-105"
              >
                开启研读之旅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 lg:w-full transition-all duration-300 ${active ? 'text-white bg-[#8b7355] lg:border-r-4 border-white' : 'text-[#8b7355] hover:text-[#e8dcc4] hover:bg-white/10'}`}
  >
    {icon}
    <span className="text-[10px] lg:text-xs font-medium">{label}</span>
  </button>
);

export default App;
