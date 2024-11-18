import React, { createContext, useState, useMemo } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (item) => {
    setFavorites((prevFavorites) => {
      // Periksa jika item sudah ada di daftar favorit
      const exists = prevFavorites.some((fav) => fav.id === item.id);
      if (exists) {
        console.log(`Item ${item.name} sudah ada di daftar favorit.`);
        return prevFavorites; // Jika item sudah ada, tidak perlu ditambahkan
      }
      console.log(`Menambahkan ${item.name} ke daftar favorit.`);
      return [...prevFavorites, item];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prevFavorites) => {
      console.log(`Menghapus item dengan ID ${id} dari daftar favorit.`);
      return prevFavorites.filter((item) => item.id !== id);
    });
  };

  // Menggunakan useMemo untuk menghindari pembaruan nilai yang tidak perlu
  const value = useMemo(() => ({ favorites, addFavorite, removeFavorite }), [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
