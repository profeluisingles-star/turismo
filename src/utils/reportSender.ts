import { ExamAttempt } from '../types';
import { TEACHER_EMAIL } from './storage';

/**
 * Format email subject line for professor Luis
 */
export function getReportEmailSubject(attempt: ExamAttempt): string {
  const status = attempt.passed ? 'APROBADO' : 'NO APROBADO';
  return `[REPORTE OFICIAL] ${status} (${attempt.score}/${attempt.maxScore} pts) - ${attempt.studentName} - Grupo ${attempt.group} - Unidad ${attempt.unitId}`;
}

/**
 * Format detailed email body for professor Luis
 */
export function getReportEmailBody(attempt: ExamAttempt): string {
  const dateFormatted = new Date(attempt.timestamp).toLocaleString('es-CR', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const durationMin = Math.floor(attempt.timeSpentSeconds / 60);
  const durationSec = attempt.timeSpentSeconds % 60;
  const timeFormatted = `${durationMin}m ${durationSec}s`;

  const fraudStatus =
    attempt.fraudAlertsCount === 0
      ? '✅ 0 INFRACCIONES DETECTADAS (Comportamiento limpio y sin cambio de pestañas)'
      : `⚠️ ${attempt.fraudAlertsCount} ALERTAS REGISTRADAS (Cambio de pestaña / intento de copiar o pegar)`;

  let answerDetails = '';
  attempt.answers.forEach((ans, idx) => {
    const symbol = ans.isCorrect ? '✅' : '❌';
    answerDetails += `${idx + 1}. [${symbol}] ${ans.questionText}\n   - Respuesta del alumno: "${ans.studentAnswer || '(En blanco)'}"\n   - Respuesta correcta: "${ans.correctAnswer}"\n\n`;
  });

  let fraudLogDetails = '';
  if (attempt.fraudLog && attempt.fraudLog.length > 0) {
    fraudLogDetails = `\nREGISTRO DE ALERTAS ANTIFRAUDE:\n${attempt.fraudLog.map((log) => ` • ${log}`).join('\n')}\n`;
  }

  return `=====================================================
PLATAFORMA EDUCATIVA DE INGLÉS PARA TURISMO
REPORTE OFICIAL DE RENDIMIENTO Y EVALUACIÓN
Destinatario docente: ${TEACHER_EMAIL}
=====================================================

DATOS DEL ESTUDIANTE:
• Nombre completo: ${attempt.studentName}
• Grupo / Sección: ${attempt.group}
• Fecha y hora: ${dateFormatted}

RESULTADOS DE LA EVALUACIÓN:
• Unidad evaluada: Unidad ${attempt.unitId} - ${attempt.unitTitle}
• Calificación: ${attempt.score} de ${attempt.maxScore} puntos (${attempt.percentage}%)
• Estado: ${attempt.passed ? 'APROBADO (Avanza a la siguiente unidad)' : 'REQUIERE REPASO (Mínimo para aprobar: 14/20 pts)'}
• Vidas restantes: ${attempt.livesRemaining} de 3 vidas
• Tiempo empleado: ${timeFormatted}

AUDITORÍA DE INTEGRIDAD ACADÉMICA (ANTIFRAUDE):
• Estado de seguridad: ${fraudStatus}${fraudLogDetails}
${
  attempt.assignedRemedialUnitId
    ? `
DIAGNÓSTICO PEDAGÓGICO DE DEBILIDADES (CHECKPOINT MITAD DE CURSO):
• Estado: No superó el control de mitad de curso (mínimo 14/20 pts).
• Unidad con mayor debilidad detectada: Unidad ${attempt.assignedRemedialUnitId}
• Plan de Reforzamiento Obligatorio: El estudiante ha sido retornado a la Unidad ${attempt.assignedRemedialUnitId} para repasar vocabulario, escucha, transcripción y traducción antes de poder reintentar el examen de mitad de curso.
`
    : attempt.unitId === 50 && attempt.passed
    ? `
DIAGNÓSTICO PEDAGÓGICO (CHECKPOINT MITAD DE CURSO):
• ¡ÉXITO! El estudiante demostró dominio integral de los Bloques 1 y 2 (Unidades 1 a 6).
• Habilitado para avanzar a los bloques avanzados de guiado y restaurantes (Unidades 7 a 12).
`
    : ''
}
DETALLE ÍTEM POR ÍTEM (20 PREGUNTAS):
-----------------------------------------------------
${answerDetails}
=====================================================
Generado automáticamente por la Plataforma de Inglés Turístico
Costa Rica • English for Hospitality & Rural Tourism
`;
}

/**
 * Generate a mailto URI with pre-filled recipient, subject, and encoded body
 */
export function generateMailtoLink(attempt: ExamAttempt): string {
  const subject = encodeURIComponent(getReportEmailSubject(attempt));
  const body = encodeURIComponent(getReportEmailBody(attempt));
  return `mailto:${TEACHER_EMAIL}?subject=${subject}&body=${body}`;
}

/**
 * Copy text report to user clipboard
 */
export async function copyReportToClipboard(attempt: ExamAttempt): Promise<boolean> {
  try {
    const text = getReportEmailBody(attempt);
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
