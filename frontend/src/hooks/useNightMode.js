import { useState, useEffect } from 'react';

export function useNightMode() {
  const [isNightMode, setIsNightMode] = useState(() => {
    return localStorage.getItem('vayuNav_nightMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('vayuNav_nightMode', isNightMode);
    if (isNightMode) {
      document.body.classList.add('night-vision');
    } else {
      document.body.classList.remove('night-vision');
    }
  }, [isNightMode]);

  const toggleNightMode = () => setIsNightMode(!isNightMode);

  return { isNightMode, toggleNightMode };
}
