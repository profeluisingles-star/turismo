import { StudentProfile, UserStats, ExamAttempt, Badge } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'profe_luis_student_profile',
  STATS: 'profe_luis_student_stats',
  EXAM_ATTEMPTS: 'profe_luis_exam_attempts',
};

export const TEACHER_EMAIL = 'profeluisingles@gmail.com';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'Primer Paso Turístico',
    description: 'Completaste tu primera unidad con éxito.',
    icon: '🧭',
  },
  {
    id: 'reception_pro',
    title: 'Recepcionista Estrella',
    description: 'Superaste el Bloque 1 de Saludos y Registro.',
    icon: '🛎️',
  },
  {
    id: 'booking_master',
    title: 'Especialista en Reservas',
    description: 'Completaste con éxito el Bloque 2 de Reservas y Tarifas.',
    icon: '📅',
  },
  {
    id: 'eco_guide',
    title: 'Guía Bilingüe de la Naturaleza',
    description: 'Aprobaste el Bloque 3 de Turismo Rural y Senderos.',
    icon: '🦜',
  },
  {
    id: 'hospitality_hero',
    title: 'Resolución y Excelencia',
    description: 'Dominaste el Bloque 4 de Quejas, Seguridad y Entrevistas.',
    icon: '🌟',
  },
  {
    id: 'perfect_score',
    title: 'Examen Impecable 20/20',
    description: 'Obtuviste 20 puntos perfectos en una evaluación oficial.',
    icon: '🏆',
  },
  {
    id: 'honest_student',
    title: 'Integridad y Juego Limpio',
    description: 'Evaluación completada con 0 alertas de fraude ni cambios de pestaña.',
    icon: '🛡️',
  },
  {
    id: 'midterm_master',
    title: 'Control de Mitad de Curso Aprobado',
    description: 'Superaste con éxito el examen checkpoint de los Bloques 1 y 2.',
    icon: '🎖️',
  },
  {
    id: 'tourism_graduate',
    title: 'Especialista Graduado Costa Rica',
    description: 'Completaste las 12 unidades del programa oficial.',
    icon: '🎓',
  },
];

export function getStoredProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {}
}

export function getStoredStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        midtermPassed: parsed.midtermPassed ?? false,
        remedialUnitId: parsed.remedialUnitId ?? null,
        midtermWeaknesses: parsed.midtermWeaknesses ?? [],
      };
    }
  } catch {}

  return {
    profile: getStoredProfile(),
    unlockedUnits: [1], // Only Unit 1 is unlocked initially!
    completedUnits: [],
    unitScores: {},
    xp: 0,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    badges: [],
    midtermPassed: false,
    remedialUnitId: null,
    midtermWeaknesses: [],
  };
}

export function saveStoredStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {}
}

export function getStoredExamAttempts(): ExamAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM_ATTEMPTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Diagnostic analysis helper for Midterm Exam answers
 */
export function analyzeMidtermDiagnostics(answers: ExamAttempt['answers']) {
  const unitMistakes: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const skillMistakes: Record<string, number> = {
    listening: 0,
    transcription: 0,
    translation: 0,
    vocabulary: 0,
    grammar: 0,
  };

  answers.forEach((ans) => {
    if (!ans.isCorrect) {
      if (ans.sourceUnitId && ans.sourceUnitId >= 1 && ans.sourceUnitId <= 6) {
        unitMistakes[ans.sourceUnitId] = (unitMistakes[ans.sourceUnitId] || 0) + 1;
      }
      if (ans.skillCategory) {
        skillMistakes[ans.skillCategory] = (skillMistakes[ans.skillCategory] || 0) + 1;
      }
    }
  });

  // Find worst unit
  let worstUnitId = 1;
  let maxMistakes = -1;
  for (let u = 1; u <= 6; u++) {
    if (unitMistakes[u] > maxMistakes) {
      maxMistakes = unitMistakes[u];
      worstUnitId = u;
    }
  }

  // Find worst skill
  let worstSkill = 'vocabulary';
  let maxSkillMistakes = -1;
  Object.entries(skillMistakes).forEach(([skill, count]) => {
    if (count > maxSkillMistakes) {
      maxSkillMistakes = count;
      worstSkill = skill;
    }
  });

  return {
    unitMistakes,
    skillMistakes,
    worstUnitId,
    worstSkill,
  };
}

export function saveExamAttempt(attempt: ExamAttempt): UserStats {
  const currentStats = getStoredStats();
  const unitId = attempt.unitId;

  // Handle Midterm Checkpoint (Unit ID 50)
  if (unitId === 50) {
    if (attempt.passed) {
      currentStats.midtermPassed = true;
      currentStats.remedialUnitId = null;
      currentStats.midtermWeaknesses = [];
      if (!currentStats.completedUnits.includes(50)) {
        currentStats.completedUnits.push(50);
      }
      // Unlock Unit 7!
      if (!currentStats.unlockedUnits.includes(7)) {
        currentStats.unlockedUnits.push(7);
        currentStats.unlockedUnits.sort((a, b) => a - b);
      }
      if (!currentStats.badges.includes('midterm_master')) {
        currentStats.badges.push('midterm_master');
      }
    } else {
      // Failed Midterm Checkpoint -> Run diagnostic & assign remediation
      const diag = analyzeMidtermDiagnostics(attempt.answers);
      currentStats.remedialUnitId = diag.worstUnitId;
      currentStats.midtermPassed = false;
      currentStats.midtermWeaknesses = [
        `Mayor debilidad en Unidad ${diag.worstUnitId} (${diag.unitMistakes[diag.worstUnitId]} errores)`,
        `Habilidad a reforzar: ${diag.worstSkill}`,
      ];
      attempt.assignedRemedialUnitId = diag.worstUnitId;
    }
  } else if (unitId <= 6) {
    // Check if student was remediating this unit
    if (currentStats.remedialUnitId === unitId && attempt.passed) {
      currentStats.remedialUnitId = null; // Remediation successful!
    }

    if (attempt.passed) {
      if (!currentStats.completedUnits.includes(unitId)) {
        currentStats.completedUnits.push(unitId);
      }
      if (unitId < 6) {
        const nextUnitId = unitId + 1;
        if (!currentStats.unlockedUnits.includes(nextUnitId)) {
          currentStats.unlockedUnits.push(nextUnitId);
          currentStats.unlockedUnits.sort((a, b) => a - b);
        }
      } else if (unitId === 6) {
        // Unit 6 passed: Unlock the Midterm Checkpoint (Unit 50), NOT Unit 7!
        if (!currentStats.unlockedUnits.includes(50)) {
          currentStats.unlockedUnits.push(50);
          currentStats.unlockedUnits.sort((a, b) => a - b);
        }
      }
    }
  } else if (unitId >= 7 && unitId <= 12) {
    // Advanced units (Blocks 3 & 4)
    if (attempt.passed) {
      if (!currentStats.completedUnits.includes(unitId)) {
        currentStats.completedUnits.push(unitId);
      }
      const nextUnitId = unitId + 1;
      if (nextUnitId <= 12 && !currentStats.unlockedUnits.includes(nextUnitId)) {
        currentStats.unlockedUnits.push(nextUnitId);
        currentStats.unlockedUnits.sort((a, b) => a - b);
      }
    }
  }

  // Update unit scores
  const prevRecord = currentStats.unitScores[unitId] || { bestScore: 0, attempts: 0, passed: false };
  const passed = attempt.passed || prevRecord.passed;
  const bestScore = Math.max(prevRecord.bestScore, attempt.score);

  currentStats.unitScores[unitId] = {
    bestScore,
    attempts: prevRecord.attempts + 1,
    passed,
    date: attempt.timestamp,
  };

  // Add XP
  currentStats.xp += attempt.score * 10;
  if (attempt.score === 20) currentStats.xp += 100; // Bonus for perfect score

  // Badges check
  const newBadges = [...currentStats.badges];
  if (passed && !newBadges.includes('first_step')) {
    newBadges.push('first_step');
  }
  if (attempt.score === 20 && !newBadges.includes('perfect_score')) {
    newBadges.push('perfect_score');
  }
  if (attempt.fraudAlertsCount === 0 && !newBadges.includes('honest_student')) {
    newBadges.push('honest_student');
  }
  // Block badges
  if ([1, 2, 3].every((u) => currentStats.completedUnits.includes(u)) && !newBadges.includes('reception_pro')) {
    newBadges.push('reception_pro');
  }
  if ([4, 5, 6].every((u) => currentStats.completedUnits.includes(u)) && !newBadges.includes('booking_master')) {
    newBadges.push('booking_master');
  }
  if ([7, 8, 9].every((u) => currentStats.completedUnits.includes(u)) && !newBadges.includes('eco_guide')) {
    newBadges.push('eco_guide');
  }
  if ([10, 11, 12].every((u) => currentStats.completedUnits.includes(u)) && !newBadges.includes('hospitality_hero')) {
    newBadges.push('hospitality_hero');
  }
  if (currentStats.completedUnits.length >= 12 && !newBadges.includes('tourism_graduate')) {
    newBadges.push('tourism_graduate');
  }

  currentStats.badges = newBadges;
  saveStoredStats(currentStats);

  try {
    const attempts = getStoredExamAttempts();
    attempts.unshift(attempt);
    localStorage.setItem(STORAGE_KEYS.EXAM_ATTEMPTS, JSON.stringify(attempts));
  } catch {}

  return currentStats;
}
