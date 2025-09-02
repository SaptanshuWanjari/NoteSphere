"use client";
import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  // View Modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Confirmation Modal
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger'
  });

  // View modal actions
  const openViewModal = (note) => {
    setSelectedNote(note);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedNote(null);
  };

  // Edit modal actions
  const openEditModal = (note) => {
    setSelectedNote(note);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedNote(null);
  };

  // Confirmation modal actions
  const openConfirmationModal = (config) => {
    setConfirmationConfig({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      type: 'danger',
      ...config
    });
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const value = {
    // View Modal
    viewModalOpen,
    selectedNote,
    openViewModal,
    closeViewModal,

    // Edit Modal
    editModalOpen,
    openEditModal,
    closeEditModal,

    // Confirmation Modal
    confirmationModalOpen,
    confirmationConfig,
    openConfirmationModal,
    closeConfirmationModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};
