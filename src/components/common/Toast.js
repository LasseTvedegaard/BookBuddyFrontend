import { toast } from 'react-toastify';

export const updateToast = (id, message, type) => {
    toast.update(id, {
        render: message,
        type: type,
        isLoading: false,
        autoClose: 5000,
    });
};

export const showLoadingToast = (message) => {
    return toast.loading(message);
};

export const showErrorToast = (message) => {
    toast.error(message, {
        isLoading: false,
        autoClose: 5000,
    });
};

export const showSuccessToast = (message) => {
    toast.success(message, {
        isLoading: false,
        autoClose: 5000,
    });
};

export const hideToast = (id) => {
    toast.dismiss(id);
};
