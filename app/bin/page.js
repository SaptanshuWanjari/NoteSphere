"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotes } from '../contexts/NotesContext';
import { useModal } from '../contexts/ModalContext';
import BinNote from '../components/BinNote';
import ConfirmationModal from '../components/ConfirmationModal';
import Topbar from '../components/Topbar';
import { useNotification } from '../contexts/NotificationContext';

// Import all the icon components for notes
import { CiCalendar } from 'react-icons/ci';
import { FaRegClipboard } from 'react-icons/fa';
import { TiFlowSwitch } from 'react-icons/ti';
import { FaCakeCandles } from 'react-icons/fa6';
import { FaCamera, FaTrashRestore, FaTrash } from 'react-icons/fa';
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

const BinPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { restoreNote, permanentlyDeleteNote } = useNotes();
  const { show } = useNotification();
  const {
    confirmationModalOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal
  } = useModal();
  
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch deleted notes
  useEffect(() => {
    const fetchDeletedNotes = async () => {
      if (!session) return;
      
      console.log('Fetching deleted notes for session:', session.user);
      setLoading(true);
      try {
        const response = await fetch('/api/notes/bin');
        console.log('Bin API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Bin API error:', errorText);
          throw new Error('Failed to fetch deleted notes');
        }
        const data = await response.json();
        console.log('Bin API data:', data);
        setDeletedNotes(data.notes || []);
      } catch (err) {
        setError('Failed to load deleted notes');
        console.error('Error fetching deleted notes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDeletedNotes();
    }
  }, [session]);

  // Handle note restoration
  const handleRestore = async (noteId) => {
    openConfirmationModal({
      title: "Restore Note",
      message: "Are you sure you want to restore this note? This will move it back to your notes.",
      confirmText: "Restore",
      cancelText: "Cancel",
      type: "success",
      onConfirm: async () => {
        const success = await restoreNote(noteId);
        if (success) {
          // Remove from deleted notes list
          setDeletedNotes(prev => prev.filter(note => note._id !== noteId));
          // Note: popup is shown by the context with detailed info
        }
      }
    });
  };

  // Handle permanent deletion
  const handlePermanentDelete = async (noteId) => {
    const noteToDelete = deletedNotes.find(note => note._id === noteId);
    openConfirmationModal({
      title: "Permanently Delete Note",
      message: `Are you sure you want to permanently delete "${noteToDelete?.title}"? This action cannot be undone.`,
      confirmText: "Delete Forever",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        const success = await permanentlyDeleteNote(noteId);
        if (success) {
          // Remove from deleted notes list
          setDeletedNotes(prev => prev.filter(note => note._id !== noteId));
          // Note: permanent delete doesn't need additional popup
        }
      }
    });
  };

  // Handle restore all notes
  const handleRestoreAll = () => {
    if (deletedNotes.length === 0) return;
    
    openConfirmationModal({
      title: "Restore All Notes",
      message: `Are you sure you want to restore all ${deletedNotes.length} notes? This will move them back to your notes.`,
      confirmText: "Restore All",
      cancelText: "Cancel",
      type: "success",
      onConfirm: async () => {
        const promises = deletedNotes.map(note => restoreNote(note._id));
        await Promise.all(promises);
        setDeletedNotes([]);
        // Individual restore operations will show notifications from context
      }
    });
  };

  // Handle empty bin (permanent delete all)
  const handleEmptyBin = () => {
    if (deletedNotes.length === 0) return;
    
    openConfirmationModal({
      title: "Empty Bin",
      message: `Are you sure you want to permanently delete all ${deletedNotes.length} notes? This action cannot be undone.`,
      confirmText: "Empty Bin",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        const promises = deletedNotes.map(note => permanentlyDeleteNote(note._id));
        await Promise.all(promises);
        setDeletedNotes([]);
        // No additional popup needed for permanent deletion
      }
    });
  };

  // Show loading while checking authentication
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading deleted notes...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <>
      <Topbar heading={"Your deleted notes  "} />

      <div className="rounded-xl bg-white p-4 sm:p-6 lg:p-8 mx-4 sm:mx-6 lg:mx-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold'>Deleted Notes</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Notes will be permanently deleted after 30 days
            </p>
          </div>
          
          {deletedNotes.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleRestoreAll}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <FaTrashRestore />
                Restore All
              </button>
              <button
                onClick={handleEmptyBin}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <FaTrash />
                Empty Bin
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className='my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
          {deletedNotes.length > 0 ? (
            deletedNotes.map((note) => {
              // Get the icon component
              const IconComponent = iconMap[note.icon] || iconMap.calendar;
              
              return (
                <BinNote
                  key={note._id}
                  note={note}
                  title={note.title}
                  content={note.content}
                  icon={<IconComponent size={20} />}
                  accent={note.accent || 'calendar'}
                  createdAt={note.createdAt}
                  deletedAt={note.deletedAt}
                  onRestore={handleRestore}
                  onPermanentDelete={handlePermanentDelete}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                Your bin is empty
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                Deleted notes will appear here and can be restored for 30 days
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
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

export default BinPage;
