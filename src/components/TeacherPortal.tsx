import React, { useState } from 'react';
import { getStoredExamAttempts, TEACHER_EMAIL } from '../utils/storage';
import { ExamAttempt } from '../types';
import {
  GraduationCap,
  Mail,
  Download,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Trash2,
  Unlock,
} from 'lucide-react';

interface Props {
  onUnlockAllUnits: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const TeacherPortal: React.FC<Props> = ({
  onUnlockAllUnits,
  onResetProgress,
  onClose,
}) => {
  const [attempts, setAttempts] = useState<ExamAttempt[]>(() => getStoredExamAttempts());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group list
  const groups = Array.from(new Set(attempts.map((a) => a.group))).filter(Boolean);

  // Filtered attempts
  const filtered = attempts.filter((a) => {
    const matchSearch =
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.unitTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup = selectedGroup === 'all' || a.group === selectedGroup;
    return matchSearch && matchGroup;
  });

  // Analytics
  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter((a) => a.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
  const avgScore =
    totalAttempts > 0
      ? (attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts).toFixed(1)
      : '0';
  const totalFraudAlerts = attempts.reduce((acc, curr) => acc + curr.fraudAlertsCount, 0);

  // Export to CSV
  const handleExportCSV = () => {
    if (attempts.length === 0) return;

    const headers = [
      'ID',
      'Estudiante',
      'Grupo',
      'Unidad',
      'Puntaje',
      'Maximo',
      'Porcentaje',
      'Estado',
      'VidasRestantes',
      'TiempoSegundos',
      'AlertasFraude',
      'Fecha',
    ];

    const rows = attempts.map((a) => [
      a.id,
      `"${a.studentName.replace(/"/g, '""')}"`,
      `"${a.group.replace(/"/g, '""')}"`,
      `"${a.unitTitle.replace(/"/g, '""')}"`,
      a.score,
      a.maxScore,
      `${a.percentage}%`,
      a.passed ? 'APROBADO' : 'REPROBADO',
      a.livesRemaining,
      a.timeSpentSeconds,
      a.fraudAlertsCount,
      `"${a.timestamp}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_calificaciones_profe_luis_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Panel Administrativo Docente
            </span>
            <span className="text-amber-300 text-xs font-semibold">Profe Luis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Monitoreo en Tiempo Real y Auditoría de Calificaciones
          </h2>
          <p className="text-slate-300 text-sm max-w-xl">
            Centro de control para recibir y verificar evaluaciones oficiales de 20 puntos, supervisar alertas antifraude y exportar registros a Excel/CSV.
          </p>
          <p className="text-xs text-amber-300/90 font-mono">
            Buzón de entrega oficial: {TEACHER_EMAIL}
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            disabled={attempts.length === 0}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Registro CSV</span>
          </button>

          <button
            onClick={onUnlockAllUnits}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 cursor-pointer"
            title="Desbloquear todas las unidades para demostración en clase"
          >
            <Unlock className="w-4 h-4" />
            <span>Modo Docente: Desbloquear 12 Unidades</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition text-center cursor-pointer"
          >
            Volver a Vista Estudiante
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Evaluaciones Registradas</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalAttempts}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Promedio de Notas</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{avgScore} <span className="text-xs font-normal text-slate-400">/ 20 pts</span></p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Tasa de Aprobación</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{passRate}%</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Alertas Antifraude Totales</p>
          <p className={`text-2xl font-black mt-1 ${totalFraudAlerts > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {totalFraudAlerts}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por estudiante o unidad..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 shrink-0">Filtrar por grupo:</span>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Todos los grupos ({attempts.length})</option>
            {groups.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Submissions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-base">No hay evaluaciones registradas aún</h4>
            <p className="text-xs max-w-sm mx-auto">
              Cuando los estudiantes completen los exámenes de 20 puntos con sus 3 vidas, las boletas aparecerán listadas aquí y llegarán a <strong className="text-slate-700">{TEACHER_EMAIL}</strong>.
            </p>
          </div>
        ) : (
          filtered.map((att) => {
            const isExpanded = expandedId === att.id;

            return (
              <div
                key={att.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition hover:border-slate-300"
              >
                {/* Row Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : att.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-start sm:items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        att.passed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {att.score}/20
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 text-sm">{att.studentName}</h4>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Grupo: {att.group}
                        </span>
                        {att.passed ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Aprobado</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded flex items-center space-x-1">
                            <XCircle className="w-3 h-3" />
                            <span>Requiere Repaso</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {att.unitTitle} • {new Date(att.timestamp).toLocaleString('es-CR')}
                      </p>
                    </div>
                  </div>

                  {/* Badges: Fraud alerts & Toggle */}
                  <div className="flex items-center space-x-3 text-xs">
                    {att.fraudAlertsCount === 0 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Sin alertas</span>
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{att.fraudAlertsCount} alertas</span>
                      </span>
                    )}

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs animate-in fade-in duration-150">
                    {/* Fraud Audit details */}
                    {att.fraudLog && att.fraudLog.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-1 text-amber-950">
                        <p className="font-bold">Registro de incidentes antifraude del examen:</p>
                        <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] text-amber-900">
                          {att.fraudLog.map((log, lIdx) => (
                            <li key={lIdx}>{log}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Breakdown of 20 items */}
                    <div className="space-y-2">
                      <p className="font-bold text-slate-900">
                        Desglose de las 20 preguntas del examen:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                        {att.answers.map((ans, aIdx) => (
                          <div
                            key={aIdx}
                            className={`p-2.5 rounded-lg border text-[11px] ${
                              ans.isCorrect
                                ? 'bg-white border-emerald-200'
                                : 'bg-red-50/60 border-red-200'
                            }`}
                          >
                            <p className="font-semibold text-slate-900">{aIdx + 1}. {ans.questionText}</p>
                            <p className="mt-0.5">
                              <span className="text-slate-500">Respuesta:</span>{' '}
                              <span className={ans.isCorrect ? 'text-emerald-800 font-bold' : 'text-red-700 font-bold line-through'}>
                                {ans.studentAnswer || '(En blanco)'}
                              </span>
                            </p>
                            {!ans.isCorrect && (
                              <p className="text-emerald-700">
                                <span className="text-slate-500">Esperada:</span> {ans.correctAnswer}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <p>Datos sincronizados localmente en esta estación de trabajo.</p>
        <button
          onClick={() => {
            if (confirm('¿Está seguro de reiniciar los intentos y el progreso guardado?')) {
              onResetProgress();
              setAttempts([]);
            }
          }}
          className="text-red-600 hover:text-red-800 font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Restablecer Datos de Demostración</span>
        </button>
      </div>
    </div>
  );
};
