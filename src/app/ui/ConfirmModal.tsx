// components/ConfirmModal.tsx
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" aria-hidden="true"></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-lg font-semibold mb-4">{message}</h2>
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="bg-gray-300 px-4 py-2 rounded-lg text-sm font-medium"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
