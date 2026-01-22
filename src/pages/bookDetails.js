import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../components/common/Login/UserContext';
import { endpoints } from '../endpoints';
import { updateOrCreateLog } from '../utils/logHelpers';
import HttpClient from "../services/HttpClient";

const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

function BookDetailsPage() {
  const { id } = useParams(); // bookId fra URL
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const [book, setBook] = useState(null);
  const [log, setLog] = useState(null);
  const [currentPage, setCurrentPage] = useState('');
  const [status, setStatus] = useState('');

  // -----------------------------
  // FETCH BOOK + LOG (AUTH)
  // -----------------------------
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookRes = await httpClient.get(`${endpoints.books}/${id}`);
        setBook(bookRes);
        setStatus(bookRes.status);
      } catch (error) {
        console.error(error);
        toast.error('❌ Failed to fetch book details');
      }
    };

    const fetchLog = async () => {
      try {
        const logRes = await httpClient.get(
          `${endpoints.logs}/${id}?listType=reading`
        );

        setLog(logRes);
        setCurrentPage(logRes.currentPage?.toString() || '');
      } catch (error) {
        console.warn("No existing log found for this book");
        setLog(null);
        setCurrentPage('');
      }
    };

    if (id) {
      fetchBook();
      fetchLog();
    }
  }, [id]);

  // -----------------------------
  // SAVE / UPDATE PAGE PROGRESS
  // -----------------------------
  const updatePage = async () => {
    if (!currentUser) {
      toast.error("You must be logged in");
      return;
    }

    if (!currentPage) {
      toast.error("Please enter a page number");
      return;
    }

    const updatedLog = await updateOrCreateLog({
      book,
      currentUser,
      currentPage,
      existingLog: log,
      listType: 'reading'
    });

    if (updatedLog) {
      // 🔑 Hold UI 100% i sync med DB
      setLog(updatedLog);
      setCurrentPage(updatedLog.currentPage.toString());

      toast.success("✅ Page progress saved");
    }
  };

  // -----------------------------
  // UPDATE BOOK STATUS
  // -----------------------------
  const updateStatus = async () => {
    try {
      await httpClient.put(`${endpoints.books}/${book.bookId}/status`, {
        status
      });

      toast.success('✅ Status updated!');
      navigate(`/books?status=${status}`);
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to update status');
    }
  };

  if (!book) return <p className="p-4">Loading book details...</p>;

  // -----------------------------
  // RENDER
  // -----------------------------
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

      <p className="text-gray-700 dark:text-gray-300 mb-1">
        Author: {book.author}
      </p>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Total Pages: {book.noOfPages}
      </p>

      {/* -----------------------------
          CURRENT PAGE SECTION
      ----------------------------- */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
          Current Page:
        </label>

        {/* 🔎 VIS SIDST GEMTE SIDE TYDELIGT */}
        {log && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Last saved page: <strong>{log.currentPage}</strong>
          </p>
        )}

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
          disabled={!currentPage}
          className={`px-4 py-2 rounded text-white ${
            currentPage
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Save Page Progress
        </button>
      </div>

      {/* -----------------------------
          STATUS SECTION
      ----------------------------- */}
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
