import axios from 'axios';
import { toast } from 'react-toastify';
import { endpoints } from '../endpoints';

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
  
        await axios.put(`${endpoints.logs}/${existingLog.logId}`, updatedLogPayload);
        toast.success("Progress updated!");
        return updatedLogPayload;
      } else {
        const res = await axios.post(endpoints.logs, {
          bookId: book.bookId,
          userId: currentUser.userId,
          currentPage: numericPage,
          noOfPages: book.noOfPages,
          listType
        });
        toast.success("Progress created!");
        return res.data;
      }
    } catch (error) {
      console.error("❌ Failed to update/create log:", error.response?.data || error.message);
      toast.error(`Error: ${error.response?.data?.title || 'Failed to save progress'}`);
      return null;
    }
  };
  