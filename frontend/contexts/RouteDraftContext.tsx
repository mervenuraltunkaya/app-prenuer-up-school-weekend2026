import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type RouteDraftContextValue = {
  placeIds: string[];
  addPlace: (id: string) => void;
  removePlace: (id: string) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  clear: () => void;
  setOrder: (ids: string[]) => void;
};

const RouteDraftContext = createContext<RouteDraftContextValue | undefined>(undefined);

export function RouteDraftProvider({ children }: { children: React.ReactNode }) {
  const [placeIds, setPlaceIds] = useState<string[]>([]);

  const addPlace = useCallback((id: string) => {
    setPlaceIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removePlace = useCallback((id: string) => {
    setPlaceIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setPlaceIds((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setPlaceIds((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const clear = useCallback(() => setPlaceIds([]), []);

  const setOrder = useCallback((ids: string[]) => setPlaceIds(ids), []);

  const value = useMemo(
    () => ({
      placeIds,
      addPlace,
      removePlace,
      moveUp,
      moveDown,
      clear,
      setOrder,
    }),
    [placeIds, addPlace, removePlace, moveUp, moveDown, clear, setOrder],
  );

  return <RouteDraftContext.Provider value={value}>{children}</RouteDraftContext.Provider>;
}

export function useRouteDraft() {
  const ctx = useContext(RouteDraftContext);
  if (!ctx) throw new Error('useRouteDraft must be used within RouteDraftProvider');
  return ctx;
}
