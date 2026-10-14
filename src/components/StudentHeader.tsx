import React from 'react';
import { StudentProfile, UserStats } from '../types';
import {
  Award,
  Flame,
  Volume2,
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  FileText,
} from 'lucide-react';

interface Props {
  profile: StudentProfile | null;
  stats: UserStats;
  currentSpeechRate: number;
  onSpeechRateChange: (rate: number) => void;
  onOpenProfile: () => void;
  onOpenTeacherPortal: () => void;
  onOpenPdfGuide: () => void;
  activeView: 'units' | 'resources' | 'teacher';
  onNavigate: (view: 'units' | 'resources' | 'teacher') => void;
}

export const StudentHeader: React.FC<Props> = ({
  profile,
  stats,
  currentSpeechRate,
  onSpeechRateChange,
  onOpenProfile,
  onOpenTeacherPortal,
  onOpenPdfGuide,
  activeView,
  onNavigate,
}) => {
  // Compute student level from completed units
  const completedCount = stats.completedUnits.length;
  let levelTitle = 'Turista Novato';
  let levelNumber = 1;
  if (completedCount >= 12) {
    levelTitle = 'Gerente Eco-Lodge';
    levelNumber = 6;
  } else if (completedCount >= 9) {
    levelTitle = 'Guía Bilingüe Certificado';
    levelNumber = 5;
  } else if (completedCount >= 6) {
    levelTitle = 'Concierge y Reservas';
    levelNumber = 4;
  } else if (completedCount >= 3) {
    levelTitle = 'Recepcionista Bilingüe';
    levelNumber = 3;
  } else if (completedCount >= 1) {
    levelTitle = 'Asistente de Alojamiento';
    levelNumber = 2;
  }

  return (
    <header className="bg-slate-900 text-white border-b border-emerald-950 sticky top-0 z-40 shadow-lg">
      {/* Top Banner with Student Info & Gamification */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Student Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Costa Rica Tourism English
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Profe Luis
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                {profile ? (
                  <>
                    <span>{profile.name}</span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                      Grupo: {profile.group}
                    </span>
                  </>
                ) : (
                  <span>English for Hospitality & Tourism</span>
                )}
              </h1>
            </div>
          </div>

          {/* Gamification Stats: Level, XP, Streak, Badges & Audio Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* Level Badge */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Nivel {levelNumber}</p>
                <p className="font-semibold text-amber-300 text-xs leading-tight">{levelTitle}</p>
              </div>
            </div>

            {/* XP Counter */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Experiencia</p>
                <p className="font-semibold text-emerald-300 text-xs leading-tight">{stats.xp} XP</p>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="font-semibold text-orange-300">{stats.streakDays}d racha</span>
            </div>

            {/* Midterm Status / Remedial Alert Pill */}
            {stats.remedialUnitId ? (
              <div
                className="bg-red-500/20 border border-red-500/50 rounded-lg px-2.5 py-1.5 flex items-center space-x-1.5 text-red-300 font-bold animate-pulse"
                title={`El examen de mitad de curso asignó reforzar la Unidad ${stats.remedialUnitId}`}
              >
                <span>⚠️</span>
                <span>Reforzar U{stats.remedialUnitId}</span>
              </div>
            ) : stats.midtermPassed ? (
              <div
                className="bg-emerald-500/20 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 flex items-center space-x-1 text-emerald-300 font-semibold"
                title="Punto de control de mitad de plataforma aprobado exitosamente"
              >
                <span>🎖️</span>
                <span>Mitad Aprobada</span>
              </div>
            ) : null}

            {/* Audio Speed Selector */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center space-x-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <select
                value={currentSpeechRate}
                onChange={(e) => onSpeechRateChange(parseFloat(e.target.value))}
                className="bg-transparent text-cyan-200 text-xs font-medium focus:outline-none cursor-pointer"
                title="Velocidad de audio para pronunciación"
              >
                <option value="1.0" className="bg-slate-900 text-white">Audio Normal (1.0x)</option>
                <option value="0.8" className="bg-slate-900 text-white">Audio Lento Docente (0.8x)</option>
              </select>
            </div>

            {/* Profile Edit Button */}
            <button
              onClick={onOpenProfile}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition cursor-pointer"
              title="Cambiar datos de estudiante"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
          <nav className="flex space-x-2">
            <button
              onClick={() => onNavigate('units')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeView === 'units'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ruta de Aprendizaje (12 Unidades)</span>
            </button>

            <button
              onClick={() => onNavigate('resources')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeView === 'resources'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recursos & Práctica Capstone</span>
            </button>

            <button
              onClick={onOpenPdfGuide}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-sm"
              title="Ver, descargar o imprimir la guía de estudio completa en PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📄 Guía de Examen Final (PDF)</span>
            </button>
          </nav>

          {/* Teacher Portal Shortcut */}
          <button
            onClick={onOpenTeacherPortal}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition border cursor-pointer ${
              activeView === 'teacher'
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : 'text-amber-300 bg-amber-950/30 border-amber-800/60 hover:bg-amber-900/40'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal del Docente (Profe Luis)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
