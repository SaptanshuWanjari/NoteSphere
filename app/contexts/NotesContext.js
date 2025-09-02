"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNotification } from './NotificationContext';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const { data: session } = useSession();
  const { show } = useNotification();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch notes
  const fetchNotes = async () => {
    if (!session) return;
    
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data.notes || []);
      setError(''); // Clear error on successful fetch
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load notes when session is available
  useEffect(() => {
    const loadNotes = async () => {
      if (!session) return;
      
      setLoading(true);
      setError(''); // Clear any previous errors
      try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        setNotes(data.notes || []);
        setError(''); // Clear error on successful fetch
      } catch (err) {
        setError('Failed to load notes');
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      loadNotes();
    }
  }, [session]);

  // Add note
  const addNote = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

  // Update note
  const updateNote = (noteId, updatedData) => {
    setNotes(prev => 
      prev.map(note => 
        note._id === noteId 
          ? { ...note, ...updatedData }
          : note
      )
    );
  };

  // Delete note (soft delete - move to bin)
  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDeleted: true,
          deletedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateNote(noteId, { isDeleted: true, deletedAt: data.note.deletedAt });
        setError(''); // Clear any previous errors
        show('Moved to Bin. You can recover within 30 days before it\'s permanently deleted.', 'info');
        return true;
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
      return false;
    }
  };

  // Restore note from bin
  const restoreNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDeleted: false,
          deletedAt: null
        }),
      });

      if (response.ok) {
        updateNote(noteId, { isDeleted: false, deletedAt: null });
        // Refresh notes to get the updated list
        await fetchNotes();
        show('Note restored from Bin', 'success');
        return true;
      } else {
        throw new Error('Failed to restore note');
      }
    } catch (err) {
      console.error('Error restoring note:', err);
      setError('Failed to restore note');
      return false;
    }
  };

  // Permanently delete note
  const permanentlyDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(prev => prev.filter(n => n._id !== noteId));
        show('Note deleted forever', 'danger');
        return true;
      } else {
        throw new Error('Failed to permanently delete note');
      }
    } catch (err) {
      console.error('Error permanently deleting note:', err);
      setError('Failed to permanently delete note');
      return false;
    }
  };

  // Toggle favorite
  const toggleFavorite = async (noteId) => {
    const note = notes.find(n => n._id === noteId);
    if (!note) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFavorite: !note.isFavorite
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateNote(noteId, { isFavorite: data.note.isFavorite });
        setError(''); // Clear any previous errors
      } else {
        throw new Error('Failed to update favorite status');
      }
    } catch (err) {
      console.error('Error updating favorite:', err);
      setError('Failed to update favorite status');
    }
  };

  // Save note (for editing)
  const saveNote = async (noteId, updatedData) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        updateNote(noteId, data.note);
        setError(''); // Clear any previous errors
        return true;
      } else {
        throw new Error('Failed to save note');
      }
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note');
      return false;
    }
  };

  // Archive note
  const archiveNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isArchived: true
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateNote(noteId, { isArchived: true });
        setError(''); // Clear any previous errors
        show('Note archived successfully!', 'success');
        return true;
      } else {
        throw new Error('Failed to archive note');
      }
    } catch (err) {
      console.error('Error archiving note:', err);
      setError('Failed to archive note');
      show('Failed to archive note', 'error');
      return false;
    }
  };

  // Unarchive note
  const unarchiveNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isArchived: false
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateNote(noteId, { isArchived: false });
        setError(''); // Clear any previous errors
        show('Note unarchived successfully!', 'success');
        return true;
      } else {
        throw new Error('Failed to unarchive note');
      }
    } catch (err) {
      console.error('Error unarchiving note:', err);
      setError('Failed to unarchive note');
      show('Failed to unarchive note', 'error');
      return false;
    }
  };

  // Filter out deleted notes from the normal notes view
  const getActiveNotes = () => {
    return notes.filter(note => !note.isDeleted);
  };

  // Clear error function
  const clearError = () => {
    setError('');
  };

  const value = {
    notes: getActiveNotes(), // Only return non-deleted notes
    allNotes: notes, // Keep all notes for internal operations
    loading,
    error,
    setError,
    clearError,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    toggleFavorite,
    saveNote,
    archiveNote,
    unarchiveNote,
    refreshNotes: fetchNotes // Alias for manually refreshing notes
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
