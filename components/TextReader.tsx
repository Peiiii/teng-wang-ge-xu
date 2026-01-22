
import React, { useState, useMemo } from 'react';
import { FULL_TEXT } from '../constants.tsx';
import { GeminiService } from '../geminiService.ts';
import { Loader2, BookOpen, Volume2, Sparkles } from 'lucide-react';

interface TextReaderProps {
  mode: 'reading' | 'analysis';
}

const TextReader: React.FC<TextReaderProps> = ({ mode }) => {
  const [selectedPara, setSelectedPara] = useState<number | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [speakingPara, setSpeakingPara] = useState<number | null>(null);
  
  const gemini = useMemo(() => new GeminiService(), []);

  const handleExplain = async (text: string, id: number) => {
    if (loading) return;
    setLoading(true);
    setSelectedPara(id);
    try {
      const result = await gemini.explainText(text);
      setAiExplanation(result);
    } catch (error) {
      setAiExplanation("服务连接失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (text: string, id: number) => {
    if (speakingPara === id) return;
    setSpeakingPara(id);
    try {
      const audioBytes = await gemini.speakText(text);
      if (audioBytes) {
        await gemini.playAudio(audioBytes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSpeakingPara(null);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {FULL_TEXT.map((para) => (
        <div 
          key={para.id} 
          className={`group transition-all duration-500 rounded-xl p-6 lg:p-10 border-l-4 ${selectedPara === para.id ? 'bg-white shadow-xl border-[#8b7355]' : 'bg-white/40 border-transparent hover:bg-white/60'}`}
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="relative mb-6">
                <span className="absolute -left-14 top-0 text-3xl text-[#8b7355]/20 font-serif font-bold select-none">{String(para.id).padStart(2, '0')}</span>
                <p className="text-xl lg:text-2xl leading-relaxed text-[#2c1810] font-medium tracking-wide first-letter:text-4xl first-letter:font-bold first-letter:mr-1">
                  {para.content}
                </p>
              </div>

              {mode === 'analysis' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {para.annotations.map((ann, idx) => (
                      <span key={idx} className="bg-[#f0ece2] text-[#8b7355] px-2 py-0.5 rounded text-sm cursor-help hover:bg-[#8b7355] hover:text-white transition-colors">
                        {ann.word}: {ann.meaning}
                      </span>
                    ))}
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg border-l-2 border-amber-200">
                    <p className="text-[#6d4c41] italic text-sm leading-relaxed">
                      <span className="font-bold mr-2">译文：</span>
                      {para.translation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-3 justify-end md:justify-start">
              <button 
                onClick={() => handleExplain(para.content, para.id)}
                className="flex items-center gap-2 px-4 py-2 bg-[#8b7355] text-white rounded-lg hover:bg-[#4a3227] transition-all text-sm font-medium shadow-md"
              >
                {loading && selectedPara === para.id ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                AI 赏析
              </button>
              <button 
                onClick={() => handleSpeak(para.content, para.id)}
                className={`p-2 rounded-full transition-all ${speakingPara === para.id ? 'bg-amber-200 text-amber-700 animate-pulse' : 'text-[#8b7355] hover:bg-amber-100'}`}
                title="语音朗读"
              >
                {speakingPara === para.id ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>

          {/* AI Content Area */}
          {selectedPara === para.id && aiExplanation && (
            <div className="mt-8 p-6 bg-gradient-to-br from-[#fdfaf5] to-white border border-[#e8dcc4] rounded-xl shadow-inner animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="flex items-center gap-2 mb-4 text-[#8b7355]">
                <Sparkles size={18} />
                <h4 className="font-bold">名师精讲</h4>
              </div>
              <div className="prose prose-stone max-w-none text-[#4a3227] leading-loose whitespace-pre-wrap font-serif">
                {aiExplanation}
              </div>
              <button 
                onClick={() => { setSelectedPara(null); setAiExplanation(''); }}
                className="mt-6 text-sm text-[#8b7355] hover:underline"
              >
                收起赏析
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TextReader;
