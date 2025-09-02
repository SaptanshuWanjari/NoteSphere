"use client";
import React from 'react';
import { useModal } from '../contexts/ModalContext';
import { useNotes } from '../contexts/NotesContext';
import { FaTimes, FaStar, FaRegStar, FaCalendar, FaTrash, FaEdit } from 'react-icons/fa';
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

const ViewNoteModal = ({ note, isOpen, onClose }) => {
  const { openEditModal, openConfirmationModal } = useModal();
  const { toggleFavorite, deleteNote } = useNotes();
  
  if (!isOpen || !note) return null;

  const IconComponent = iconMap[note.icon] || iconMap.calendar;
  const accentColor = accentMap[note.accent] || accentMap.calendar;
  
  const displayDate = new Date(note.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className={`${accentColor} p-6 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
          
          <div className="flex items-center gap-4 mb-4 pr-12">
            <div className="p-3 border-2 bg-opacity-20 rounded-lg">
              <IconComponent size={24} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{note.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(note)}
                className="group flex items-center gap-2 px-3 py-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg border border-white border-opacity-30 hover:border-opacity-50 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                title="Edit note"
              >
                <FaEdit className="group-hover:text-blue-200 transition-colors duration-200" size={16} />
                <span className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Edit</span>
              </button>
              
              <button
                onClick={() => toggleFavorite(note._id)}
                className="group flex items-center gap-2 px-3 py-2 bg-yellow-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg border border-white border-opacity-30 hover:border-opacity-50 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {note.isFavorite ? (
                  <>
                    <FaStar className="text-yellow-300 group-hover:text-yellow-200 transition-colors duration-200" size={16} />
                    <span className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Favorited</span>
                  </>
                ) : (
                  <>
                    <FaRegStar className="group-hover:text-yellow-200 transition-colors duration-200" size={16} />
                    <span className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Favorite</span>
                  </>
                )}
              </button>

              <button
                onClick={() => openConfirmationModal({
                  title: "Delete Note",
                  message: `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
                  confirmText: "Delete",
                  cancelText: "Cancel",
                  type: "danger",
                  onConfirm: () => deleteNote(note._id)
                })}
                className="group flex items-center gap-2 px-3 py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg border border-red-300 border-opacity-50 hover:border-opacity-70 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                title="Delete note"
              >
                <FaTrash className="text-red-200 group-hover:text-red-100 transition-colors duration-200" size={16} />
                <span className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">Delete</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white text-opacity-90">
            <FaCalendar size={14} />
            <span className="text-sm">{displayDate}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <div 
            className="note-content text-gray-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewNoteModal;
