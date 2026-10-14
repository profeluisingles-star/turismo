import React, { useState } from 'react';
import {
  WORKPLACE_PHRASEBOOK,
  PHRASAL_VERBS_TOURISM,
  IRREGULAR_VERBS,
  FLASHCARDS_DATA,
  CAPSTONE_CASE,
} from '../data/curriculumData';
import { speakText } from '../utils/sound';
import {
  Volume2,
  BookOpen,
  Search,
  RotateCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Printer,
  FileText,
} from 'lucide-react';

interface Props {
  speechRate: number;
  onOpenPdfGuide?: () => void;
}

export const ResourcesView: React.FC<Props> = ({ speechRate, onOpenPdfGuide }) => {
  const [activeTab, setActiveTab] = useState<'phrasebook' | 'phrasal' | 'verbs' | 'flashcards' | 'capstone'>('phrasebook');
  const [verbSearch, setVerbSearch] = useState('');
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Capstone reading state
  const [capstoneAnswers, setCapstoneAnswers] = useState<Record<number, string>>({});
  const [capstoneChecked, setCapstoneChecked] = useState(false);

  const handleSpeak = (text: string) => {
    speakText(text, speechRate);
  };

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredVerbs = IRREGULAR_VERBS.filter(
    (v) =>
      v.base.toLowerCase().includes(verbSearch.toLowerCase()) ||
      v.es.toLowerCase().includes(verbSearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Material Didáctico Complementario
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Centro de Recursos, Expresiones y Simulación Capstone
            </h2>
            <p className="text-emerald-100/90 text-sm max-w-2xl">
              Herramientas prácticas para perfeccionar tu fluidez: frases listas para el trabajo, expresiones coloquiales de turistas, lista de verbos, fichas interactivas y simulación de jornada real.
            </p>
          </div>

          {onOpenPdfGuide && (
            <button
              onClick={onOpenPdfGuide}
              className="py-3 px-5 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>📄 Guía de Examen Final en PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('phrasebook')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'phrasebook'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Workplace Phrasebook (20 Frases)
        </button>

        <button
          onClick={() => setActiveTab('phrasal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'phrasal'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Phrasal Verbs & Expresiones Coloquiales
        </button>

        <button
          onClick={() => setActiveTab('verbs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'verbs'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Verbos Imprescindibles (30 Verbos)
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'flashcards'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Fichas Interactivas (Flashcards)
        </button>

        <button
          onClick={() => setActiveTab('capstone')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'capstone'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Simulación Capstone: Eco-Lodge
        </button>
      </div>

      {/* Tab 1: Workplace Phrasebook */}
      {activeTab === 'phrasebook' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Workplace Phrasebook • Frases Listas para Usar en el Trabajo
            </h3>
            <p className="text-xs text-slate-500">
              Fórmulas corteses para recepción, reservas, restaurante y guiado turístico con audio nativo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {WORKPLACE_PHRASEBOOK.map((phrase, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-emerald-300 transition flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900">{phrase.en}</p>
                  <p className="text-xs text-emerald-800">{phrase.es}</p>
                </div>
                <button
                  onClick={() => handleSpeak(phrase.en)}
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shrink-0"
                  title="Escuchar audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Phrasal Verbs */}
      {activeTab === 'phrasal' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Phrasal Verbs & Informal Tourism English
            </h3>
            <p className="text-xs text-slate-500">
              Expresiones para comprender con exactitud a turistas angloparlantes en situaciones informales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {PHRASAL_VERBS_TOURISM.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-emerald-300 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-900">{item.expression}</span>
                  <button
                    onClick={() => handleSpeak(item.example)}
                    className="p-1 text-slate-500 hover:text-emerald-700 transition cursor-pointer"
                    title="Escuchar ejemplo en contexto"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  Significado: <span className="font-normal">{item.meaning}</span>
                </p>
                <p className="text-xs text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                  Ejemplo: "{item.example}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Verbs List */}
      {activeTab === 'verbs' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Useful Verb List • Verbos Imprescindibles en Hotelería
              </h3>
              <p className="text-xs text-slate-500">
                Formas base, pasado simple, participio y significado en español.
              </p>
            </div>
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={verbSearch}
                onChange={(e) => setVerbSearch(e.target.value)}
                placeholder="Buscar verbo en inglés o español..."
                className="pl-8 pr-4 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Base Form</th>
                  <th className="p-3">Past Simple</th>
                  <th className="p-3">Past Participle</th>
                  <th className="p-3">Español</th>
                  <th className="p-3 text-right">Pronunciar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVerbs.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{v.base}</td>
                    <td className="p-3 font-medium text-emerald-800">{v.past}</td>
                    <td className="p-3 text-slate-600">{v.participle}</td>
                    <td className="p-3 text-slate-600">{v.es}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleSpeak(`${v.base}, ${v.past}`)}
                        className="p-1 text-slate-500 hover:text-emerald-700 transition cursor-pointer"
                        title="Escuchar formas"
                      >
                        <Volume2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Fichas Recortables • Flashcards de Comunicación
            </h3>
            <p className="text-xs text-slate-500">
              Haga clic en cada tarjeta para girarla y verificar la traducción al español.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {FLASHCARDS_DATA.map((card, idx) => {
              const isFlipped = !!flippedCards[idx];

              return (
                <div
                  key={idx}
                  onClick={() => toggleFlip(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-300 min-h-[140px] flex flex-col justify-between cursor-pointer select-none shadow-sm hover:shadow-md ${
                    isFlipped
                      ? 'bg-gradient-to-br from-teal-700 to-emerald-900 text-white border-teal-800'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        isFlipped ? 'bg-white/20 text-teal-100' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {card.category}
                    </span>
                    <RotateCw className="w-3.5 h-3.5 opacity-60" />
                  </div>

                  <div className="my-2">
                    <p className="text-sm font-bold leading-snug">
                      {isFlipped ? card.es : card.en}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-current/10 text-[11px] opacity-75">
                    <span>{isFlipped ? 'Español' : 'Inglés (Tocar para girar)'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(card.en);
                      }}
                      className="p-1 hover:opacity-100 cursor-pointer"
                      title="Escuchar audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Capstone Practice */}
      {activeTab === 'capstone' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Práctica Integradora Final
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {CAPSTONE_CASE.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Evaluación práctica de caso real en eco-alojamiento del norte de Costa Rica.
            </p>
          </div>

          {/* Scenario description */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950 text-xs leading-relaxed space-y-2">
            <p className="font-bold">Situación simulada:</p>
            <p>{CAPSTONE_CASE.scenario}</p>
          </div>

          {/* Reading passage */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Lectura comprensiva: Eco-Lodge Overview
              </h4>
              <button
                onClick={() => handleSpeak(CAPSTONE_CASE.readingPassage)}
                className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Escuchar Lectura</span>
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-800 font-serif italic">
              {CAPSTONE_CASE.readingPassage}
            </p>
          </div>

          {/* Interactive Capstone Questions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Preguntas de Comprensión del Caso (Solucionario Orientativo):
            </h4>

            <div className="space-y-3">
              {CAPSTONE_CASE.readingQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <p className="font-bold text-slate-900">{qIdx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = capstoneAnswers[qIdx] === opt;
                      const isCorrect = opt === q.correctAnswer;

                      let btnCls = 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700';
                      if (capstoneChecked) {
                        if (isCorrect) btnCls = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                        else if (isSelected) btnCls = 'bg-red-100 border-red-400 text-red-950 font-bold';
                      } else if (isSelected) {
                        btnCls = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={capstoneChecked}
                          onClick={() => setCapstoneAnswers((prev) => ({ ...prev, [qIdx]: opt }))}
                          className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${btnCls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {capstoneChecked && (
                    <p className="text-[11px] text-emerald-800 font-medium pt-1">
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              {!capstoneChecked ? (
                <button
                  onClick={() => setCapstoneChecked(true)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
                >
                  Verificar Respuestas del Caso
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCapstoneChecked(false);
                    setCapstoneAnswers({});
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer transition"
                >
                  Reiniciar Caso
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
