"use client";

import * as React from 'react';

export type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const SearchContext = React.createContext<SearchContextType | null>(null);

export function useSearch() {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
}
