import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UnitData, QuestionItem, StudentProfile, ExamAttempt } from '../types';
import { useAntiCheat } from '../hooks/useAntiCheat';
import { AntiCheatShield } from './AntiCheatShield';
import { soundManager, speakText } from '../utils/sound';
import { saveExamAttempt, TEACHER_EMAIL } from '../utils/storage';
import { generateMailtoLink, copyReportToClipboard, getReportEmailBody } from '../utils/reportSender';
import confetti from 'canvas-confetti';
import {
  Heart,
  Volume2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Mail,
  Copy,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react';

interface Props {
  unit: UnitData;
  profile: StudentProfile;
  speechRate: number;
  onFinish: (attempt: ExamAttempt) => void;
  onExit: () => void;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const QuizEngine: React.FC<Props> = ({
  unit,
  profile,
  speechRate,
  onFinish,
  onExit,
}) => {
  // Anti-cheat hook active during quiz
  const { fraudCount, fraudLogs, lastWarning, clearWarning } = useAntiCheat({
    enabled: true,
  });

  // Quiz state
  const [lives, setLives] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [startTime] = useState<number>(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [answersLog, setAnswersLog] = useState<ExamAttempt['answers']>([]);
  const [completedAttempt, setCompletedAttempt] = useState<ExamAttempt | null>(null);

  // Timer tick
  useEffect(() => {
    if (isCompleted || isGameOver) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, isCompleted, isGameOver]);

  // Generate 20 randomized questions from the unit question bank
  const quizQuestions = useMemo(() => {
    const bank = [...unit.questionBank];
    // If bank has more or fewer, ensure 20 items by repeating or shuffling
    let chosen: QuestionItem[] = [];
    if (bank.length >= 20) {
      chosen = shuffleArray(bank).slice(0, 20);
    } else {
      // If smaller, repeat with unique ids to guarantee 20 items
      const repeated: QuestionItem[] = [];
      while (repeated.length < 20) {
        repeated.push(...shuffleArray(bank));
      }
      chosen = repeated.slice(0, 20);
    }

    // Shuffle options inside each question
    return chosen.map((q) => {
      if (q.options && q.options.length > 0) {
        return {
          ...q,
          options: shuffleArray(q.options),
        };
      }
      return q;
    });
  }, [unit]);

  const currentQuestion = quizQuestions[currentIndex];

  // Auto-play listening questions when first encountered
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'listening' && currentQuestion.audioText && !isAnswerSubmitted) {
      speakText(currentQuestion.audioText, speechRate);
    }
  }, [currentIndex, currentQuestion, speechRate, isAnswerSubmitted]);

  // Play audio for current question prompt
  const handlePlayAudio = useCallback(() => {
    if (!currentQuestion) return;
    const textToSpeak = currentQuestion.audioText || currentQuestion.prompt;
    speakText(textToSpeak, speechRate);
  }, [currentQuestion, speechRate]);

  // Handle Answer Submission
  const handleSubmitAnswer = () => {
    if (!currentQuestion || isAnswerSubmitted) return;

    let studentAns = selectedAnswer;
    if (currentQuestion.type === 'translate_es_en' && !currentQuestion.options) {
      studentAns = textAnswer.trim();
    } else if (!studentAns && textAnswer) {
      studentAns = textAnswer.trim();
    }

    if (!studentAns) return; // Prevent empty submit

    // Normalize for text comparisons if necessary
    const norm = (str: string) =>
      str.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();

    const correctNorm = norm(currentQuestion.correctAnswer);
    const studentNorm = norm(studentAns);

    const isCorrect: boolean =
      studentNorm === correctNorm ||
      Boolean(
        currentQuestion.acceptableAnswers &&
          currentQuestion.acceptableAnswers.some((ans) => norm(ans) === studentNorm)
      );

    setIsAnswerSubmitted(true);
    setIsCurrentCorrect(isCorrect);

    // Save answer record
    const newLogItem = {
      questionText: currentQuestion.prompt,
      studentAnswer: studentAns,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };
    const updatedAnswersLog = [...answersLog, newLogItem];
    setAnswersLog(updatedAnswersLog);

    if (isCorrect) {
      soundManager.playCorrect();
      setScore((prev) => prev + currentQuestion.points);
    } else {
      soundManager.playIncorrect();
      soundManager.playHeartLost();
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        // Game Over!
        setTimeout(() => {
          setIsGameOver(true);
        }, 1200);
      }
    }
  };

  // Next Question or Finish
  const handleNextQuestion = () => {
    if (currentIndex + 1 < quizQuestions.length && lives > 0) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer('');
      setTextAnswer('');
      setIsAnswerSubmitted(false);
      setIsCurrentCorrect(false);
    } else {
      // Finished all 20 questions!
      finishQuiz();
    }
  };

  // Finish and generate attempt record
  const finishQuiz = () => {
    setIsCompleted(true);
    const finalScore = score + (isCurrentCorrect ? 0 : 0); // already updated
    const maxScore = 20;
    const percentage = Math.round((finalScore / maxScore) * 100);
    const passed = finalScore >= 14; // >= 70% (14/20)

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      studentName: profile.name,
      group: profile.group,
      unitId: unit.id,
      unitTitle: unit.title,
      score: finalScore,
      maxScore,
      percentage,
      passed,
      livesRemaining: Math.max(0, lives),
      timeSpentSeconds: elapsedSeconds,
      fraudAlertsCount: fraudCount,
      fraudLog: [...fraudLogs],
      timestamp: new Date().toISOString(),
      teacherEmail: TEACHER_EMAIL,
      answers: answersLog,
    };

    saveExamAttempt(attempt);
    setCompletedAttempt(attempt);

    if (passed) {
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }

    onFinish(attempt);
  };

  // Retry quiz with fresh state
  const handleRetry = () => {
    setLives(3);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer('');
    setTextAnswer('');
    setIsAnswerSubmitted(false);
    setIsCurrentCorrect(false);
    setIsGameOver(false);
    setIsCompleted(false);
    setAnswersLog([]);
    setCompletedAttempt(null);
  };

  // Copy report
  const handleCopyReport = async () => {
    if (!completedAttempt) return;
    const ok = await copyReportToClipboard(completedAttempt);
    if (ok) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  // Print report
  const handlePrint = () => {
    window.print();
  };

  // ==========================================
  // RENDER: GAME OVER SCREEN
  // ==========================================
  if (isGameOver) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 my-8 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden text-center p-8 space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
            <XCircle className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ¡Te has quedado sin vidas!
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
              Perdiste las 3 vidas durante la evaluación oficial de la {unit.title}. Para garantizar un aprendizaje sólido, repasa el vocabulario e inténtalo nuevamente.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 max-w-sm mx-auto flex justify-around text-center">
            <div>
              <p className="text-xs text-slate-500">Puntaje alcanzado</p>
              <p className="text-xl font-bold text-slate-800">{score} / 20 pts</p>
            </div>
            <div className="border-r border-slate-200" />
            <div>
              <p className="text-xs text-slate-500">Preguntas respondidas</p>
              <p className="text-xl font-bold text-slate-800">{currentIndex + 1} / 20</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Intentar de Nuevo con 3 Vidas</span>
            </button>
            <button
              onClick={onExit}
              className="w-full sm:w-auto px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition cursor-pointer"
            >
              Regresar al Material de Estudio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: COMPLETED RESULT SCREEN
  // ==========================================
  if (isCompleted && completedAttempt) {
    const mailtoUrl = generateMailtoLink(completedAttempt);

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 my-6 space-y-6 animate-in fade-in duration-200 print:m-0 print:p-2">
        {/* Certificate / Result Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Top Banner */}
          <div
            className={`p-6 sm:p-8 text-white text-center ${
              completedAttempt.passed
                ? 'bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900'
                : 'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800'
            }`}
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
              {completedAttempt.passed ? (
                <Sparkles className="w-10 h-10 text-amber-300" />
              ) : (
                <AlertCircle className="w-10 h-10 text-white" />
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {completedAttempt.passed ? '¡Evaluación Oficial Aprobada!' : 'Evaluación Completada (Requiere Refuerzo)'}
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {unit.title} • {unit.learningOutcome}
            </p>

            <div className="mt-4 inline-flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl text-lg font-bold">
              <span>Calificación:</span>
              <span className="text-2xl font-black text-amber-300">
                {completedAttempt.score} / {completedAttempt.maxScore} pts
              </span>
              <span className="text-sm opacity-80">({completedAttempt.percentage}%)</span>
            </div>
          </div>

          {/* Student Dossier Information */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block font-medium">Estudiante:</span>
                <span className="font-bold text-slate-900 text-sm">{completedAttempt.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Grupo:</span>
                <span className="font-bold text-slate-900 text-sm">{completedAttempt.group}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Vidas Restantes:</span>
                <span className="font-bold text-red-600 text-sm">
                  {'❤️'.repeat(completedAttempt.livesRemaining) || 'Sin vidas'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Tiempo Empleado:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {Math.floor(completedAttempt.timeSpentSeconds / 60)}m {completedAttempt.timeSpentSeconds % 60}s
                </span>
              </div>
            </div>

            {/* Anti-fraud audit banner */}
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                completedAttempt.fraudAlertsCount === 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-emerald-700" />
              <div>
                <p className="font-bold text-slate-900">Auditoría de Integridad y Antifraude:</p>
                <p className="mt-0.5">
                  {completedAttempt.fraudAlertsCount === 0
                    ? '✅ 0 Alertas registradas. El estudiante no cambió de pestaña ni intentó copiar/pegar contenido.'
                    : `⚠️ ${completedAttempt.fraudAlertsCount} incidentes detectados durante la prueba (cambio de ventana/intento de traducción externa).`}
                </p>
              </div>
            </div>

            {/* Teacher Dispatch Section (CRITICAL USER REQUIREMENT) */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 print:hidden">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Mail className="w-4 h-4" />
                <span>Envío Oficial de Reporte al Docente</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Envía tus notas y el desglose de 20 preguntas al correo oficial del profesor:{' '}
                <span className="font-mono font-bold text-emerald-300">{TEACHER_EMAIL}</span>.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Mailto Direct Link */}
                <a
                  href={mailtoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer text-center"
                >
                  <Mail className="w-4 h-4" />
                  <span>Enviar Correo a profeluisingles@gmail.com</span>
                </a>

                {/* Copy to Clipboard */}
                <button
                  onClick={handleCopyReport}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 border border-slate-700 transition cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copySuccess ? '¡Copiado con Éxito!' : 'Copiar Boleta de Texto'}</span>
                </button>

                {/* Print button */}
                <button
                  onClick={handlePrint}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 border border-slate-700 transition cursor-pointer"
                  title="Imprimir boleta de calificación"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Boleta</span>
                </button>
              </div>
            </div>

            {/* Questions breakdown */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Desglose de las 20 Preguntas Realizadas:</span>
                <span className="text-xs text-slate-500 font-normal">
                  {completedAttempt.answers.filter((a) => a.isCorrect).length} aciertos de 20
                </span>
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 text-xs">
                {completedAttempt.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
                      ans.isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                        : 'bg-red-50/50 border-red-200 text-red-950'
                    }`}
                  >
                    {ans.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{idx + 1}. {ans.questionText}</p>
                      <p className="mt-1">
                        <span className="text-slate-500">Tu respuesta:</span>{' '}
                        <span className={ans.isCorrect ? 'font-medium text-emerald-800' : 'font-medium text-red-700 line-through'}>
                          {ans.studentAnswer || '(En blanco)'}
                        </span>
                      </p>
                      {!ans.isCorrect && (
                        <p className="text-emerald-700 font-medium">
                          <span className="text-slate-500">Respuesta correcta:</span> {ans.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={handleRetry}
                className="py-2.5 px-4 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reintentar para Mejorar Puntaje</span>
              </button>

              <button
                onClick={onExit}
                className="py-3 px-6 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-md transition cursor-pointer"
              >
                <span>Volver al Mapa de Aprendizaje</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: ACTIVE QUESTION SCREEN
  // ==========================================
  const progressPercent = Math.round(((currentIndex + 1) / quizQuestions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 my-4 space-y-4 select-none">
      {/* Anti-cheat shield bar */}
      <AntiCheatShield
        isActive={true}
        fraudCount={fraudCount}
        lastWarning={lastWarning}
        onDismissWarning={clearWarning}
      />

      {/* Quiz Status Header: Lives, Score, Timer, Progress */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Unit & Question Counter */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            {unit.title} • Evaluación Oficial
          </span>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Pregunta {currentIndex + 1} de {quizQuestions.length}
            <span className="text-xs font-normal text-slate-500">
              ({currentQuestion?.points || 1} pt)
            </span>
          </h3>
        </div>

        {/* Lives Counter (❤️❤️❤️) */}
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
          <span className="text-xs font-semibold text-red-950">Vidas:</span>
          <div className="flex space-x-1">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-5 h-5 transition-transform duration-300 ${
                  heartIndex <= lives
                    ? 'text-red-500 fill-red-500 scale-100'
                    : 'text-slate-300 fill-slate-200 scale-90'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Score & Timer */}
        <div className="flex items-center space-x-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Puntaje:</span>
            <span className="text-emerald-700 font-bold text-sm">{score} / 20 pts</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {Math.floor(elapsedSeconds / 60)}:
              {(elapsedSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Question Type Badge & Audio prompt */}
          <div className="flex items-center justify-between">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {currentQuestion.type === 'listening'
                ? '🎧 Práctica de Escucha (Listening)'
                : currentQuestion.type === 'translate_es_en'
                ? '🌐 Traducción Español → Inglés'
                : currentQuestion.type === 'translate_en_es'
                ? '🌐 Traducción Inglés → Español'
                : currentQuestion.type === 'fill_blank'
                ? '✏️ Completar la Oración'
                : currentQuestion.type === 'word_scramble'
                ? '🧩 Ordenar la Frase'
                : currentQuestion.type === 'error_correction'
                ? '🔍 Corrección de Error'
                : '📋 Opción Múltiple'}
            </span>

            {/* Audio Button */}
            {(currentQuestion.type === 'listening' || currentQuestion.audioText) && (
              <button
                onClick={handlePlayAudio}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 transition cursor-pointer"
                title="Reproducir audio de nuevo"
              >
                <Volume2 className="w-4 h-4" />
                <span>Escuchar Audio</span>
              </button>
            )}
          </div>

          {/* Question Prompt */}
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQuestion.prompt}
            </h4>
            {currentQuestion.context && (
              <p className="text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600">
                Palabras clave: {currentQuestion.context}
              </p>
            )}
          </div>

          {/* Audio Player Card for Listening */}
          {currentQuestion.type === 'listening' && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePlayAudio}
                  className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition cursor-pointer"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
                <div>
                  <p className="text-xs font-bold text-emerald-950">Audio de pronunciación auténtica</p>
                  <p className="text-[11px] text-emerald-700">Haga clic para reproducir las veces que necesite</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-white/70 px-2 py-1 rounded">
                Velocidad {speechRate}x
              </span>
            </div>
          )}

          {/* Answer Options (Multiple Choice or Text Input) */}
          {currentQuestion.options && currentQuestion.options.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5">
              {currentQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedAnswer === opt;
                let btnStyle =
                  'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-800 bg-white';

                if (isSelected && !isAnswerSubmitted) {
                  btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30';
                }

                if (isAnswerSubmitted) {
                  if (opt === currentQuestion.correctAnswer) {
                    btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold';
                  } else if (isSelected && !isCurrentCorrect) {
                    btnStyle = 'border-red-500 bg-red-100 text-red-950 font-bold';
                  } else {
                    btnStyle = 'opacity-50 border-slate-200 bg-slate-50 text-slate-400';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedAnswer(opt)}
                    className={`w-full p-4 text-left rounded-xl border text-sm font-medium transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerSubmitted && opt === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCurrentCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            // Text Input for Writing / Translation questions
            <div className="space-y-2">
              <input
                type="text"
                disabled={isAnswerSubmitted}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAnswerSubmitted && textAnswer.trim()) {
                    handleSubmitAnswer();
                  }
                }}
                placeholder="Escriba su respuesta en inglés aquí..."
                className="w-full p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>
          )}

          {/* Explanation Box when submitted */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-xl border space-y-1.5 animate-in fade-in duration-150 ${
                isCurrentCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-sm">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>¡Correcto! Excelente desempeño (+{currentQuestion.points} pt)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>Respuesta incorrecta (Pierdes 1 vida)</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900">Explicación didáctica:</span>{' '}
                {currentQuestion.explanation}
              </p>
              {!isCurrentCorrect && (
                <p className="text-xs font-bold text-emerald-800 pt-1">
                  Respuesta correcta esperada: "{currentQuestion.correctAnswer}"
                </p>
              )}
            </div>
          )}

          {/* Submit / Next Button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={onExit}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              Pausar y Salir
            </button>

            {!isAnswerSubmitted ? (
              <button
                disabled={
                  (currentQuestion.options && currentQuestion.options.length > 0 && !selectedAnswer) ||
                  (!currentQuestion.options && !textAnswer.trim())
                }
                onClick={handleSubmitAnswer}
                className="py-3 px-6 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Confirmar Respuesta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-md cursor-pointer"
              >
                <span>{currentIndex + 1 < quizQuestions.length ? 'Siguiente Pregunta' : 'Ver Resultados Oficiales'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
