import { useEffect, useState, useCallback, useRef } from 'react';

interface AntiCheatOptions {
  enabled: boolean;
  onFraudAttempt?: (type: string, details: string) => void;
}

export function useAntiCheat({ enabled, onFraudAttempt }: AntiCheatOptions) {
  const [fraudCount, setFraudCount] = useState(0);
  const [fraudLogs, setFraudLogs] = useState<string[]>([]);
  const [lastWarning, setLastWarning] = useState<string | null>(null);
  const fraudCountRef = useRef(0);

  const registerIncident = useCallback(
    (type: string, message: string) => {
      const now = new Date().toLocaleTimeString('es-CR');
      const logEntry = `[${now}] ${message}`;

      fraudCountRef.current += 1;
      setFraudCount(fraudCountRef.current);
      setFraudLogs((prev) => [...prev, logEntry]);
      setLastWarning(message);

      if (onFraudAttempt) {
        onFraudAttempt(type, logEntry);
      }
    },
    [onFraudAttempt]
  );

  const clearWarning = useCallback(() => {
    setLastWarning(null);
  }, []);

  const resetFraud = useCallback(() => {
    fraudCountRef.current = 0;
    setFraudCount(0);
    setFraudLogs([]);
    setLastWarning(null);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // 1. Prevent copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      registerIncident('COPY_BLOCKED', 'Intento de copiar texto bloqueado (Antifraude activo).');
    };

    // 2. Prevent paste
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      registerIncident('PASTE_BLOCKED', 'Intento de pegar texto bloqueado (Antifraude activo).');
    };

    // 3. Prevent cut
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      registerIncident('CUT_BLOCKED', 'Intento de cortar texto bloqueado.');
    };

    // 4. Prevent right-click context menu (which allows translate or copy)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      registerIncident('CONTEXT_MENU', 'Menú contextual / clic derecho bloqueado.');
    };

    // 5. Detect tab switching or window blur
    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerIncident('TAB_SWITCH', 'Pestaña oculta o cambio de ventana detectado.');
      }
    };

    const handleBlur = () => {
      registerIncident('WINDOW_BLUR', 'Pérdida de foco en la ventana (posible uso de traductor externo).');
    };

    // 6. Block common keyboard shortcuts like Ctrl+C, Ctrl+V, Ctrl+U, F12
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'u', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        registerIncident('SHORTCUT_BLOCKED', `Atajo de teclado Ctrl+${e.key.toUpperCase()} bloqueado.`);
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, registerIncident]);

  return {
    fraudCount,
    fraudLogs,
    lastWarning,
    clearWarning,
    resetFraud,
  };
}
