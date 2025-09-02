"use client";
import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  // Update search query
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
    setIsSearching(query.trim().length > 0);
  };

  // Search function to filter notes
  const searchNotes = (notes) => {
    if (!searchQuery.trim()) {
      return notes;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return notes.filter(note => {
      // Search in title
      const titleMatch = note.title.toLowerCase().includes(query);
      
      // Search in content (remove HTML tags for better search)
      const contentText = note.content.replace(/<[^>]*>/g, '').toLowerCase();
      const contentMatch = contentText.includes(query);
      
      // Search in tags if they exist
      const tagsMatch = note.tags ? 
        note.tags.some(tag => tag.toLowerCase().includes(query)) : 
        false;

      return titleMatch || contentMatch || tagsMatch;
    });
  };

  const value = {
    searchQuery,
    isSearching,
    updateSearchQuery,
    clearSearch,
    searchNotes,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
