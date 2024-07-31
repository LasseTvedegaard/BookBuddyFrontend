import { toast} from 'react-toastify';

export const updateToast = (id, message, type) => {
    toast.update(id, {
        render: message,
        type: type,
        isLoading: false,
        autoclose: 5000
    });
};

export const showLoadingToast = (message) => {
    return toast.loading(message);
};

export const showErrorToast = (message) => {
    toast.error(message, {
        isLoading: false,
        autoclose: 5000
    });
};

export const showSuccesToast = (message) => {
    toast.success(message, {
        isLoading: false,
        autoclose: 5000
    });
};