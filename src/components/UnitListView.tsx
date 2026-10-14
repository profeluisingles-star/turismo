import React from 'react';
import { UnitData, UserStats } from '../types';
import {
  Lock,
  CheckCircle,
  Play,
  Award,
  ChevronRight,
  BookOpen,
  FileText,
  Printer,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

interface Props {
  units: UnitData[];
  stats: UserStats;
  onSelectUnit: (unit: UnitData) => void;
  onOpenPdfGuide: () => void;
  onStartFinalExam: () => void;
}

export const UnitListView: React.FC<Props> = ({
  units,
  stats,
  onSelectUnit,
  onOpenPdfGuide,
  onStartFinalExam,
}) => {
  // Group units by block
  const blocks = [
    {
      id: 1,
      title: 'Bloque 1: Saludar, presentarse, dar información básica',
      product: 'Producto: Conversación de bienvenida',
      unitIds: [1, 2, 3],
    },
    {
      id: 2,
      title: 'Bloque 2: Recibir reservas, hacer check-in y orientar',
      product: 'Producto: Registro de huésped y recorrido',
      unitIds: [4, 5, 6],
    },
    {
      id: 3,
      title: 'Bloque 3: Restaurante, excursiones y turismo rural',
      product: 'Producto: Servicio y explicación de tour',
      unitIds: [7, 8, 9],
    },
    {
      id: 4,
      title: 'Bloque 4: Quejas, seguridad, ventas y entrevista',
      product: 'Producto: Simulación de jornada completa',
      unitIds: [10, 11, 12],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Overview Progress Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Costa Rica • Inglés Turístico Oficial
            </span>
            <span className="text-emerald-300 text-xs">A1 → B1 Inicial</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ruta de Aprendizaje Secuencial
          </h2>
          <p className="text-emerald-100/90 text-sm max-w-2xl leading-relaxed">
            Avanza unidad por unidad. Cada unidad incluye vocabulario con pronunciación, gramática aplicada, diálogos reales y una{' '}
            <strong className="text-white">evaluación de 20 pts con 3 vidas</strong>. No se permite adelantar sin aprobar la unidad previa con al menos 14/20 puntos (70%).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              Unidades Aprobadas: <span className="text-emerald-300 text-sm font-bold">{stats.completedUnits.length} / 12</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              Puntos XP: <span className="text-amber-300 text-sm font-bold">{stats.xp} XP</span>
            </div>

            <button
              onClick={onOpenPdfGuide}
              className="py-2 px-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer ml-auto"
              title="Abrir o descargar la guía completa de estudio en PDF"
            >
              <FileText className="w-4 h-4" />
              <span>📄 Descargar / Imprimir Guía en PDF</span>
            </button>

            <button
              onClick={onStartFinalExam}
              className="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
              title="Rendir el examen final comprensivo de 20 puntos con 3 vidas"
            >
              <Sparkles className="w-4 h-4" />
              <span>🏆 Examen Final Oficial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Blocks Roadmap */}
      <div className="space-y-8">
        {blocks.map((block) => {
          const blockUnits = units.filter((u) => block.unitIds.includes(u.id));
          const allBlockPassed = block.unitIds.every((id) => stats.completedUnits.includes(id));

          return (
            <div key={block.id} className="space-y-4">
              {/* Block Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-1">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <span>{block.title}</span>
                    {allBlockPassed && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </h3>
                  <p className="text-xs font-medium text-emerald-700">{block.product}</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {blockUnits.filter((u) => stats.completedUnits.includes(u.id)).length} de {blockUnits.length} unidades aprobadas
                </span>
              </div>

              {/* Units Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {blockUnits.map((unit) => {
                  const isUnlocked = stats.unlockedUnits.includes(unit.id);
                  const isPassed = stats.completedUnits.includes(unit.id);
                  const scoreRecord = stats.unitScores[unit.id];

                  return (
                    <div
                      key={unit.id}
                      onClick={() => {
                        if (isUnlocked) {
                          onSelectUnit(unit);
                        }
                      }}
                      className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
                        isUnlocked
                          ? 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-lg cursor-pointer group'
                          : 'bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Header Badge */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                              isPassed
                                ? 'bg-emerald-100 text-emerald-800'
                                : isUnlocked
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            Unidad {unit.id}
                          </span>

                          {isPassed ? (
                            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold">
                              <CheckCircle className="w-4 h-4" />
                              <span>{scoreRecord?.bestScore || 20}/20 pts</span>
                            </div>
                          ) : isUnlocked ? (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              Disponible
                            </span>
                          ) : (
                            <div className="flex items-center space-x-1 text-slate-400 text-xs font-medium">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Bloqueada</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Outcome */}
                        <div>
                          <h4
                            className={`font-bold text-sm leading-snug ${
                              isUnlocked ? 'text-slate-900 group-hover:text-emerald-800' : 'text-slate-500'
                            }`}
                          >
                            {unit.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {unit.learningOutcome}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        {isUnlocked ? (
                          <>
                            <span className="font-semibold text-emerald-700 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                              <span>Estudiar y Evaluar</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          </>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Aprueba la Unidad {unit.id - 1} para desbloquear</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Certification & Study Guide Module Card */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Evaluación Integradora Final
            </span>
            <span className="text-emerald-300 text-xs font-semibold">Bloques 1 al 4</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Examen Final Comprensivo & Balotario de Estudio (PDF)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Prepárate para la prueba final oficial con la guía maestra descargable en PDF (120 términos de vocabulario, 20 frases de trabajo, 12 phrasal verbs, 30 verbos y rúbrica oficial de 20 pts). Al finalizar, tu nota y desglose se enviarán directamente al correo del Profe Luis.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-emerald-200">
            <span>✔ 20 Puntos / 20 Preguntas aleatorias</span>
            <span>•</span>
            <span>✔ 3 Vidas (❤️❤️❤️)</span>
            <span>•</span>
            <span>✔ Reporte oficial a profeluisingles@gmail.com</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={onOpenPdfGuide}
            className="py-3 px-5 bg-white text-slate-900 hover:bg-slate-100 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>Descargar / Imprimir Guía PDF</span>
          </button>

          <button
            onClick={onStartFinalExam}
            className="py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Iniciar Examen Final Oficial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
