import React from 'react';
import { ShieldAlert, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { TEACHER_EMAIL } from '../utils/storage';

interface Props {
  isActive: boolean;
  fraudCount: number;
  lastWarning: string | null;
  onDismissWarning: () => void;
}

export const AntiCheatShield: React.FC<Props> = ({
  isActive,
  fraudCount,
  lastWarning,
  onDismissWarning,
}) => {
  if (!isActive) return null;

  return (
    <>
      {/* Top Floating Security Pill */}
      <div className="bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl shadow-md flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <span className="font-semibold text-white">Modo Evaluación Seguro</span>
          <span className="text-slate-400 hidden sm:inline">
            • Copiar / Pegar / Traductor bloqueados
          </span>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          {fraudCount === 0 ? (
            <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>0 incidentes</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-700 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{fraudCount} alertas registradas</span>
            </span>
          )}
        </div>
      </div>

      {/* Fraud Alert Notification Modal */}
      {lastWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-red-200">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-5 text-white flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Alerta de Seguridad Académica</h3>
                <p className="text-xs text-red-100">Indicación oficial del Profe Luis</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-900 text-xs leading-relaxed">
                <p className="font-bold mb-1">Acción sospechosa detectada:</p>
                <p className="font-mono text-red-700 bg-red-100/60 p-2 rounded">{lastWarning}</p>
              </div>

              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  Por instrucciones del docente <span className="font-semibold text-slate-900">Profe Luis</span>, está prohibido el uso de traductores externos, cambios de pestaña y copiar/pegar durante el examen.
                </p>
                <p className="text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 font-medium">
                  ⚠️ Esta advertencia ha sido registrada en tu boleta oficial y se notificará en tu reporte final a <span className="font-mono font-bold">{TEACHER_EMAIL}</span>.
                </p>
              </div>

              <button
                onClick={onDismissWarning}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <XCircle className="w-4 h-4" />
                <span>Entendido y Continuar Examen con Honestidad</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
