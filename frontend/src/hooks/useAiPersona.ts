"use client";
import { useEffect, useState } from 'react';

// Mirrors the persona set on the Profile page ("Executive Analyst" vs "Data Scientist Mode").
// Defaults to the plain-language Executive Analyst view since that's the app's own default
// (see frontend/src/app/api/users/profile/route.ts) and avoids flashing jargon while loading.
export function useAiPersona() {
  const [persona, setPersona] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/users/profile')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (isMounted) setPersona(data?.aiPersona || null);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const isExecutive = !persona || persona.startsWith('Executive');
  return { persona, isExecutive, isLoading };
}
