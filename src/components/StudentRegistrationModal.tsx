import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { TEACHER_EMAIL } from '../utils/storage';
import { UserCheck, ShieldCheck, Mail, BookOpen, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  initialProfile: StudentProfile | null;
  onSave: (profile: StudentProfile) => void;
}

export const StudentRegistrationModal: React.FC<Props> = ({ isOpen, initialProfile, onSave }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [group, setGroup] = useState(initialProfile?.group || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor escriba su nombre y apellidos completos.');
      return;
    }
    if (!group.trim()) {
      setError('Por favor indique su grupo o sección académica.');
      return;
    }

    onSave({
      name: name.trim(),
      group: group.trim(),
      email: email.trim(),
      registeredAt: initialProfile?.registeredAt || new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/20">
            <BookOpen className="w-7 h-7 text-emerald-200" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Registro de Estudiante</h2>
          <p className="text-emerald-100 text-sm mt-1">
            English for Hospitality & Rural Tourism • Costa Rica
          </p>
        </div>

        {/* Info Card */}
        <div className="p-6 space-y-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">Sistema Oficial de Evaluación del Profe Luis</p>
              <p className="text-emerald-800 mt-0.5 leading-relaxed">
                Tus avances, notas de 20 pts y reportes de honestidad académica serán certificados y enviados al docente: <span className="font-mono font-bold">{TEACHER_EMAIL}</span>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nombre y Apellidos del Estudiante *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="Ej. Sofía Vargas Ramírez"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-slate-800 text-sm font-medium transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Grupo / Sección *
                </label>
                <input
                  type="text"
                  required
                  value={group}
                  onChange={(e) => {
                    setGroup(e.target.value);
                    setError(null);
                  }}
                  placeholder="Ej. 10-A / Turismo Sabatino"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-slate-800 text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Correo del Estudiante (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="estudiante@mep.cr"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-slate-800 text-sm font-medium transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-xs bg-red-50 p-2.5 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold rounded-xl shadow-md shadow-emerald-900/20 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Comenzar a Estudiar y Aprender</span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Costa Rica • Inglés aplicado al turismo | Guía integral A1 → B1
        </div>
      </div>
    </div>
  );
};
