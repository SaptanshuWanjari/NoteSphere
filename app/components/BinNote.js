"use client";
import React, { useState, useRef, useEffect } from 'react'
import { useModal } from '../contexts/ModalContext'
import { useNotes } from '../contexts/NotesContext'
import { HiDotsHorizontal } from 'react-icons/hi'
import { FaCalendar, FaTrashRestore, FaTrash } from 'react-icons/fa'
import { FaStar, FaRegStar } from 'react-icons/fa'

const accentMap = {
    calendar: 'border-b-4 border-[#87baf5] hover:bg-[#87baf5] hover:text-white',
    clipboard: 'border-b-4 border-[#8ac3a3] hover:bg-[#8ac3a3] hover:text-white',
    flowswitch: 'border-b-4 border-[#aa87f5] hover:bg-[#aa87f5] hover:text-white',
    cake: 'border-b-4 border-[#f674ad] hover:bg-[#f674ad] hover:text-white',
    camera: 'border-b-4 border-[#f0864a] hover:bg-[#f0864a] hover:text-white',
    settings: 'border-b-4 border-[#88d8b0] hover:bg-[#88d8b0] hover:text-white',
    chat: 'border-b-4 border-[#1f1c2f] hover:bg-[#1f1c2f] hover:text-white',
};

const BinNote = ({ 
    note, // The entire note object
    title, 
    content, 
    icon = null, 
    accent = null, 
    createdAt = null,
    deletedAt = null,
    onRestore = null,
    onPermanentDelete = null
}) => {
    const { openConfirmationModal } = useModal();
    const { restoreNote, permanentlyDeleteNote } = useNotes();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const defaultAccentClasses = 'border-b-4 border-[#87baf5] hover:bg-[#87baf5] hover:text-white';
    const accentClasses = accent ? (accentMap[accent] ?? defaultAccentClasses) : defaultAccentClasses;
    
    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleMenuAction = (action, e) => {
        e.stopPropagation();
        setShowDropdown(false);
        
        if (!note) return;
        
        switch (action) {
            case 'restore':
                if (onRestore) {
                    onRestore(note._id);
                } else {
                    openConfirmationModal({
                        title: "Restore Note",
                        message: `Are you sure you want to restore "${note.title}"? This will move it back to your notes.`,
                        confirmText: "Restore",
                        cancelText: "Cancel",
                        type: "success",
                        onConfirm: async () => {
                            await restoreNote(note._id);
                            // Note: popup is shown by the context with detailed info
                        }
                    });
                }
                break;
            case 'permanentDelete':
                if (onPermanentDelete) {
                    onPermanentDelete(note._id);
                } else {
                    openConfirmationModal({
                        title: "Permanently Delete Note",
                        message: `Are you sure you want to permanently delete "${note.title}"? This action cannot be undone.`,
                        confirmText: "Delete Forever",
                        cancelText: "Cancel",
                        type: "danger",
                        onConfirm: async () => {
                            await permanentlyDeleteNote(note._id);
                            // Note: popup is shown by the context if needed
                        }
                    });
                }
                break;
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format dates properly
    const displayCreatedDate = createdAt 
        ? new Date(createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
        : '';

    const displayDeletedDate = deletedAt 
        ? new Date(deletedAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
        : '';

    return (
        <div className={`group rounded-xl min-h-[400px] sm:min-h-[500px] max-h-[600px] sm:max-h-[700px] p-4 sm:p-6 bg-[#f9f9f9] mb-4 relative transition-all duration-300 ease-in-out ${accentClasses} opacity-75`}>
            <header className='flex justify-between mb-4 sm:mb-6'>
                <div className='p-2 border-2 rounded-md w-10 h-10 flex items-center justify-center transition-colors duration-300 ease-in-out'>
                    {icon || <FaCalendar size={20} />}
                </div>
                <div className='flex items-center gap-3 sm:gap-5'>
                    {/* Show star but disabled for deleted notes */}
                    <FaRegStar size={18} className='text-gray-400' title='Cannot favorite deleted notes' />
                    
                    <div className="relative" ref={dropdownRef}>
                        <HiDotsHorizontal 
                            size={20} 
                            className='cursor-pointer text-black group-hover:text-white transition-colors duration-300 ease-in-out' 
                            onClick={handleMenuClick}
                        />
                        
                        {showDropdown && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 z-10">
                                <button
                                    onClick={(e) => handleMenuAction('restore', e)}
                                    className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                                >
                                    <FaTrashRestore size={12} />
                                    Restore
                                </button>
                                <button
                                    onClick={(e) => handleMenuAction('permanentDelete', e)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <FaTrash size={12} />
                                    Delete Forever
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className='flex-1 pb-16 overflow-y-auto'>
                <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-black group-hover:text-white transition-colors duration-300 ease-in-out leading-tight mb-3 sm:mb-4'>{title}</h1>
                <div 
                    className='note-content text-sm sm:text-base text-gray-700 group-hover:text-white transition-colors duration-300 ease-in-out leading-relaxed'
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
            <footer className='mt-5 flex flex-col gap-2 absolute bottom-3 sm:bottom-5 right-4 sm:right-10'>
                <div className='flex items-center space-x-1 text-black group-hover:text-white transition-colors duration-300 ease-in-out text-xs sm:text-sm'>
                    <FaCalendar className='transition-colors duration-300 ease-in-out' />
                    <div className='transition-colors duration-300 ease-in-out'>Created: {displayCreatedDate}</div>
                </div>
                {displayDeletedDate && (
                    <div className='flex items-center space-x-1 text-red-600 group-hover:text-white transition-colors duration-300 ease-in-out text-xs sm:text-sm'>
                        <FaTrash className='transition-colors duration-300 ease-in-out' />
                        <div className='transition-colors duration-300 ease-in-out'>Deleted: {displayDeletedDate}</div>
                    </div>
                )}
            </footer>
        </div>
    );
}

export default BinNote;
