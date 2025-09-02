"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaRegStar, FaCalendar } from 'react-icons/fa';
import { 
  HiOutlineCalendar, 
  HiOutlineClipboard, 
  HiOutlineAdjustments, 
  HiOutlineCake, 
  HiOutlineCamera,
  HiOutlineCog,
  HiOutlineChat
} from 'react-icons/hi';

const iconMap = {
  calendar: HiOutlineCalendar,
  clipboard: HiOutlineClipboard,
  flowswitch: HiOutlineAdjustments,
  cake: HiOutlineCake,
  camera: HiOutlineCamera,
  settings: HiOutlineCog,
  chat: HiOutlineChat,
};

const accentMap = {
  calendar: 'bg-[#87baf5]',
  clipboard: 'bg-[#8ac3a3]',
  flowswitch: 'bg-[#aa87f5]',
  cake: 'bg-[#f674ad]',
  camera: 'bg-[#f0864a]',
  settings: 'bg-[#88d8b0]',
  chat: 'bg-[#1f1c2f]',
};

export default function NotePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch note');
        }
        const data = await response.json();
        setNote(data.note); // API returns { note } wrapper
      } catch (err) {
        setError('Failed to load note');
        console.error('Error fetching note:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id, session, status, router]);

  const handleFavoriteToggle = async () => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFavorite: !note.isFavorite
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      const data = await response.json();
      setNote(data.note); // Update with the response note
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      router.push('/user');
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Note not found</div>
      </div>
    );
  }

  const IconComponent = iconMap[note.icon] || iconMap.calendar;
  const accentColor = accentMap[note.accent] || accentMap.calendar;
  
  const displayDate = new Date(note.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/user" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft size={16} />
            Back to Notes
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleFavoriteToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 transition-colors"
            >
              {note.isFavorite ? (
                <FaStar className="text-yellow-400" size={16} />
              ) : (
                <FaRegStar size={16} />
              )}
              {note.isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
            
            <Link
              href={`/edit/${note._id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaEdit size={16} />
              Edit
            </Link>
            
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaTrash size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Note Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Note Header */}
          <div className={`${accentColor} p-6 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <IconComponent size={24} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{note.title}</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-white text-opacity-90">
              <FaCalendar size={14} />
              <span className="text-sm">{displayDate}</span>
            </div>
          </div>

          {/* Note Body */}
          <div className="p-8">
            <div 
              className="note-content text-gray-700 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
