import { useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'hotel_form_draft';

export function useAutoSave(formData, enabled = true) {
  const timeoutRef = useRef(null);

  const save = useCallback(() => {
    if (!enabled) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: formData,
        savedAt: Date.now()
      }));
    } catch (e) {
      console.warn('Auto-save failed:', e);
    }
  }, [formData, enabled]);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* empty */ }
  }, []);

  const load = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch { /* empty */ }
    return null;
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(save, 1000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, save]);

  return { save, clear, load };
}
