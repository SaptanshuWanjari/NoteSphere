"use client";
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Popup = ({ message, type = 'info', isVisible, onClose, duration = 3000 }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isVisible && duration > 0) {
      // Start exit animation before hiding
      const timer = setTimeout(() => {
        setIsAnimatingOut(true);
      }, duration - 300);

      // Hide popup after animation
      const hideTimer = setTimeout(() => {
        setIsAnimatingOut(false);
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getPopupStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-white" />;
      case 'error':
        return <FaTimes className="text-white" />;
      case 'warning':
        return <FaExclamationTriangle className="text-white" />;
      case 'info':
      default:
        return <FaInfoCircle className="text-white" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-out ${
      isAnimatingOut ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
    }`}>
      <div className={`${getPopupStyles()} px-6 py-4 rounded-lg shadow-lg max-w-sm`}>
        <div className="flex items-center gap-3">
          {getIcon()}
          <span className="font-medium text-sm">{message}</span>
          <button
            onClick={() => {
              setIsAnimatingOut(true);
              setTimeout(onClose, 300);
            }}
            className="ml-2 text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
