import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'nomad_selected_city_id';

export type CityRow = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
};

type CityContextValue = {
  cityId: string | null;
  city: CityRow | null;
  loading: boolean;
  setCityId: (id: string) => Promise<void>;
  clearCity: () => Promise<void>;
};

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [cityId, setCityIdState] = useState<string | null>(null);
  const [city, setCity] = useState<CityRow | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCityRow = useCallback(async (id: string) => {
    const { data, error } = await supabase.from('cities').select('*').eq('id', id).maybeSingle();
    if (error || !data) {
      setCity(null);
      return;
    }
    setCity({
      id: data.id,
      name: data.name,
      country: data.country,
      lat: data.lat,
      lng: data.lng,
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!mounted) return;
      if (stored) {
        setCityIdState(stored);
        await loadCityRow(stored);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [loadCityRow]);

  const setCityId = useCallback(
    async (id: string) => {
      await AsyncStorage.setItem(STORAGE_KEY, id);
      setCityIdState(id);
      await loadCityRow(id);
    },
    [loadCityRow],
  );

  const clearCity = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setCityIdState(null);
    setCity(null);
  }, []);

  const value = useMemo(
    () => ({
      cityId,
      city,
      loading,
      setCityId,
      clearCity,
    }),
    [cityId, city, loading, setCityId, clearCity],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error('useCity must be used within CityProvider');
  return ctx;
}
