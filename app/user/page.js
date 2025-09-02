"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotes } from '../contexts/NotesContext';
import { useModal } from '../contexts/ModalContext';
import { useSearch } from '../contexts/SearchContext';
import { useNotification } from '../contexts/NotificationContext';
import Note from '../components/Note'
import ViewNoteModal from '../components/ViewNoteModal';
import EditNoteModal from '../components/EditNoteModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { CiFilter } from 'react-icons/ci'
import Topbar from '../components/Topbar';
import Link from 'next/link';

// Import all the icon components for notes
import { CiCalendar } from 'react-icons/ci';
import { FaRegClipboard } from 'react-icons/fa';
import { TiFlowSwitch } from 'react-icons/ti';
import { FaCakeCandles } from 'react-icons/fa6';
import { FaCamera } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';

// Icon mapping for notes
const iconMap = {
  calendar: CiCalendar,
  clipboard: FaRegClipboard,
  flowswitch: TiFlowSwitch,
  cake: FaCakeCandles,
  camera: FaCamera,
  settings: CiSettings,
  chat: IoChatboxEllipsesOutline,
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    notes, 
    allNotes, // For counting all notes including deleted ones
    loading, 
    error, 
    clearError,
    deleteNote, 
    toggleFavorite, 
    saveNote,
    archiveNote,
    unarchiveNote
  } = useNotes();
  const {
    viewModalOpen,
    editModalOpen,
    selectedNote,
    openViewModal,
    closeViewModal,
    openEditModal,
    closeEditModal,
    confirmationModalOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal
  } = useModal();
  const { searchQuery, isSearching, searchNotes } = useSearch();
  const { show } = useNotification();
  
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Filter notes based on active filter and search query
  useEffect(() => {
    let filtered = [...notes];
    
    // First apply search filter if there's a search query
    if (searchQuery.trim()) {
      filtered = searchNotes(filtered);
    }
    
    // Then apply other filters
    switch (activeFilter) {
      case 'archived':
        filtered = filtered.filter(note => note.isArchived);
        break;
      case 'favorites':
        filtered = filtered.filter(note => note.isFavorite);
        break;
      default:
        filtered = filtered.filter(note => !note.isArchived);
    }
    
    setFilteredNotes(filtered);
  }, [notes, activeFilter, searchQuery, searchNotes]);

  // Clear errors when notes are successfully loaded
  useEffect(() => {
    if (!loading && notes.length > 0 && error) {
      clearError();
    }
  }, [loading, notes.length, error, clearError]);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Handle favorite toggle with notification
  const handleFavoriteToggle = async (noteId) => {
    const note = notes.find(n => n._id === noteId);
    if (!note) return;

    const willBeFavorite = !note.isFavorite;
    
    // Call the context function
    await toggleFavorite(noteId);
    
    // Show notification using the notification context
    const message = willBeFavorite ? 'Added to favorites!' : 'Removed from favorites!';
    show(message, 'success');
  };

  // Handle archive toggle with notification
  const handleArchiveToggle = async (noteId, shouldArchive) => {
    const note = notes.find(n => n._id === noteId);
    if (!note) return;

    if (shouldArchive) {
      await archiveNote(noteId);
    } else {
      await unarchiveNote(noteId);
    }
  };

  // Handle save note from edit modal
  // Show loading while checking authentication
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading your notes...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <>
      <Topbar heading={"Write your Note"}/>

      <div className="rounded-xl bg-white p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className='text-3xl font-bold'>Your Notes</h1>
            {searchQuery.trim() && (
              <p className="text-gray-600 mt-2">
                Showing search results for &ldquo;{searchQuery}&rdquo; ({filteredNotes.length} found)
              </p>
            )}
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between px-3 mb-6'>
            <ul className="flex gap-7">
              <li 
                className={`hover:border-b-black hover:border-b-2 cursor-pointer pb-2 ${
                  activeFilter === 'all' ? 'border-b-black border-b-2 font-semibold' : ''
                }`}
                onClick={() => handleFilterChange('all')}
              >
                All Notes ({notes.filter(note => !note.isArchived).length})
              </li>
              <li 
                className={`hover:border-b-black hover:border-b-2 cursor-pointer pb-2 ${
                  activeFilter === 'archived' ? 'border-b-black border-b-2 font-semibold' : ''
                }`}
                onClick={() => handleFilterChange('archived')}
              >
                Archived Notes ({notes.filter(note => note.isArchived).length})
              </li>
              <li 
                className={`hover:border-b-black hover:border-b-2 cursor-pointer pb-2 ${
                  activeFilter === 'favorites' ? 'border-b-black border-b-2 font-semibold' : ''
                }`}
                onClick={() => handleFilterChange('favorites')}
              >
                Favourite Notes ({notes.filter(note => note.isFavorite).length})
              </li>
            </ul>
            
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className='my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => {
                // Get the icon component
                const IconComponent = iconMap[note.icon] || iconMap.calendar;
                
                return (
                  <div key={note._id} className="relative">
                    <Note
                      note={note} // Pass the full note object
                      title={note.title}
                      content={note.content} // Use full HTML content for styled display
                      icon={<IconComponent size={20} />}
                      accent={note.accent || 'calendar'}
                      star={true} // Always show star for toggle functionality
                      isFavorite={note.isFavorite}
                      createdAt={note.createdAt}
                      onFavoriteToggle={handleFavoriteToggle}
                      onArchiveToggle={handleArchiveToggle}
                    />
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  {searchQuery.trim() ? (
                    `No notes found matching "${searchQuery}"`
                  ) : (
                    activeFilter === 'all' ? 'No notes yet. Create your first note!' :
                    activeFilter === 'archived' ? 'No archived notes.' :
                    'No favorite notes yet.'
                  )}
                </div>
                {activeFilter === 'all' && !searchQuery.trim() && (
                  <Link 
                    href="/create" 
                    className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors inline-block"
                  >
                    Create Your First Note
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewNoteModal
        note={selectedNote}
        isOpen={viewModalOpen}
        onClose={closeViewModal}
      />      <EditNoteModal
        note={selectedNote}
        isOpen={editModalOpen}
        onClose={closeEditModal}
      />

      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationConfig.onConfirm}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        confirmText={confirmationConfig.confirmText}
        cancelText={confirmationConfig.cancelText}
        type={confirmationConfig.type}
      />
    </>
  );
}