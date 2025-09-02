"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaStrikethrough, 
  FaAlignLeft, 
  FaAlignCenter, 
  FaAlignRight, 
  FaListUl, 
  FaListOl, 
  FaQuoteLeft,
  FaSave,
  FaArrowLeft
} from 'react-icons/fa';
import { 
  HiOutlineCalendar, 
  HiOutlineClipboard, 
  HiOutlineAdjustments, 
  HiOutlineCake, 
  HiOutlineCamera,
  HiOutlineCog,
  HiOutlineChat
} from 'react-icons/hi';

const iconOptions = [
  { name: 'calendar', icon: HiOutlineCalendar, label: 'Calendar' },
  { name: 'clipboard', icon: HiOutlineClipboard, label: 'Clipboard' },
  { name: 'flowswitch', icon: HiOutlineAdjustments, label: 'Flow Switch' },
  { name: 'cake', icon: HiOutlineCake, label: 'Cake' },
  { name: 'camera', icon: HiOutlineCamera, label: 'Camera' },
  { name: 'settings', icon: HiOutlineCog, label: 'Settings' },
  { name: 'chat', icon: HiOutlineChat, label: 'Chat' },
];

const accentColors = [
  { name: 'calendar', color: '#87baf5', label: 'Blue' },
  { name: 'clipboard', color: '#8ac3a3', label: 'Green' },
  { name: 'flowswitch', color: '#aa87f5', label: 'Purple' },
  { name: 'cake', color: '#f674ad', label: 'Pink' },
  { name: 'camera', color: '#f0864a', label: 'Orange' },
  { name: 'settings', color: '#88d8b0', label: 'Mint' },
  { name: 'chat', color: '#1f1c2f', label: 'Dark' },
];

export default function EditNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('calendar');
  const [selectedAccent, setSelectedAccent] = useState('calendar');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[400px] focus:outline-none p-4 border border-gray-200 rounded-lg',
      },
    },
  });

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
        const noteData = data.note;
        setNote(noteData);
        setTitle(noteData.title);
        setSelectedIcon(noteData.icon || 'calendar');
        setSelectedAccent(noteData.accent || 'calendar');
        
        if (editor) {
          editor.commands.setContent(noteData.content);
        }
      } catch (err) {
        setError('Failed to load note');
        console.error('Error fetching note:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id && editor) {
      fetchNote();
    }
  }, [id, session, status, router, editor]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    if (!editor) {
      alert('Editor not ready');
      return;
    }

    setSaving(true);
    try {
      const content = editor.getHTML();
      
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          icon: selectedIcon,
          accent: selectedAccent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      router.push(`/note/${id}`);
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note. Please try again.');
    } finally {
      setSaving(false);
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

  if (!editor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href={`/note/${id}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft size={16} />
            Back to Note
          </Link>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <FaSave size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Edit Note</h1>
          
          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter note title..."
            />
          </div>

          {/* Icon Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={() => setSelectedIcon(option.name)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedIcon === option.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={option.label}
                  >
                    <IconComponent size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex flex-wrap gap-2">
              {accentColors.map((option) => (
                <button
                  key={option.name}
                  onClick={() => setSelectedAccent(option.name)}
                  className={`w-8 h-8 rounded-full border-4 transition-all ${
                    selectedAccent === option.name
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: option.color }}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          {/* Editor Toolbar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <div className="border border-gray-300 rounded-lg">
              <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
                {/* Text Formatting */}
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('bold') ? 'bg-gray-300' : ''
                  }`}
                  title="Bold"
                >
                  <FaBold size={14} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('italic') ? 'bg-gray-300' : ''
                  }`}
                  title="Italic"
                >
                  <FaItalic size={14} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('underline') ? 'bg-gray-300' : ''
                  }`}
                  title="Underline"
                >
                  <FaUnderline size={14} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('strike') ? 'bg-gray-300' : ''
                  }`}
                  title="Strikethrough"
                >
                  <FaStrikethrough size={14} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Text Alignment */}
                <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
                  }`}
                  title="Align Left"
                >
                  <FaAlignLeft size={14} />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
                  }`}
                  title="Align Center"
                >
                  <FaAlignCenter size={14} />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
                  }`}
                  title="Align Right"
                >
                  <FaAlignRight size={14} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Lists and Quotes */}
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('bulletList') ? 'bg-gray-300' : ''
                  }`}
                  title="Bullet List"
                >
                  <FaListUl size={14} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('orderedList') ? 'bg-gray-300' : ''
                  }`}
                  title="Numbered List"
                >
                  <FaListOl size={14} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('blockquote') ? 'bg-gray-300' : ''
                  }`}
                  title="Quote"
                >
                  <FaQuoteLeft size={14} />
                </button>
              </div>
              
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <FaSave size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
