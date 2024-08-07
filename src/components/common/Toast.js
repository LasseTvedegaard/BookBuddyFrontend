// src/common/Toast.js
import { toast } from 'react-toastify';
import { toastStyle } from './toastStyles';

export const updateToast = (id, message, type) => {
  toast.update(id, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 5000,
    style: toastStyle,
  });
};

export const showLoadingToast = (message) => {
  return toast.loading(message, {
    style: toastStyle,
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    isLoading: false,
    autoClose: 5000,
    style: toastStyle,
  });
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    isLoading: false,
    autoClose: 5000,
    style: toastStyle,
  });
};

export const hideToast = (id) => {
  toast.dismiss(id);
};
