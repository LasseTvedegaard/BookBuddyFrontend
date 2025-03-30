import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../components/common/Login/UserContext';
import { endpoints } from '../endpoints';
import { updateOrCreateLog } from '../utils/logHelpers';

function BookDetailsPage() {
  const { id } = useParams(); // bookId
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const [book, setBook] = useState(null);
  const [log, setLog] = useState(null);
  const [currentPage, setCurrentPage] = useState('');
  const [status, setStatus] = useState('');

  // Fetch book and reading log
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookRes = await axios.get(`${endpoints.books}/${id}`);
        setBook(bookRes.data);
        setStatus(bookRes.data.status);
      } catch (error) {
        toast.error('❌ Failed to fetch book details');
      }
    };

    const fetchLog = async () => {
      try {
        const logRes = await axios.get(`${endpoints.logs}/${id}?listType=reading`);
        setLog(logRes.data);
        setCurrentPage(logRes.data.currentPage?.toString() || '');
      } catch (error) {
        setLog(null);
        setCurrentPage('');
      }
    };

    if (id) {
      fetchBook();
      fetchLog();
    }
  }, [id]);

  // Save progress (new or updated log)
  const updatePage = async () => {
    const updatedLog = await updateOrCreateLog({
      book,
      currentUser,
      currentPage,
      existingLog: log,
      listType: 'reading'
    });

    if (updatedLog) setLog(updatedLog);
  };

  // Update status of the book (e.g. to 'read')
  const updateStatus = async () => {
    try {
      await axios.put(`${endpoints.books}/${book.bookId}`, {
        ...book,
        status
      });
      toast.success('✅ Status updated!');
      navigate(`/books?status=${status}`);
    } catch (error) {
      toast.error('❌ Failed to update status');
    }
  };

  if (!book) return <p className="p-4">Loading book details...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow rounded">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to book list
      </button>

      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        {book.title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-1">Author: {book.author}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">Total Pages: {book.noOfPages}</p>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
          Current Page:
        </label>
        <input
          type="number"
          min={0}
          max={book.noOfPages}
          value={currentPage}
          onChange={(e) =>
            setCurrentPage(e.target.value.replace(/^0+(?!$)/, ''))
          }
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <button
          onClick={updatePage}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Save Page Progress
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
          Status:
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
        >
          <option value="unread">Unread</option>
          <option value="reading">Reading</option>
          <option value="read">Read</option>
        </select>
        <button
          onClick={updateStatus}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Status
        </button>
      </div>
    </div>
  );
}

export default BookDetailsPage;
