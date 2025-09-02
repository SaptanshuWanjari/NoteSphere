"use client";
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaBold, FaItalic, FaUnderline, FaStrikethrough, FaListUl, FaListOl, FaQuoteLeft } from 'react-icons/fa';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useNotes } from '../contexts/NotesContext';
import { useModal } from '../contexts/ModalContext';
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

const EditNoteModal = ({ note, isOpen, onClose }) => {
  const { saveNote } = useNotes();
  const { closeEditModal } = useModal();
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('calendar');
  const [selectedAccent, setSelectedAccent] = useState('calendar');
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[300px] focus:outline-none p-4 border border-gray-200 rounded-lg',
      },
    },
  });

  useEffect(() => {
    if (note && isOpen) {
      setTitle(note.title || '');
      setSelectedIcon(note.icon || 'calendar');
      setSelectedAccent(note.accent || 'calendar');
      
      if (editor) {
        editor.commands.setContent(note.content || '');
      }
    }
  }, [note, isOpen, editor]);

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
      
      const success = await saveNote(note._id, {
        title: title.trim(),
        content,
        icon: selectedIcon,
        accent: selectedAccent,
      });

      if (success) {
        closeEditModal();
      } else {
        throw new Error('Failed to save note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !note) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Edit Note</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <FaSave size={14} />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
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

          {/* Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            {editor && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;
