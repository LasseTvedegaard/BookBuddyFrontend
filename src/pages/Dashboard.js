// Dashboard.js
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/common/Login/UserContext";
import HttpClient from "../services/HttpClient";
import { endpoints } from "../endpoints";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import CurrentlyReadingBook from "./currentlyReading";
import { startReading } from "../utils/logHelpers";

export default function Dashboard() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const httpClient = useMemo(
    () => new HttpClient(process.env.REACT_APP_API_URL),
    []
  );

  const [booksReadCount, setBooksReadCount] = useState(0);
  const [currentlyReadingCount, setCurrentlyReadingCount] = useState(0);
  const [booksToReadCount, setBooksToReadCount] = useState(0);
  const [readingLogs, setReadingLogs] = useState([]);
  const [toReadBooks, setToReadBooks] = useState([]);

  const fetchCounts = useCallback(async () => {
    try {
      const readBooks = await httpClient.get(`${endpoints.books}?status=read`);
      const readingBooks = await httpClient.get(`${endpoints.books}?status=reading`);
      const unreadBooks = await httpClient.get(`${endpoints.books}?status=unread`);

      setBooksReadCount(readBooks.length);
      setCurrentlyReadingCount(readingBooks.length);
      setBooksToReadCount(unreadBooks.length);
    } catch (error) {
      console.error("Error fetching book counts:", error);
    }
  }, [httpClient]);

  const fetchToReadBooks = useCallback(async () => {
    try {
      const books = await httpClient.get(`${endpoints.books}?status=unread`);
      setToReadBooks(books);
    } catch (error) {
      console.error("Error fetching unread books:", error);
    }
  }, [httpClient]);

  const fetchLogs = useCallback(async () => {
    if (!currentUser) return;

    try {
      const res = await httpClient.get(
        `${endpoints.logs}/user/${currentUser.userId}/latest?listType=reading`
      );

      const filteredLogs = res.filter(
        (log) => log.book?.status === "reading"
      );

      setReadingLogs(filteredLogs);
    } catch (error) {
      console.error("Failed to fetch reading logs", error);
    }
  }, [httpClient, currentUser]);

  useEffect(() => {
    fetchCounts();
    fetchToReadBooks();
  }, [fetchCounts, fetchToReadBooks]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const goToFilteredBooks = (status) => {
    navigate(`/books?status=${status}`);
  };

  const markAsRead = async (logId) => {
    const logToUpdate = readingLogs.find((log) => log.logId === logId);
    if (!logToUpdate) return;

    try {
      await httpClient.post(`${endpoints.logs}`, {
        bookId: logToUpdate.book.bookId,
        userId: logToUpdate.user.userId,
        currentPage: logToUpdate.currentPage,
        noOfPages: logToUpdate.noOfPages,
        listType: "read",
      });

      await httpClient.patch(
        `${endpoints.books}/status/${logToUpdate.book.bookId}`,
        `"read"`,
        { headers: { "Content-Type": "application/json" } }
      );

      await fetchLogs();
      await fetchCounts();
      toast.success("Book marked as read!");
    } catch (error) {
      console.error("Error updating log or book status:", error);
      toast.error("Fejl ved status-opdatering.");
    }
  };

  const updatePageProgress = (logId, newPage) => {
    setReadingLogs((prev) =>
      prev.map((log) =>
        log.logId === logId ? { ...log, currentPage: newPage } : log
      )
    );
  };

  const handleStartReading = async (book) => {
    await startReading(book, currentUser);
    await fetchLogs();
    await fetchCounts();
    await fetchToReadBooks();
  };

  return (
    <div className="p-6 text-ff_text_light">
      <h1 className="text-3xl font-semibold mb-6">
        Velkommen, {currentUser?.firstName || currentUser?.userId} 👋
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div onClick={() => goToFilteredBooks("read")} className="cursor-pointer bg-yellow-400 text-black rounded-lg p-4 text-center">
          <h3>Books read</h3>
          <p className="text-4xl">{booksReadCount}</p>
        </div>
        <div onClick={() => goToFilteredBooks("reading")} className="cursor-pointer bg-gray-700 text-white rounded-lg p-4 text-center">
          <h3>Currently reading</h3>
          <p className="text-4xl">{currentlyReadingCount}</p>
        </div>
        <div onClick={() => goToFilteredBooks("unread")} className="cursor-pointer bg-blue-700 text-white rounded-lg p-4 text-center">
          <h3>Books to read</h3>
          <p className="text-4xl">{booksToReadCount}</p>
        </div>
      </div>

      {/* Reading graph */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={readingLogs.map((l, i) => ({ index: i + 1, pages: l.currentPage }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="pages" stroke="#e6d064" />
        </LineChart>
      </ResponsiveContainer>

      {/* Books to start */}
      <div className="flex gap-4 overflow-x-auto my-6">
        {toReadBooks.map((book) => (
          <div key={book.bookId} className="min-w-[200px] bg-gray-700 p-4 rounded">
            <p className="font-bold">{book.title}</p>
            <button
              onClick={() => handleStartReading(book)}
              className="mt-2 bg-blue-500 px-3 py-1 rounded"
            >
              Start
            </button>
          </div>
        ))}
      </div>

      {/* Reading logs */}
      {readingLogs.map((log) => (
        <CurrentlyReadingBook
          key={log.logId}
          log={log}
          onUpdateProgress={updatePageProgress}
          onStatusChange={() => markAsRead(log.logId)}
        />
      ))}
    </div>
  );
}
