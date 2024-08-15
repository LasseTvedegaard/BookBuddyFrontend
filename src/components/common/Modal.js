import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white dark:bg-ff_background_dark p-4 rounded-md flex justify-center items-center">
        <button
          className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full p-2 focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
