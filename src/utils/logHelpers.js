import { toast } from 'react-toastify';
import { endpoints } from '../endpoints';
import HttpClient from '../services/HttpClient';

const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

export const startReading = async (book, currentUser) => {
  try {
    await httpClient.put(`${endpoints.books}/${book.bookId}`, {
      ...book,
      status: "reading",
    });

    await httpClient.post(`${endpoints.logs}`, {
      bookId: book.bookId,
      userId: currentUser.userId,
      currentPage: 1,
      noOfPages: book.noOfPages,
      listType: "reading",
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
    if (existingLog) {
      const updatedLogPayload = {
        logId: existingLog.logId,
        bookId: book.bookId,
        userId: currentUser.userId,
        currentPage: numericPage,
        noOfPages: book.noOfPages,
        listType
      };

      await httpClient.put(`${endpoints.logs}/${existingLog.logId}`, updatedLogPayload);
      toast.success("Progress updated!");
      return updatedLogPayload;
    } else {
      const res = await httpClient.post(endpoints.logs, {
        bookId: book.bookId,
        userId: currentUser.userId,
        currentPage: numericPage,
        noOfPages: book.noOfPages,
        listType
      });

      toast.success("Progress created!");
      return res.data; // 👈 Dette er ændringen
    }
  } catch (error) {
    console.error("❌ Failed to update/create log:", error.response?.data || error.message);
    toast.error(`Error: ${error.response?.data?.title || 'Failed to save progress'}`);
    return null;
  }
};
