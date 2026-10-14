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
      return JSON.parse(raw);
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

export function saveExamAttempt(attempt: ExamAttempt): UserStats {
  try {
    const attempts = getStoredExamAttempts();
    attempts.unshift(attempt);
    localStorage.setItem(STORAGE_KEYS.EXAM_ATTEMPTS, JSON.stringify(attempts));
  } catch {}

  const currentStats = getStoredStats();
  const unitId = attempt.unitId;

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

  // Progression: Unlock next unit if passed (>= 14/20 pts or 70%)
  if (passed) {
    if (!currentStats.completedUnits.includes(unitId)) {
      currentStats.completedUnits.push(unitId);
    }
    const nextUnitId = unitId + 1;
    if (nextUnitId <= 12 && !currentStats.unlockedUnits.includes(nextUnitId)) {
      currentStats.unlockedUnits.push(nextUnitId);
      currentStats.unlockedUnits.sort((a, b) => a - b);
    }
  }

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
  return currentStats;
}
