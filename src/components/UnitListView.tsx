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
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Headphones,
  Languages,
  PenTool,
} from 'lucide-react';

interface Props {
  units: UnitData[];
  stats: UserStats;
  onSelectUnit: (unit: UnitData) => void;
  onOpenPdfGuide: () => void;
  onStartFinalExam: () => void;
  onStartMidtermExam: () => void;
}

export const UnitListView: React.FC<Props> = ({
  units,
  stats,
  onSelectUnit,
  onOpenPdfGuide,
  onStartFinalExam,
  onStartMidtermExam,
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

  // Midterm checkpoint state evaluation (between Block 2 and Block 3)
  const units1to6Passed = [1, 2, 3, 4, 5, 6].every((id) => stats.completedUnits.includes(id));
  const isMidtermUnlocked = units1to6Passed || stats.unlockedUnits.includes(50);
  const isMidtermPassed = Boolean(stats.midtermPassed || stats.completedUnits.includes(50));
  const remedialUnitId = stats.remedialUnitId;
  const remedialUnit = remedialUnitId ? units.find((u) => u.id === remedialUnitId) : null;
  const midtermScoreRecord = stats.unitScores[50];

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
            Al completar la <strong className="text-amber-300">Unidad 6 (Mitad de Plataforma)</strong>, deberás aprobar un examen de comprobación obligatoria antes de acceder a los bloques avanzados.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              Unidades Aprobadas: <span className="text-emerald-300 text-sm font-bold">{stats.completedUnits.filter((id) => id <= 12).length} / 12</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              Control de Mitad de Curso:{' '}
              <span className={`text-sm font-bold ${isMidtermPassed ? 'text-emerald-300' : isMidtermUnlocked ? 'text-amber-300 animate-pulse' : 'text-slate-400'}`}>
                {isMidtermPassed ? '✅ Aprobado' : isMidtermUnlocked ? '⭐ Pendiente Obligatorio' : '🔒 Bloqueado (Completa U1-U6)'}
              </span>
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
              <span>📄 Guía Completa en PDF</span>
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

      {/* Remedial Global Notification Banner if Student Needs Reinforcement */}
      {remedialUnit && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 rounded-2xl shadow-lg border border-red-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-white/20 rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Diagnóstico de Aprendizaje Activo
              </span>
              <h3 className="font-bold text-base mt-1">
                Refuerzo Obligatorio Asignado: Unidad {remedialUnit.id} - {remedialUnit.title}
              </h3>
              <p className="text-xs text-red-100 max-w-2xl mt-0.5 leading-relaxed">
                El Examen de Mitad de Curso identificó debilidades principales en esta unidad. Como parte pedagógica efectiva, debes ingresar a repasar el vocabulario, escucha, transcripción y traducción. Al aprobar su evaluación con mínimo 14/20 pts, completarás el refuerzo y podrás reintentar el Examen de Mitad de Curso.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectUnit(remedialUnit)}
            className="shrink-0 py-3 px-5 bg-white hover:bg-slate-100 text-red-900 font-black text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ir a Unidad {remedialUnit.id} a Reforzar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Blocks Roadmap with Midterm Checkpoint in the middle */}
      <div className="space-y-8">
        {blocks.map((block) => {
          const blockUnits = units.filter((u) => block.unitIds.includes(u.id));
          const allBlockPassed = block.unitIds.every((id) => stats.completedUnits.includes(id));

          return (
            <React.Fragment key={block.id}>
              {/* Regular Block Section */}
              <div className="space-y-4">
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
                    // Block 3 & 4 units require midterm to be passed!
                    const isMidtermBlockerActive = unit.id >= 7 && !isMidtermPassed;
                    const isUnlocked = stats.unlockedUnits.includes(unit.id) && !isMidtermBlockerActive;
                    const isPassed = stats.completedUnits.includes(unit.id);
                    const scoreRecord = stats.unitScores[unit.id];
                    const isRemedialTarget = remedialUnitId === unit.id;

                    return (
                      <div
                        key={unit.id}
                        onClick={() => {
                          if (isUnlocked || isRemedialTarget) {
                            onSelectUnit(unit);
                          }
                        }}
                        className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between relative ${
                          isRemedialTarget
                            ? 'bg-red-50/70 border-2 border-red-500 shadow-lg ring-2 ring-red-400/50 cursor-pointer'
                            : isUnlocked
                            ? 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-lg cursor-pointer group'
                            : 'bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Remedial Target Pill */}
                          {isRemedialTarget && (
                            <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center space-x-1.5 shadow-sm">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>⚠️ Nivel de Refuerzo Obligatorio</span>
                            </div>
                          )}

                          {/* Header Badge */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                                isRemedialTarget
                                  ? 'bg-red-200 text-red-950 font-black'
                                  : isPassed
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
                            ) : isRemedialTarget ? (
                              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                Requiere Repaso
                              </span>
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
                                isRemedialTarget
                                  ? 'text-red-950 font-black'
                                  : isUnlocked
                                  ? 'text-slate-900 group-hover:text-emerald-800'
                                  : 'text-slate-500'
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
                          {isRemedialTarget ? (
                            <>
                              <span className="font-bold text-red-700 flex items-center space-x-1">
                                <span>Reforzar Temas Ahora</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                              </div>
                            </>
                          ) : isUnlocked ? (
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
                              <Lock className="w-3 h-3 shrink-0" />
                              <span>
                                {isMidtermBlockerActive
                                  ? 'Requiere aprobar el Examen de Mitad de Curso'
                                  : `Aprueba la Unidad ${unit.id - 1} para desbloquear`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ======================================================== */}
              {/* MIDTERM CHECKPOINT: EXACTLY AT THE HALF OF THE PLATFORM! */}
              {/* (Placed right after Block 2 / Units 1-6) */}
              {/* ======================================================== */}
              {block.id === 2 && (
                <div
                  className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 border shadow-2xl relative overflow-hidden ${
                    isMidtermPassed
                      ? 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 border-emerald-500/50 text-white'
                      : remedialUnitId
                      ? 'bg-gradient-to-br from-red-950 via-slate-900 to-rose-950 border-red-500/60 text-white'
                      : isMidtermUnlocked
                      ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-emerald-950 border-amber-400 text-white ring-4 ring-amber-400/20'
                      : 'bg-slate-100 border-slate-300 text-slate-600 opacity-80'
                  }`}
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      {/* Checkpoint Status Badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                            isMidtermPassed
                              ? 'bg-emerald-400 text-slate-950'
                              : remedialUnitId
                              ? 'bg-red-500 text-white animate-pulse'
                              : isMidtermUnlocked
                              ? 'bg-amber-400 text-slate-950 animate-bounce'
                              : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {isMidtermPassed
                            ? '✅ Control de Mitad de Curso Aprobado'
                            : remedialUnitId
                            ? '⚠️ Punto de Control: Requiere Refuerzo'
                            : isMidtermUnlocked
                            ? '⭐ Punto de Control Obligatorio: Mitad de Plataforma'
                            : '🔒 Punto de Control: Mitad de Plataforma (Bloqueado)'}
                        </span>

                        <span className="text-xs font-semibold opacity-80">
                          Bloques 1 y 2 • Unidades 1 a 6
                        </span>
                      </div>

                      {/* Main Checkpoint Title */}
                      <h3
                        className={`text-2xl sm:text-3xl font-black tracking-tight ${
                          isMidtermUnlocked ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        Examen de Mitad de Curso (Checkpoint Diagnóstico)
                      </h3>

                      {/* Description depending on state */}
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isMidtermUnlocked ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {isMidtermPassed ? (
                          <>
                            ¡Felicidades! Has comprobado dominio de las 4 competencias clave (vocabulario, escucha, transcripción y traducción) para los Bloques 1 y 2. Tu nota registrada es de{' '}
                            <strong className="text-emerald-300 font-bold">{midtermScoreRecord?.bestScore || 20}/20 pts</strong>. Los Bloques 3 y 4 de turismo rural y atención avanzada están completamente desbloqueados.
                          </>
                        ) : remedialUnitId ? (
                          <>
                            El examen diagnóstico detectó debilidades principales en la{' '}
                            <strong className="text-amber-300 font-bold underline">
                              Unidad {remedialUnitId}: {remedialUnit?.title}
                            </strong>
                            . Por rigor pedagógico, debes ingresar a repasar los temas de esa unidad y completar su práctica antes de volver a presentar este control de mitad de curso.
                          </>
                        ) : isMidtermUnlocked ? (
                          <>
                            Has completado las Unidades 1 a 6. Para asegurar que estás en el camino correcto y garantizar la efectividad de tu aprendizaje, debes aprobar este examen con al menos{' '}
                            <strong className="text-amber-300">14/20 puntos (70%)</strong>. Se evaluará: <strong>Reconocimiento de vocabulario</strong>, <strong>Escucha (Listening)</strong>, <strong>Transcripción</strong> y <strong>Traducción</strong>. Si no lo apruebas, el sistema te retornará automáticamente a tu unidad de mayor debilidad para reforzarla.
                          </>
                        ) : (
                          <>
                            Completa y aprueba las <strong>Unidades 1 a 6</strong> para habilitar este examen obligatorio de mitad de curso. Ningún estudiante puede acceder a las unidades de restaurantes y tours (Unidades 7 a 12) sin superar este punto de control.
                          </>
                        )}
                      </p>

                      {/* Competencies Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold opacity-90">
                        <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                          <BookOpen className="w-3.5 h-3.5" /> Vocabulario Hotelero
                        </span>
                        <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                          <Headphones className="w-3.5 h-3.5" /> Escucha (Listening)
                        </span>
                        <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                          <PenTool className="w-3.5 h-3.5" /> Transcripción
                        </span>
                        <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                          <Languages className="w-3.5 h-3.5" /> Traducción
                        </span>
                        <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                          <ShieldAlert className="w-3.5 h-3.5" /> 20 Pts • 3 Vidas • Antifraude
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons for Checkpoint */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
                      {isMidtermPassed ? (
                        <>
                          <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-4 text-center">
                            <span className="text-xs text-emerald-200 block">Mejor Calificación:</span>
                            <span className="text-2xl font-black text-emerald-300">
                              {midtermScoreRecord?.bestScore || 20} / 20 pts
                            </span>
                          </div>
                          <button
                            onClick={onStartMidtermExam}
                            className="py-3 px-5 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4 text-emerald-700" />
                            <span>Rendir de Nuevo (Práctica)</span>
                          </button>
                        </>
                      ) : remedialUnitId ? (
                        <>
                          <button
                            onClick={() => remedialUnit && onSelectUnit(remedialUnit)}
                            className="py-3.5 px-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-black text-xs rounded-xl shadow-xl transition flex items-center justify-center space-x-2 cursor-pointer ring-2 ring-red-400/60"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>Regresar a Unidad {remedialUnitId} a Reforzar</span>
                          </button>
                          <button
                            onClick={onStartMidtermExam}
                            className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reintentar Examen de Mitad de Curso</span>
                          </button>
                        </>
                      ) : isMidtermUnlocked ? (
                        <button
                          onClick={onStartMidtermExam}
                          className="py-3.5 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-xl transition flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <GraduationCap className="w-5 h-5" />
                          <span>Iniciar Examen de Mitad de Curso (20 pts)</span>
                        </button>
                      ) : (
                        <div className="bg-slate-200/90 text-slate-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-slate-300">
                          <Lock className="w-4 h-4" />
                          <span>Bloqueado (Completa U1-U6)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
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
