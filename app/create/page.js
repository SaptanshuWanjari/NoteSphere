"use client";
import React, { useMemo, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useNotes } from '../contexts/NotesContext'
import dynamic from 'next/dynamic'
import Topbar from '../components/Topbar';
import { CiCalendar } from 'react-icons/ci';
import { FaRegClipboard } from 'react-icons/fa';
import { TiFlowSwitch } from 'react-icons/ti';
import { FaCakeCandles } from 'react-icons/fa6';
import { FaCamera } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { CiSaveDown2 } from 'react-icons/ci';
import { IoPlayBackOutline } from 'react-icons/io5';

import Note from '../components/Note';
import { IoCloseOutline } from 'react-icons/io5';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ListItem from '@tiptap/extension-list-item'

const iconOptions = [
  { key: 'calendar', label: 'Calendar', Icon: CiCalendar },
  { key: 'clipboard', label: 'Clipboard', Icon: FaRegClipboard },
  { key: 'flowswitch', label: 'Flow', Icon: TiFlowSwitch },
  { key: 'cake', label: 'Cake', Icon: FaCakeCandles },
  { key: 'camera', label: 'Camera', Icon: FaCamera },
  { key: 'settings', label: 'Settings', Icon: CiSettings },
  { key: 'chat', label: 'Chat', Icon: IoChatboxEllipsesOutline },
  // { key: null, label: 'No Icon', Icon: IoCloseOutline },
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

// Sample content for demonstration
const SAMPLE_CONTENT = `
  <h1>Welcome to Rich Text Editing</h1>
  <h2>Text Formatting Options</h2>
  <p>This is a regular paragraph with <strong>bold text</strong>, <em>italic text</em>.</p>
  
  <h3>Lists and Organization</h3>
  <ul>
    <li>First bullet point with <strong>bold text</strong></li>
    <li>Second bullet point with <em>italic emphasis</em></li>
  </ul>
  
  <ol>
    <li><s>Strikethrough text</s></li>
    <li><code>code snippet</code></li>
  </ol>
  
  <blockquote>
    <p>This is a blockquote for highlighting important information or quotes from sources.</p>
  </blockquote>
`;

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addNote } = useNotes();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedAccent, setSelectedAccent] = useState('calendar');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const SelectedIcon = useMemo(() => {
    const found = iconOptions.find(o => o.key === selected);
    return found ? found.Icon : null;
  }, [selected]);

  // Authentication check
  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      // User is not authenticated, redirect to login
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelected(null);
    setSelectedAccent('calendar');
    setSaveMessage('');
    editor?.commands.clearContent();
  };

  const saveNote = async () => {
    if (!title.trim() || !description.trim()) {
      setSaveMessage('Title and content are required');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: description,
          icon: selected || 'calendar',
          accent: selectedAccent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new note to the context
        addNote(data.note);
        setSaveMessage('Note saved successfully!');
        setTimeout(() => {
          router.push('/user'); // Redirect to notes list
        }, 1500);
      } else {
        setSaveMessage(data.error || 'Failed to save note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveMessage('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Tiptap editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      ListItem,
    ],
    content: description,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText().trim();
      
      // If content is empty (only whitespace or just <p></p>), restore sample content
      if (!text || html === '<p></p>' || html.trim() === '') {
        setDescription(''); // This will trigger the sample content in the Note component
      } else {
        setDescription(html);
      }
    },
  });

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render the page if user is not authenticated
  if (!session) {
    return null;
  }

  return (
    <>
      <Topbar heading={"New Note"} />

      <div className='rounded-xl bg-white p-8 grid md:grid-cols-2 gap-8'>
        <form onSubmit={(e) => e.preventDefault()} className='max-w-xl'>
          <label className='text-xl mb-2 block text-black' htmlFor="title">Title</label>
          <input
            className='new-form-input'
            type="text"
            id="title"
            name="title"
            placeholder='Enter title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className='text-xl mb-2 block text-black' htmlFor="description">Description</label>
          <div className='mb-4'>
            {/* Custom Toolbar */}
            <div className='border border-gray-300 rounded-t-md bg-gray-50 p-3 flex gap-2 flex-wrap items-center'>
              
              {/* Heading Select */}
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'paragraph') {
                    editor?.chain().focus().setParagraph().run();
                  } else {
                    const level = parseInt(value);
                    editor?.chain().focus().toggleHeading({ level }).run();
                  }
                }}
                value={
                  editor?.isActive('heading', { level: 1 }) ? '1' :
                  editor?.isActive('heading', { level: 2 }) ? '2' :
                  editor?.isActive('heading', { level: 3 }) ? '3' :
                  'paragraph'
                }
                className="px-3 py-1 rounded text-sm border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer hover:bg-gray-50"
              >
                <option value="paragraph">Paragraph</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
              </select>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Text Formatting */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                  editor?.isActive('bold') 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`px-3 py-1 rounded text-sm italic transition-colors ${
                  editor?.isActive('italic') 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleUnderline?.().run()}
                className={`px-3 py-1 rounded text-sm underline transition-colors ${
                  editor?.isActive('underline') 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Underline"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`px-3 py-1 rounded text-sm line-through transition-colors ${
                  editor?.isActive('strike') 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Strikethrough"
              >
                S
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCode().run()}
                className={`px-3 py-1 rounded text-sm font-mono bg-gray-100 transition-colors ${
                  editor?.isActive('code') 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Inline Code"
              >
                &lt;/&gt;
              </button>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* List Select */}
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'bullet') {
                    editor?.chain().focus().toggleBulletList().run();
                  } else if (value === 'numbered') {
                    editor?.chain().focus().toggleOrderedList().run();
                  } else {
                    // Remove any active list
                    if (editor?.isActive('bulletList')) {
                      editor?.chain().focus().toggleBulletList().run();
                    }
                    if (editor?.isActive('orderedList')) {
                      editor?.chain().focus().toggleOrderedList().run();
                    }
                  }
                }}
                value={
                  editor?.isActive('bulletList') ? 'bullet' :
                  editor?.isActive('orderedList') ? 'numbered' :
                  'none'
                }
                className="px-3 py-1 rounded text-sm border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">No List</option>
                <option value="bullet">• Bullet List</option>
                <option value="numbered">1. Numbered List</option>
              </select>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Block Elements */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  editor?.isActive('blockquote') 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Quote"
              >
                &ldquo; Quote
              </button>
              {/* <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                  editor?.isActive('codeBlock') 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title="Code Block"
              >
                { } Code
              </button> */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                className="px-3 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                title="Horizontal Line"
              >
                ―――
              </button>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Utility */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
                className="px-3 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Undo"
              >
                ↶ Undo
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
                className="px-3 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Redo"
              >
                ↷ Redo
              </button>

            </div>
            
            {/* Editor Content */}
            <EditorContent 
              editor={editor} 
              className="border border-t-0 border-gray-300 rounded-b-md bg-white min-h-[150px] p-3 prose prose-sm max-w-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
            />
          </div>

          <div>
            <h2 className='text-xl mb-2 block text-black'>Icon</h2>
            <div className='mt-2 flex items-center flex-wrap gap-2'>
              {iconOptions.map(({ key, Icon, label }) => (
                <button
                  type='button'
                  key={key}
                  onClick={() => setSelected(key)}
                  aria-pressed={selected === key}
                  className={`border-1 border-black rounded-md w-12 h-10 p-1 flex items-center justify-center transition duration-150 transform
                    ${selected === key ?
                      'bg-black text-[#f3f6fd] ring-3  ring-gray-500 -translate-y-0.5' :
                      'bg-transparent hover:bg-[#f3f6fd] hover:-translate-y-0.5'}`}
                  title={label}
                >
                  <Icon size={22} className='font-bold'/>
                </button>
              ))}
            </div>
          </div>

          <div className='mb-3 mt-3'>
            <h2 className='text-xl mb-2 block text-black'>Accent Color</h2>
            <div className='mt-2 flex items-center flex-wrap gap-2'>
              {accentColors.map((option) => (
                <button
                  type='button'
                  key={option.name}
                  onClick={() => setSelectedAccent(option.name)}
                  className={`w-10 h-10 rounded-full border-4 transition-all transform hover:-translate-y-0.5 ${
                    selectedAccent === option.name
                      ? 'border-gray-800 scale-110 ring-2 ring-gray-400'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: option.color }}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          {saveMessage && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              saveMessage.includes('successfully') 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {saveMessage}
            </div>
          )}

          <div className='mt-5 flex gap-3'>
            <button type='button' onClick={resetForm} disabled={isSaving} className='bg-white border hover:bg-black hover:text-white text-black px-3 py-2 rounded-md flex items-center gap-2 text-base transition duration-150 transform hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'>
              <IoPlayBackOutline size={18} />Reset
            </button>
            <button 
              type='button' 
              onClick={saveNote} 
              disabled={isSaving || !title.trim() || !description.trim()}
              className='bg-black text-white px-3 py-2 rounded-md flex items-center gap-2 text-base cursor-pointer transition duration-150 transform hover:-translate-y-0.5 active:scale-95 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <CiSaveDown2 size={18} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>

        <div>
          <Note
            title={title || 'Sample Title'}
            content={description || SAMPLE_CONTENT}
            icon={SelectedIcon ? <SelectedIcon size={20} /> : null}
            accent={selectedAccent}
            star={false}
          />
        </div>
      </div>
    </>
  )
}

export default Page
