// Toast.js
import { toast } from "react-toastify";
import { toastStyle } from "./toastStyles";

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

// 💥 NYT: Håndter API-kald med loading, success, error
export const handleApiRequest = async ({
  apiCall,
  loadingMessage = "Behandler...",
  successMessage = "Færdig!",
  errorMessage = "Noget gik galt",
  on401 = null, // valgfri callback ved 401
}) => {
  const toastId = showLoadingToast(loadingMessage);

  try {
    const response = await apiCall();
    updateToast(toastId, successMessage, "success");
    return response;
  } catch (error) {
    const status = error.response?.status;

    if (status === 401 && typeof on401 === "function") {
      updateToast(toastId, "Login kræves. Du er blevet logget ud.", "error");
      on401(); // fx logout + redirect
    } else {
      updateToast(toastId, errorMessage, "error");
    }

    throw error; // hvis du vil håndtere det videre i komponenten
  }
};
