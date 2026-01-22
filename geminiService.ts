
import { GoogleGenAI, Modality } from "@google/genai";

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async explainText(text: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一名资深的中国古典文学教授。请深入浅出地解释《滕王阁序》中的以下句子，包括字词含义、修辞手法、文学意境和背后的历史文化典故：\n\n"${text}"`,
      config: {
        temperature: 0.7,
        systemInstruction: "你是一个专业的语文老师，语气温和、博学，能用现代学生易懂的语言解释艰深的古文。"
      }
    });
    return response.text || "抱歉，我暂时无法解释这段文字。";
  }

  async askTutor(question: string, context: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `学生关于《滕王阁序》提出了一个问题：${question}\n\n参考文本背景：${context}`,
      config: {
        temperature: 0.8,
        systemInstruction: "你是一个专注于《滕王阁序》教学的AI助手。你的任务是引导学生思考，解答他们的疑问，激发他们对中国古典文学的兴趣。"
      }
    });
    return response.text || "这个问题太深奥了，让我再思考一下。";
  }

  async speakText(text: string): Promise<Uint8Array | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `请用沉稳、典雅、充满感情的语调朗读这段《滕王阁序》原文：\n\n${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // 使用 Kore 这种较沉稳的声音
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return this.decodeBase64(base64Audio);
      }
    } catch (e) {
      console.error("TTS Error:", e);
    }
    return null;
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async playAudio(bytes: Uint8Array) {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await this.decodeAudioData(bytes, ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
  }

  private async decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
}
