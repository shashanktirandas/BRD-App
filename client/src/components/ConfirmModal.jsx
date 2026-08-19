// components/ConfirmModal.jsx

import { useEffect, useRef } from "react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  setOpen
}) => {

  const menuRef = useRef(null);
  
      useEffect(() => {
        function handleClickOutside(event) {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpen(false);
          }
        }
  
        document.addEventListener("mousedown", handleClickOutside);
  
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed top-0 left-0 inset-0 bg-black/50 flex items-center justify-center z-50"
        
        >

      <div 
      className="bg-white rounded-xl w-90 p-6 text-black"
      ref={menuRef}
      >

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <p className="mt-3 text-gray-600">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onCancel}
            className="px-5 py-2 border rounded-lg"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-500 text-white rounded-lg"
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmModal;