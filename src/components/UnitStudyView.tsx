import React, { useState } from 'react';
import { UnitData } from '../types';
import { speakText } from '../utils/sound';
import {
  BookOpen,
  Volume2,
  MessageSquare,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

interface Props {
  unit: UnitData;
  speechRate: number;
  bestScore?: number;
  passed?: boolean;
  isRemedial?: boolean;
  onStartExam: () => void;
  onBack: () => void;
}

export const UnitStudyView: React.FC<Props> = ({
  unit,
  speechRate,
  bestScore,
  passed,
  isRemedial,
  onStartExam,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar' | 'dialogue' | 'speaking' | 'practice'>('vocab');
  const [showTranslations, setShowTranslations] = useState(true);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [showPracticeResult, setShowPracticeResult] = useState(false);

  // Play audio helper
  const handleSpeak = (text: string) => {
    speakText(text, speechRate);
  };

  const practiceQ = unit.questionBank[currentPracticeIndex % unit.questionBank.length];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Remedial Reinforcement Banner */}
      {isRemedial && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-red-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-white/20 rounded-2xl shrink-0 mt-0.5">
              <AlertCircle className="w-7 h-7 text-amber-200" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Misión Pedagógica de Refuerzo
                </span>
                <span className="text-xs text-red-200 font-semibold">
                  Examen de Mitad de Curso
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Nivel Específico Asignado para Reforzar Competencias
              </h3>
              <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
                El control diagnóstico de mitad de curso identificó que debes consolidar los temas de esta unidad. Para garantizar que estés en el camino correcto hacia la fluidez, repasa el <strong>vocabulario con pronunciación</strong>, practica los <strong>ejercicios de escucha</strong> y realiza la <strong>traducción</strong>. Al aprobar la evaluación oficial de esta unidad con al menos 14/20 pts, completarás el refuerzo y quedarás habilitado para reintentar el Examen de Mitad de Curso.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('practice')}
            className="shrink-0 py-3 px-5 bg-white hover:bg-slate-100 text-red-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            Practicar Ahora
          </button>
        </div>
      )}

      {/* Unit Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-emerald-300 hover:text-white flex items-center space-x-1 mb-2 transition cursor-pointer"
          >
            ← Volver a la lista de unidades
          </button>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/30 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              {unit.blockTitle}
            </span>
            {passed && (
              <span className="bg-emerald-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aprobada ({bestScore}/20 pts)</span>
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {unit.title}
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl">
            <span className="font-semibold text-white">Meta comunicativa:</span> {unit.learningOutcome}
          </p>
        </div>

        {/* Start Official Exam CTA */}
        <div className="shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center space-y-2.5">
          <p className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">
            Evaluación Oficial Calificada
          </p>
          <div className="text-xs text-white/90 font-medium">
            20 Puntos • 3 Vidas (❤️❤️❤️) • Antifraude
          </div>
          <button
            onClick={onStartExam}
            className="w-full py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Iniciar Examen de 20 Pts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
            activeTab === 'vocab'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ficha de Vocabulario ({unit.vocabulary.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('grammar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
            activeTab === 'grammar'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Gramática en Acción</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
            activeTab === 'dialogue'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Diálogo Laboral & Dramatización</span>
        </button>

        <button
          onClick={() => setActiveTab('speaking')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
            activeTab === 'speaking'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Reto Oral (Speaking Challenge)</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Práctica Libre (Sin perder vidas)</span>
        </button>
      </div>

      {/* Tab 1: Vocabulary Bank */}
      {activeTab === 'vocab' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ficha Didáctica • Banco de Vocabulario
              </h3>
              <p className="text-xs text-slate-500">
                Escuche la pronunciación nativa y practique en voz alta cada término turístico.
              </p>
            </div>
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 cursor-pointer"
            >
              {showTranslations ? 'Ocultar Español' : 'Mostrar Español'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {unit.vocabulary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm bg-slate-50/50 transition flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900">{item.en}</span>
                    <button
                      onClick={() => handleSpeak(item.en)}
                      className="p-1 rounded-full text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                      title="Escuchar pronunciación"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  {showTranslations && (
                    <p className="text-xs font-medium text-emerald-800">{item.es}</p>
                  )}
                  {item.exampleEn && (
                    <p className="text-[11px] text-slate-500 pt-1 italic">
                      "{item.exampleEn}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Grammar in Action */}
      {activeTab === 'grammar' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Grammar in Action • {unit.grammarTitle}
            </h3>
            <p className="text-xs text-slate-500">
              Estructuras fundamentales aplicadas al contexto de hospitalidad y turismo rural.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {unit.grammarPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
              >
                <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Regla Clave: {pt.rule}
                </p>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{pt.exampleEn}</p>
                    <p className="text-xs text-slate-500">{pt.exampleEs}</p>
                  </div>
                  <button
                    onClick={() => handleSpeak(pt.exampleEn)}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                    title="Escuchar ejemplo"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Workplace Dialogue */}
      {activeTab === 'dialogue' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Workplace Dialogue • Lea y Dramatice
              </h3>
              <p className="text-xs text-slate-500">
                Simulación real de atención entre recepcionista/guía y huésped.
              </p>
            </div>
            <button
              onClick={() => {
                const fullText = unit.dialogue.map((d) => `${d.speaker} says: ${d.en}`).join('. ');
                handleSpeak(fullText);
              }}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Escuchar Todo el Diálogo</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {unit.dialogue.map((line, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  line.role === 'staff' || line.role === 'guide'
                    ? 'bg-emerald-50/50 border-emerald-200 ml-0 sm:mr-8'
                    : 'bg-sky-50/50 border-sky-200 ml-0 sm:ml-8'
                } space-y-1.5`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      line.role === 'staff' || line.role === 'guide'
                        ? 'bg-emerald-200/80 text-emerald-950'
                        : 'bg-sky-200/80 text-sky-950'
                    }`}
                  >
                    {line.speaker} ({line.role === 'staff' || line.role === 'guide' ? 'Colaborador' : 'Huésped'})
                  </span>
                  <button
                    onClick={() => handleSpeak(line.en)}
                    className="p-1 rounded text-slate-600 hover:text-emerald-700 transition cursor-pointer"
                    title="Escuchar línea"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-900">{line.en}</p>
                <p className="text-xs text-slate-500">{line.es}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Speaking Challenge */}
      {activeTab === 'speaking' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Speaking Challenge • Reto de Comunicación Oral</span>
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-950 space-y-3 text-sm leading-relaxed">
            <p className="font-semibold text-amber-900">{unit.speakingChallenge}</p>
            <p className="text-xs text-amber-800">
              💡 Consejo pedagógico del Profe Luis: Practique primero a velocidad pausada (0.8x) y luego con entonación natural (1.0x). Recuerde hablar con cortesía y claridad.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Practice Mode */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Modo Práctica Libre (Sin Vidas en Juego)
              </h3>
              <p className="text-xs text-slate-500">
                Resuelva ejercicios de entrenamiento para afianzar el conocimiento antes del examen oficial.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Ejercicio {(currentPracticeIndex % unit.questionBank.length) + 1} de {unit.questionBank.length}
            </span>
          </div>

          {practiceQ && (
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-sm">{practiceQ.prompt}</p>
                {(practiceQ.type === 'listening' || practiceQ.audioText) && (
                  <button
                    onClick={() => handleSpeak(practiceQ.audioText || practiceQ.prompt)}
                    className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Escuchar</span>
                  </button>
                )}
              </div>

              {practiceQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {practiceQ.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        setPracticeAnswer(opt);
                        setShowPracticeResult(true);
                      }}
                      className={`p-3 text-left rounded-xl border text-xs font-medium transition cursor-pointer ${
                        practiceAnswer === opt
                          ? opt === practiceQ.correctAnswer
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-red-100 border-red-400 text-red-950 font-bold'
                          : 'bg-white border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {showPracticeResult && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-emerald-800">
                    Respuesta correcta: {practiceQ.correctAnswer}
                  </p>
                  <p className="text-slate-600">{practiceQ.explanation}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setCurrentPracticeIndex((prev) => prev + 1);
                    setPracticeAnswer('');
                    setShowPracticeResult(false);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer hover:bg-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Siguiente Ejercicio de Práctica</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
