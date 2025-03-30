import axios from 'axios';
import { toast } from 'react-toastify';
import { endpoints } from '../endpoints';

const getAuthHeaders = () => {
  const token = localStorage.getItem("bookbuddy_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const startReading = async (book, currentUser) => {
  if (!currentUser?.userId) {
    toast.error("Du skal være logget ind for at starte en bog.");
    return;
  }

  try {
    await axios.put(`${endpoints.books}/${book.bookId}`, {
      ...book,
      status: "reading",
    }, {
      headers: getAuthHeaders(),
    });

    await axios.post(`${endpoints.logs}`, {
      bookId: book.bookId,
      userId: currentUser.userId,
      currentPage: 1,
      noOfPages: book.noOfPages,
      listType: "reading",
    }, {
      headers: getAuthHeaders(),
    });

    toast.success("Bogen er nu i 'Currently Reading' 📖");
  } catch (error) {
    console.error("❌ Start reading error:", error.response?.data || error.message);
    toast.error("Noget gik galt 😥");
  }
};

export const updateOrCreateLog = async ({
  book,
  currentUser,
  currentPage,
  existingLog,
  listType = 'reading'
}) => {
  if (!currentUser) {
    toast.error('You must be logged in to update progress.');
    return null;
  }

  const numericPage = Number(currentPage);
  if (isNaN(numericPage) || numericPage < 0 || numericPage > book.noOfPages) {
    toast.error(`Please enter a number between 0 and ${book.noOfPages}`);
    return null;
  }

  try {
    const headers = getAuthHeaders();

    if (existingLog) {
      const updatedLogPayload = {
        logId: existingLog.logId,
        bookId: book.bookId,
        userId: currentUser.userId,
        currentPage: numericPage,
        noOfPages: book.noOfPages,
        listType,
      };

      await axios.put(`${endpoints.logs}/${existingLog.logId}`, updatedLogPayload, { headers });
      toast.success("Progress updated!");
      return updatedLogPayload;
    } else {
      const res = await axios.post(endpoints.logs, {
        bookId: book.bookId,
        userId: currentUser.userId,
        currentPage: numericPage,
        noOfPages: book.noOfPages,
        listType
      }, { headers });

      toast.success("Progress created!");
      return res.data;
    }
  } catch (error) {
    console.error("❌ Failed to update/create log:", error.response?.data || error.message);
    toast.error(`Error: ${error.response?.data?.title || 'Failed to save progress'}`);
    return null;
  }
};
