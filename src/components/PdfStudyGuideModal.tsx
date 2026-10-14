import React, { useState } from 'react';
import {
  UNITS_DATA,
  WORKPLACE_PHRASEBOOK,
  PHRASAL_VERBS_TOURISM,
  IRREGULAR_VERBS,
  GRAMMAR_REFERENCE_TABLE,
  ASSESSMENT_RUBRIC,
  CAPSTONE_CASE,
} from '../data/curriculumData';
import { TEACHER_EMAIL } from '../utils/storage';
import { StudentProfile } from '../types';
import {
  Printer,
  Download,
  Copy,
  X,
  BookOpen,
  CheckCircle,
  FileText,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  profile: StudentProfile | null;
  onClose: () => void;
}

export const PdfStudyGuideModal: React.FC<Props> = ({
  isOpen,
  profile,
  onClose,
}) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Print directly to PDF
  const handlePrint = () => {
    window.print();
  };

  // Generate downloadable self-contained HTML file
  const handleDownloadHtml = () => {
    const printableElement = document.getElementById('printable-study-guide');
    if (!printableElement) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Guia_Estudio_Examen_Final_Ingles_Turismo.html</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #0f172a; margin: 40px auto; max-width: 900px; padding: 0 20px; }
    h1, h2, h3, h4 { color: #064e3b; margin-top: 1.5em; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background-color: #ecfdf5; color: #065f46; font-weight: bold; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; background: #d1fae5; color: #065f46; }
    .header-box { border: 2px solid #059669; background: #f0fdf4; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    @media print {
      body { margin: 0; padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  ${printableElement.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Guia_Maestra_Examen_Final_Ingles_Turismo_${profile?.name ? profile.name.replace(/\s+/g, '_') : 'Estudiante'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy plain text summary
  const handleCopyText = async () => {
    let summary = `GUÍA MAESTRA DE ESTUDIO PARA EXAMEN FINAL: ENGLISH FOR TOURISM\n`;
    summary += `Docente: Prof. Luis (${TEACHER_EMAIL})\n`;
    summary += `Estudiante: ${profile?.name || '________________'} | Grupo: ${profile?.group || '____'}\n\n`;

    summary += `=====================================================\n`;
    summary += `1. WORKPLACE PHRASEBOOK (20 FRASES CLAVE)\n`;
    summary += `=====================================================\n`;
    WORKPLACE_PHRASEBOOK.forEach((p, idx) => {
      summary += `${idx + 1}. ${p.en} = ${p.es}\n`;
    });

    summary += `\n=====================================================\n`;
    summary += `2. PHRASAL VERBS & INFORMAL ENGLISH\n`;
    summary += `=====================================================\n`;
    PHRASAL_VERBS_TOURISM.forEach((pv, idx) => {
      summary += `${idx + 1}. ${pv.expression} (${pv.meaning}) -> Ej: ${pv.example}\n`;
    });

    summary += `\n=====================================================\n`;
    summary += `3. VERBOS IMPRESCINDIBLES (30 VERBOS)\n`;
    summary += `=====================================================\n`;
    IRREGULAR_VERBS.forEach((v, idx) => {
      summary += `${idx + 1}. Base: ${v.base.padEnd(10)} | Past: ${v.past.padEnd(12)} | Participle: ${v.participle.padEnd(12)} | Español: ${v.es}\n`;
    });

    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus('¡Texto copiado al portapapeles!');
      setTimeout(() => setCopyStatus(null), 3000);
    } catch {
      setCopyStatus('No se pudo copiar automáticamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex justify-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col my-auto max-h-[92vh]">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 no-print shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Documento de Estudio Oficial para Examen Final (PDF)
              </h3>
              <p className="text-xs text-slate-400">
                Vocabulario de las 12 unidades, frases, gramática, verbos y rúbrica
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Print / Save as PDF Button */}
            <button
              onClick={handlePrint}
              className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
              title="Guardar directamente como PDF o imprimir"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>

            {/* Download HTML Document */}
            <button
              onClick={handleDownloadHtml}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer"
              title="Descargar archivo para abrir en navegador o Word"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar Archivo</span>
            </button>

            {/* Copy Text */}
            <button
              onClick={handleCopyText}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer"
              title="Copiar texto resumen"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">{copyStatus || 'Copiar Texto'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div
          id="printable-study-guide"
          className="p-6 sm:p-10 overflow-y-auto space-y-8 text-slate-800 text-sm font-sans selection:bg-emerald-200"
        >
          {/* Document Header & Crest */}
          <div className="border-4 border-emerald-800 bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl p-6 text-center space-y-3 print-avoid-break">
            <div className="flex items-center justify-center space-x-2 text-xs font-black tracking-widest text-emerald-900 uppercase">
              <span>🇨🇷 Costa Rica</span>
              <span>•</span>
              <span>Inglés Aplicado al Turismo</span>
              <span>•</span>
              <span>Material Didáctico Oficial</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 uppercase tracking-tight">
              GUÍA MAESTRA DE ESTUDIO Y BALOTARIO PARA EXAMEN FINAL
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              ENGLISH FOR HOSPITALITY & RURAL TOURISM • CUADERNO INTEGRAL DE REPASO
            </p>
            <p className="text-xs text-slate-600">
              Docente a cargo: <strong className="text-slate-900 font-mono">Prof. Luis ({TEACHER_EMAIL})</strong>
            </p>

            {/* Student metadata fill-in box */}
            <div className="mt-4 pt-4 border-t border-emerald-300 grid grid-cols-1 sm:grid-cols-4 gap-3 text-left text-xs bg-white/80 p-3 rounded-xl border border-emerald-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Estudiante:</span>
                <span className="font-bold text-slate-900 text-sm">{profile?.name || '__________________________'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Grupo / Sección:</span>
                <span className="font-bold text-slate-900 text-sm">{profile?.group || '__________'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Fecha de Examen:</span>
                <span className="font-bold text-slate-900 text-sm">{new Date().toLocaleDateString('es-CR')}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Calificación Final:</span>
                <span className="font-bold text-emerald-800 text-sm">____ / 20 pts</span>
              </div>
            </div>
          </div>

          {/* Quick Exam Specifications */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 print-avoid-break">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Instrucciones y Especificaciones del Examen Final</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <li>• <strong>Puntaje Total:</strong> Exactamente 20 puntos / 20 ítems evaluados.</li>
              <li>• <strong>Sistema de Vidas:</strong> 3 Vidas (❤️❤️❤️). Errores descuentan 1 vida.</li>
              <li>• <strong>Mínimo para Aprobar:</strong> 14 puntos de 20 (70%).</li>
              <li>• <strong>Protección Antifraude:</strong> Prohibido copiar, pegar o cambiar de pestaña.</li>
              <li>• <strong>Envío Oficial:</strong> Se notifica en tiempo real a {TEACHER_EMAIL}.</li>
              <li>• <strong>Contenido:</strong> Comprende las 12 unidades (Bloques 1 al 4) y el caso Capstone.</li>
            </ul>
          </div>

          {/* SECCIÓN 1: VOCABULARIO COMPLETO DE LAS 12 UNIDADES */}
          <section className="space-y-4">
            <div className="border-b-2 border-emerald-800 pb-2 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>1. Compendio Completo de Vocabulario Oficial (12 Unidades)</span>
              </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                120 Términos Clave
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {UNITS_DATA.map((unit) => (
                <div
                  key={unit.id}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 print-avoid-break"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <h3 className="font-bold text-xs text-emerald-950 uppercase">
                      {unit.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Bloque {unit.blockId}
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-800 italic">
                    Meta: {unit.learningOutcome}
                  </p>

                  <div className="space-y-1 pt-1 text-xs">
                    {unit.vocabulary.map((v, vIdx) => (
                      <div key={vIdx} className="flex justify-between border-b border-slate-100 pb-0.5">
                        <span className="font-bold text-slate-900">{v.en}</span>
                        <span className="text-slate-600">{v.es}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECCIÓN 2: WORKPLACE PHRASEBOOK */}
          <section className="space-y-4 print-page-break">
            <div className="border-b-2 border-emerald-800 pb-2">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span>2. Workplace Phrasebook • Frases Listas para Usar en el Trabajo</span>
              </h2>
              <p className="text-xs text-slate-500">
                Fórmulas de cortesía indispensables para recepción, información, reservas y resolución de quejas.
              </p>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-emerald-100 text-emerald-950 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2.5 border-b border-slate-200 w-12 text-center">#</th>
                  <th className="p-2.5 border-b border-slate-200">English for Work</th>
                  <th className="p-2.5 border-b border-slate-200">Español en Hotelería</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {WORKPLACE_PHRASEBOOK.map((phrase, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-2 font-bold text-slate-900">{phrase.en}</td>
                    <td className="p-2 text-slate-700">{phrase.es}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* SECCIÓN 3: PHRASAL VERBS & INFORMAL ENGLISH */}
          <section className="space-y-4 print-avoid-break">
            <div className="border-b-2 border-emerald-800 pb-2">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>3. Phrasal Verbs & Informal English • Expresiones Coloquiales</span>
              </h2>
              <p className="text-xs text-slate-500">
                Expresiones para comprender a turistas angloparlantes en situaciones informales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PHRASAL_VERBS_TOURISM.map((pv, idx) => (
                <div key={idx} className="border border-slate-200 bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950">{pv.expression}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      {pv.meaning}
                    </span>
                  </div>
                  <p className="text-slate-600 italic">Ejemplo: "{pv.example}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECCIÓN 4: RESUMEN GRAMATICAL PARA EL EXAMEN */}
          <section className="space-y-4 print-page-break">
            <div className="border-b-2 border-emerald-800 pb-2">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <span>4. Síntesis Gramatical Completa para el Examen (15 Estructuras)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Estructuras evaluadas en el cuadernillo con su uso y ejemplo en contexto hotelero costarricense.
              </p>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-emerald-100 text-emerald-950 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2 border-b border-slate-200">Estructura</th>
                  <th className="p-2 border-b border-slate-200">Uso Comunicativo</th>
                  <th className="p-2 border-b border-slate-200">Ejemplo en Turismo</th>
                  <th className="p-2 border-b border-slate-200">Traducción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {GRAMMAR_REFERENCE_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-900">{row.structure}</td>
                    <td className="p-2 text-slate-600">{row.use}</td>
                    <td className="p-2 font-medium text-emerald-900">{row.exampleEn}</td>
                    <td className="p-2 text-slate-500">{row.exampleEs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* SECCIÓN 5: TABLA DE 30 VERBOS IMPRESCINDIBLES */}
          <section className="space-y-4 print-avoid-break">
            <div className="border-b-2 border-emerald-800 pb-2">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>5. Lista Maestra de Verbos Imprescindibles para Hotelería (30 Verbos)</span>
              </h2>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-emerald-100 text-emerald-950 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2 border-b border-slate-200">Base Form</th>
                  <th className="p-2 border-b border-slate-200">Past Simple</th>
                  <th className="p-2 border-b border-slate-200">Past Participle</th>
                  <th className="p-2 border-b border-slate-200">Español</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {IRREGULAR_VERBS.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-1.5 font-bold text-slate-900">{v.base}</td>
                    <td className="p-1.5 font-medium text-emerald-800">{v.past}</td>
                    <td className="p-1.5 text-slate-600">{v.participle}</td>
                    <td className="p-1.5 text-slate-600">{v.es}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* SECCIÓN 6: CASO CAPSTONE & COMPRENSIÓN */}
          <section className="space-y-4 print-page-break">
            <div className="border-b-2 border-emerald-800 pb-2">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <span>6. Simulación Real Capstone: Eco-Lodge en el Norte de Costa Rica</span>
              </h2>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
              <p className="font-bold text-emerald-950">Caso de Trabajo:</p>
              <p className="text-emerald-900">{CAPSTONE_CASE.scenario}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <p className="font-bold text-slate-900">Lectura de Comprensión:</p>
              <p className="font-serif italic text-slate-800">{CAPSTONE_CASE.readingPassage}</p>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-900">Preguntas Clave del Examen y Solucionario:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CAPSTONE_CASE.readingQuestions.map((rq, idx) => (
                  <div key={idx} className="border border-slate-200 p-2.5 rounded-lg bg-white">
                    <p className="font-semibold text-slate-900">{idx + 1}. {rq.question}</p>
                    <p className="text-emerald-800 font-bold mt-1">✔ {rq.correctAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECCIÓN 7: RÚBRICA DE EVALUACIÓN OFICIAL (20 PUNTOS) */}
          <section className="space-y-4 print-avoid-break">
            <div className="border-b-2 border-emerald-800 pb-2">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <span>7. Rúbrica Oficial de Evaluación de Desempeño (20 Puntos Máximos)</span>
              </h2>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-emerald-100 text-emerald-950 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2 border-b border-slate-200">Criterio</th>
                  <th className="p-2 border-b border-slate-200">Excelente (4 pts)</th>
                  <th className="p-2 border-b border-slate-200">En Proceso (2 pts)</th>
                  <th className="p-2 border-b border-slate-200">Inicial (1 pt)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {ASSESSMENT_RUBRIC.map((rub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-900">{rub.criterion}</td>
                    <td className="p-2 text-emerald-800 font-medium">{rub.excellent}</td>
                    <td className="p-2 text-slate-600">{rub.developing}</td>
                    <td className="p-2 text-slate-500">{rub.initial}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Document Footer */}
          <div className="mt-8 pt-4 border-t-2 border-slate-300 text-center text-xs text-slate-500 space-y-1 print-avoid-break">
            <p className="font-bold text-slate-700">
              Costa Rica • Inglés Aplicado al Turismo | Plataforma Educativa del Profe Luis
            </p>
            <p>
              Buzón de recepción de exámenes: <span className="font-mono font-bold text-emerald-800">{TEACHER_EMAIL}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Documento oficial de estudio preparado para evaluaciones de 20 puntos con 3 vidas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
