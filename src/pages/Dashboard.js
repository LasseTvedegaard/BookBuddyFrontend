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

  // -----------------------------
  // FETCH COUNTS
  // -----------------------------
  const fetchCounts = useCallback(async () => {
    try {
      const [read, reading, unread] = await Promise.all([
        httpClient.get(`${endpoints.books}?status=read`),
        httpClient.get(`${endpoints.books}?status=reading`),
        httpClient.get(`${endpoints.books}?status=unread`)
      ]);

      setBooksReadCount(read.length);
      setCurrentlyReadingCount(reading.length);
      setBooksToReadCount(unread.length);
    } catch (error) {
      console.error("Error fetching book counts:", error);
    }
  }, [httpClient]);

  // -----------------------------
  // FETCH UNREAD BOOKS
  // -----------------------------
  const fetchToReadBooks = useCallback(async () => {
    try {
      const books = await httpClient.get(`${endpoints.books}?status=unread`);
      setToReadBooks(books);
    } catch (error) {
      console.error("Error fetching unread books:", error);
    }
  }, [httpClient]);

  // -----------------------------
  // FETCH READING LOGS (JWT /me)
  // -----------------------------
  const fetchLogs = useCallback(async () => {
    if (!currentUser) return;

    try {
      const logs = await httpClient.get(
        `${endpoints.logs}/me/latest?listType=reading`
      );

      setReadingLogs(logs);
    } catch (error) {
      console.error("Failed to fetch reading logs", error);
    }
  }, [httpClient, currentUser]);

  // -----------------------------
  // EFFECTS
  // -----------------------------
  useEffect(() => {
    fetchCounts();
    fetchToReadBooks();
  }, [fetchCounts, fetchToReadBooks]);

  useEffect(() => {
    if (currentUser) fetchLogs();
  }, [currentUser, fetchLogs]);

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  const goToFilteredBooks = (status) => {
    navigate(`/books?status=${status}`);
  };

  // -----------------------------
  // MARK BOOK AS READ
  // -----------------------------
  const markAsRead = async (logId) => {
    const log = readingLogs.find((l) => l.logId === logId);
    if (!log) return;

    try {
      // ➕ nyt log-entry: read (JWT /me)
      await httpClient.post(`${endpoints.logs}`, {
        bookId: log.book.bookId,
        currentPage: log.noOfPages,
        noOfPages: log.noOfPages,
        listType: "read",
      });

      // 🔁 opdater bog-status
      await httpClient.patch(
        `${endpoints.books}/status/${log.book.bookId}`,
        `"read"`,
        { headers: { "Content-Type": "application/json" } }
      );

      await Promise.all([fetchLogs(), fetchCounts()]);
      toast.success("Book marked as read!");
    } catch (error) {
      console.error("Error marking book as read:", error);
      toast.error("Fejl ved status-opdatering.");
    }
  };

  // -----------------------------
  // UPDATE PAGE PROGRESS (UI only)
  // -----------------------------
  const updatePageProgress = (logId, newPage) => {
    setReadingLogs((prev) =>
      prev.map((log) =>
        log.logId === logId ? { ...log, currentPage: newPage } : log
      )
    );
  };

  // -----------------------------
  // START READING
  // -----------------------------
  const handleStartReading = async (book) => {
    try {
      await startReading(book); // bruger JWT /me
      await Promise.all([
        fetchLogs(),
        fetchCounts(),
        fetchToReadBooks()
      ]);
    } catch (error) {
      console.error("Error starting reading:", error);
      toast.error("Kunne ikke starte læsning.");
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="p-6 text-ff_text_light">
      <h1 className="text-3xl font-semibold mb-6">
        Velkommen, {currentUser?.firstName || "læser"} 👋
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div
          onClick={() => goToFilteredBooks("read")}
          className="cursor-pointer bg-yellow-400 text-black rounded-lg p-4 text-center"
        >
          <h3>Books read</h3>
          <p className="text-4xl">{booksReadCount}</p>
        </div>

        <div
          onClick={() => goToFilteredBooks("reading")}
          className="cursor-pointer bg-gray-700 text-white rounded-lg p-4 text-center"
        >
          <h3>Currently reading</h3>
          <p className="text-4xl">{currentlyReadingCount}</p>
        </div>

        <div
          onClick={() => goToFilteredBooks("unread")}
          className="cursor-pointer bg-blue-700 text-white rounded-lg p-4 text-center"
        >
          <h3>Books to read</h3>
          <p className="text-4xl">{booksToReadCount}</p>
        </div>
      </div>

      {/* READING GRAPH */}
      {readingLogs.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={readingLogs.map((l, i) => ({
              index: i + 1,
              pages: l.currentPage,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pages" stroke="#e6d064" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* BOOKS TO START */}
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

      {/* CURRENTLY READING */}
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
