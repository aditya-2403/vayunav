import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('vayuNav_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('vayuNav_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (airportCode) => {
    setFavorites((prev) => 
      prev.includes(airportCode) 
        ? prev.filter(c => c !== airportCode)
        : [...prev, airportCode]
    );
  };

  const isFavorite = (airportCode) => favorites.includes(airportCode);

  return { favorites, toggleFavorite, isFavorite };
}
