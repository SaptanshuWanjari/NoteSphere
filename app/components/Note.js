"use client";
import React, { useState, useRef, useEffect } from 'react'
import { useModal } from '../contexts/ModalContext'
import { useNotes } from '../contexts/NotesContext'
import { HiDotsHorizontal } from 'react-icons/hi'
import { FaCalendar, FaEye, FaEdit, FaTrash, FaArchive, FaBoxOpen } from 'react-icons/fa'
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

const Note = ({ 
    note, // The entire note object
    title, 
    content, 
    icon = null, 
    accent = null, 
    star = true, 
    isFavorite = false, 
    createdAt = null,
    onFavoriteToggle = null, // Custom favorite toggle handler
    onArchiveToggle = null // Custom archive toggle handler
}) => {
    const { openViewModal, openEditModal, openConfirmationModal } = useModal();
    const { toggleFavorite, deleteNote, archiveNote, unarchiveNote } = useNotes();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const defaultAccentClasses = 'border-b-4 border-[#87baf5] hover:bg-[#87baf5] hover:text-white';
    const accentClasses = accent ? (accentMap[accent] ?? defaultAccentClasses) : defaultAccentClasses;
    
    // Use note's favorite state if note object exists, otherwise use internal state
    const [internalFav, setInternalFav] = useState(false);
    const favState = note ? note.isFavorite : (isFavorite !== undefined ? isFavorite : internalFav);
    
    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Prevent event bubbling to the main div
        if (note && note._id) {
            // Use custom handler if provided, otherwise use context function
            if (onFavoriteToggle) {
                onFavoriteToggle(note._id);
            } else {
                toggleFavorite(note._id);
            }
        } else {
            setInternalFav(v => !v);
        }
    };

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleMenuAction = (action, e) => {
        e.stopPropagation();
        setShowDropdown(false);
        
        if (!note) return;
        
        switch (action) {
            case 'view':
                openViewModal(note);
                break;
            case 'edit':
                openEditModal(note);
                break;
            case 'archive':
                if (note.isArchived) {
                    // Unarchive note
                    if (onArchiveToggle) {
                        onArchiveToggle(note._id, false);
                    } else {
                        unarchiveNote(note._id);
                    }
                } else {
                    // Archive note
                    if (onArchiveToggle) {
                        onArchiveToggle(note._id, true);
                    } else {
                        archiveNote(note._id);
                    }
                }
                break;
            case 'delete':
                openConfirmationModal({
                    title: "Delete Note",
                    message: `Are you sure you want to delete "${note.title}"? This action will move it to the bin.`,
                    confirmText: "Delete",
                    cancelText: "Cancel",
                    type: "danger",
                    onConfirm: async () => {
                        await deleteNote(note._id);
                        // Note: popup is shown by the context with detailed info
                    }
                });
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

    // Format date properly
    const displayDate = createdAt 
        ? new Date(createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
        : new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });

    return (
        <div className={`group rounded-xl min-h-[500px] max-h-[700px] p-6 bg-[#f9f9f9] mb-4 relative transition-all duration-300 ease-in-out ${accentClasses} ${note?.isArchived ? 'opacity-75 border-2 border-dashed border-gray-400' : ''}`}>
            {note?.isArchived && (
                <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <FaArchive size={10} />
                    Archived
                </div>
            )}
            <header className='flex justify-between mb-6'>
                <div className='p-2 border-2 rounded-md w-10 h-10 flex items-center justify-center transition-colors duration-300 ease-in-out'>
                    {icon || <FaCalendar size={20}  />}
                </div>
                <div className='flex items-center gap-5'>
                    {star && <button
                      type='button'
                      aria-pressed={favState}
                      onClick={handleFavoriteClick}
                      className='cursor-pointer'
                      title={favState ? 'Unfavorite' : 'Favorite'}
                    >
                      {favState ? <FaStar size={20} className='text-yellow-400 transition-colors duration-300 ease-in-out' /> : <FaRegStar size={20} className='text-black group-hover:text-white transition-colors duration-300 ease-in-out' />}
                    </button>}
                    
                    <div className="relative" ref={dropdownRef}>
                        <HiDotsHorizontal 
                            size={20} 
                            className='cursor-pointer text-black group-hover:text-white transition-colors duration-300 ease-in-out' 
                            onClick={handleMenuClick}
                        />
                        
                        {showDropdown && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-32 z-10">
                                <button
                                    onClick={(e) => handleMenuAction('view', e)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <FaEye size={12} />
                                    View
                                </button>
                                <button
                                    onClick={(e) => handleMenuAction('edit', e)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <FaEdit size={12} />
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => handleMenuAction('archive', e)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    {note?.isArchived ? <FaBoxOpen size={12} /> : <FaArchive size={12} />}
                                    {note?.isArchived ? 'Unarchive' : 'Archive'}
                                </button>
                                <button
                                    onClick={(e) => handleMenuAction('delete', e)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <FaTrash size={12} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className='flex-1 pb-16 overflow-y-auto'>
                <h1 className='text-3xl font-bold text-black group-hover:text-white transition-colors duration-300 ease-in-out leading-tight mb-4'>{title}</h1>
                <div 
                    className='note-content text-base text-gray-700 group-hover:text-white transition-colors duration-300 ease-in-out leading-relaxed'
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
            <footer className='mt-5 flex justify-end absolute bottom-5 right-10'>
                <div className='flex items-center space-x-1 text-black group-hover:text-white transition-colors duration-300 ease-in-out'>
                    <FaCalendar className='transition-colors duration-300 ease-in-out' />
                    <div className='transition-colors duration-300 ease-in-out'>{displayDate}</div>
                </div>
            </footer>
        </div>
    );
}

export default Note;
