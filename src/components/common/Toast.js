import { toast } from 'react-toastify';

const toastStyle = {
  background: '#ffc107', // Change to your desired color
  color: '#000', // Text color for better readability
  fontSize: '16px', // Adjust font size
  padding: '10px', // Adjust padding
  maxWidth: '300px', // Max width for the toast box
};

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
