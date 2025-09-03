"use client";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import { useNotes } from '../contexts/NotesContext';
import { useNotification } from '../contexts/NotificationContext';

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { notes } = useNotes();
  const { show } = useNotification();
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  const handleExportNotes = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        userEmail: session.user.email,
        totalNotes: notes.length,
        notes: notes.map(note => ({
          id: note._id,
          title: note.title,
          content: note.content,
          icon: note.icon,
          accent: note.accent,
          isFavorite: note.isFavorite,
          isArchived: note.isArchived,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notesphere-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      show('Notes exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      show('Failed to export notes. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        show('Account deleted successfully!', 'success');
        // Sign out and redirect to home page
        setTimeout(() => {
          signOut({
            callbackUrl: '/'
          });
        }, 1500);
      } else {
        const data = await response.json();
        show(data.error || 'Failed to delete account. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Delete account failed:', error);
      show('Failed to delete account. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Topbar heading="Settings" />

      <div className="rounded-xl bg-white p-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <div className="space-y-6">
            {/* Account Settings */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={session?.user?.email || ''}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={session?.user?.name || ''}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="font-medium text-yellow-800">Export Your Data</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Download all your notes ({notes.length} notes) in JSON format
                  </p>
                  <button 
                    onClick={handleExportNotes}
                    disabled={isExporting || notes.length === 0}
                    className="mt-3 cursor-pointer px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExporting ? 'Exporting...' : 'Export Notes'}
                  </button>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="font-medium text-red-800">Delete Account</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  {!showDeleteConfirm ? (
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="mt-3 cursor-pointer bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="mt-3 space-y-3">
                      <p className="text-sm font-medium text-red-800">
                        Are you sure? This will delete your account and all {notes.length} notes permanently.
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="cursor-pointer bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? 'Deleting...' : 'Yes, Delete Forever'}
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                          className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
