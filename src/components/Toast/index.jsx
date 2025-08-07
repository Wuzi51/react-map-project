import { useState, useEffect } from 'react';

let toastQueue = [];
let toastListener = null;

export const showToast = (message, type = 'success') => {
  const id = Date.now();
  const toast = { id, message, type };
  toastQueue.push(toast);
  
  if (toastListener) {
    toastListener([...toastQueue]);
  }
  
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    if (toastListener) {
      toastListener([...toastQueue]);
    }
  }, 3000);
};

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListener = setToasts;
    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = (id) => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    setToasts([...toastQueue]);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 
            max-w-sm cursor-pointer
            ${toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : toast.type === 'warning'
              ? 'bg-yellow-500 text-white'
              : toast.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
            }
          `}
          onClick={() => removeToast(toast.id)}
        >
          <div className="flex items-center justify-between">
            <span>{toast.message}</span>
            <button 
              className="ml-3 text-white hover:text-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;