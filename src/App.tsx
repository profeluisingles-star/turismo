import React, { useState, useEffect } from 'react';
import { UNITS_DATA } from './data/curriculumData';
import { UnitData, StudentProfile, UserStats, ExamAttempt } from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredStats,
  saveStoredStats,
} from './utils/storage';
import { StudentHeader } from './components/StudentHeader';
import { StudentRegistrationModal } from './components/StudentRegistrationModal';
import { UnitListView } from './components/UnitListView';
import { UnitStudyView } from './components/UnitStudyView';
import { QuizEngine } from './components/QuizEngine';
import { ResourcesView } from './components/ResourcesView';
import { TeacherPortal } from './components/TeacherPortal';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(() => getStoredProfile());
  const [stats, setStats] = useState<UserStats>(() => getStoredStats());
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(() => !getStoredProfile()?.name);
  const [activeView, setActiveView] = useState<'units' | 'study' | 'exam' | 'resources' | 'teacher'>('units');
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // 1.0x or 0.8x

  // Ensure registration modal opens if no profile name is registered
  useEffect(() => {
    if (!profile || !profile.name) {
      setIsRegistrationOpen(true);
    }
  }, [profile]);

  // Handle saving student profile
  const handleSaveProfile = (newProfile: StudentProfile) => {
    saveStoredProfile(newProfile);
    setProfile(newProfile);

    // Update stats with new profile
    const updatedStats = { ...stats, profile: newProfile };
    saveStoredStats(updatedStats);
    setStats(updatedStats);

    setIsRegistrationOpen(false);
  };

  // Select a unit to study
  const handleSelectUnit = (unit: UnitData) => {
    setSelectedUnit(unit);
    setActiveView('study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start exam from unit study view
  const handleStartExam = () => {
    if (!profile?.name) {
      setIsRegistrationOpen(true);
      return;
    }
    setActiveView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When exam is finished
  const handleExamFinish = (attempt: ExamAttempt) => {
    // Reload freshly updated stats
    const freshStats = getStoredStats();
    setStats(freshStats);
  };

  // Teacher actions: unlock all units for classroom demonstrations
  const handleUnlockAll = () => {
    const allUnitIds = UNITS_DATA.map((u) => u.id);
    const updated: UserStats = {
      ...stats,
      unlockedUnits: allUnitIds,
    };
    saveStoredStats(updated);
    setStats(updated);
    alert('Modo Docente: Se han desbloqueado las 12 unidades del programa para demostración en clase.');
  };

  // Reset student progress for clean testing
  const handleResetProgress = () => {
    localStorage.clear();
    const freshStats: UserStats = {
      profile: null,
      unlockedUnits: [1],
      completedUnits: [],
      unitScores: {},
      xp: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      badges: [],
    };
    setProfile(null);
    setStats(freshStats);
    setSelectedUnit(null);
    setActiveView('units');
    setIsRegistrationOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Student Registration Modal (Opens automatically if not registered) */}
      <StudentRegistrationModal
        isOpen={isRegistrationOpen}
        initialProfile={profile}
        onSave={handleSaveProfile}
      />

      {/* Main Global Header */}
      <StudentHeader
        profile={profile}
        stats={stats}
        currentSpeechRate={speechRate}
        onSpeechRateChange={setSpeechRate}
        onOpenProfile={() => setIsRegistrationOpen(true)}
        onOpenTeacherPortal={() => setActiveView('teacher')}
        activeView={activeView === 'units' || activeView === 'resources' || activeView === 'teacher' ? activeView : 'units'}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Body Content */}
      <main className="flex-1 pb-16">
        {activeView === 'units' && (
          <UnitListView
            units={UNITS_DATA}
            stats={stats}
            onSelectUnit={handleSelectUnit}
          />
        )}

        {activeView === 'study' && selectedUnit && (
          <UnitStudyView
            unit={selectedUnit}
            speechRate={speechRate}
            bestScore={stats.unitScores[selectedUnit.id]?.bestScore}
            passed={stats.completedUnits.includes(selectedUnit.id)}
            onStartExam={handleStartExam}
            onBack={() => {
              setActiveView('units');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'exam' && selectedUnit && profile && (
          <QuizEngine
            unit={selectedUnit}
            profile={profile}
            speechRate={speechRate}
            onFinish={handleExamFinish}
            onExit={() => {
              setActiveView('study');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'resources' && (
          <ResourcesView speechRate={speechRate} />
        )}

        {activeView === 'teacher' && (
          <TeacherPortal
            onUnlockAllUnits={handleUnlockAll}
            onResetProgress={handleResetProgress}
            onClose={() => setActiveView('units')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs space-y-1">
        <p className="font-semibold text-slate-200">
          English for Hospitality & Rural Tourism • Costa Rica
        </p>
        <p>
          Material didáctico para estudiantes hispanohablantes • Docente:{' '}
          <span className="font-mono text-emerald-400">profeluisingles@gmail.com</span>
        </p>
        <p className="text-[11px] text-slate-500">
          Plataforma educativa con protección antifraude, prácticas de escucha y evaluaciones de 20 pts con 3 vidas.
        </p>
      </footer>
    </div>
  );
}
