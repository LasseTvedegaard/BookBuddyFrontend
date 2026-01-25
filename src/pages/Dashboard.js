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

  // 🔑 NY: Kun 3 foreslåede bøger
  const [suggestedBooks, setSuggestedBooks] = useState([]);

  // -----------------------------
  // FETCH COUNTS
  // -----------------------------
  const fetchCounts = useCallback(async () => {
    try {
      const [read, reading, unread] = await Promise.all([
        httpClient.get(`${endpoints.books}?status=read`),
        httpClient.get(`${endpoints.books}?status=reading`),
        httpClient.get(`${endpoints.books}?status=unread`),
      ]);

      setBooksReadCount(read.length);
      setCurrentlyReadingCount(reading.length);
      setBooksToReadCount(unread.length);
    } catch (error) {
      console.error("Error fetching book counts:", error);
    }
  }, [httpClient]);

  // -----------------------------
  // FETCH UNREAD BOOKS + VÆLG 3 TILFÆLDIGE
  // -----------------------------
  const fetchToReadBooks = useCallback(async () => {
    try {
      const books = await httpClient.get(`${endpoints.books}?status=unread`);
      setToReadBooks(books);

      // 🔑 Vælg max 3 tilfældige bøger til forslag
      if (books && books.length > 0) {
        const shuffled = [...books].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        setSuggestedBooks(selected);
      } else {
        setSuggestedBooks([]);
      }
    } catch (error) {
      console.error("Error fetching unread books:", error);
    }
  }, [httpClient]);

  // -----------------------------
  // FETCH READING LOGS
  // -----------------------------
  const fetchLogs = useCallback(async () => {
    if (!currentUser) return;

    try {
      const logs = await httpClient.get(
        `${endpoints.logs}/me/latest?listType=reading`
      );

      const validLogs = (logs || []).filter((l) => l && l.book);
      setReadingLogs(validLogs);
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
  // CONTINUE READING (LATEST LOG)
  // -----------------------------
  const latestLog = useMemo(() => {
    if (!readingLogs || readingLogs.length === 0) return null;
    const first = readingLogs[0];
    if (!first.book) return null;
    return first;
  }, [readingLogs]);

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
    if (!log || !log.book) return;

    try {
      await httpClient.post(`${endpoints.logs}`, {
        bookId: log.book.bookId,
        currentPage: log.noOfPages,
        noOfPages: log.noOfPages,
        listType: "read",
      });

      await httpClient.put(
        `${endpoints.books}/${log.book.bookId}/status`,
        { status: "read" }
      );

      await Promise.all([fetchLogs(), fetchCounts()]);
      toast.success("Book marked as read!");
    } catch (error) {
      console.error("Error marking book as read:", error);
      toast.error("Fejl ved status-opdatering.");
    }
  };

  // -----------------------------
  // UPDATE PAGE PROGRESS
  // -----------------------------
  const updatePageProgress = async (
    logId,
    newPage,
    bookId,
    noOfPages,
    listType
  ) => {
    try {
      await httpClient.put(`${endpoints.logs}/${logId}`, {
        userId: currentUser.userId,
        bookId,
        currentPage: newPage,
        noOfPages,
        listType,
      });

      setReadingLogs((prev) =>
        prev.map((log) =>
          log.logId === logId ? { ...log, currentPage: newPage } : log
        )
      );
    } catch (err) {
      console.error("Failed to update page progress", err);
      toast.error("Kunne ikke gemme side");
    }
  };

  // -----------------------------
  // START READING
  // -----------------------------
  const handleStartReading = async (book) => {
    try {
      await startReading(book);
      await Promise.all([
        fetchLogs(),
        fetchCounts(),
        fetchToReadBooks(), // 🔑 opdater også forslag efter start
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
    <div className="px-3 md:px-8 lg:px-12 py-3 md:py-6 max-w-6xl mx-auto text-ff_text_light overflow-x-hidden">

      {/* TITLE */}
      <h1 className="text-xl md:text-3xl font-semibold mb-4 md:mb-6">
        Velkommen, {currentUser?.firstName || "læser"} 👋
      </h1>

      {/* -----------------------------
          STAT CARDS
      ----------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
        <div
          onClick={() => goToFilteredBooks("read")}
          className="cursor-pointer 
                     w-full
                     bg-yellow-400 text-black rounded-lg 
                     p-3 md:p-4 
                     min-h-[60px] md:min-h-[90px]
                     text-center flex flex-col justify-center"
        >
          <h3 className="text-sm md:text-base">Books read</h3>
          <p className="text-2xl md:text-4xl">{booksReadCount}</p>
        </div>

        <div
          onClick={() => goToFilteredBooks("reading")}
          className="cursor-pointer 
                     w-full
                     bg-gray-700 text-white rounded-lg 
                     p-3 md:p-4 
                     min-h-[60px] md:min-h-[90px]
                     text-center flex flex-col justify-center"
        >
          <h3 className="text-sm md:text-base">Currently reading</h3>
          <p className="text-2xl md:text-4xl">{currentlyReadingCount}</p>
        </div>

        <div
          onClick={() => goToFilteredBooks("unread")}
          className="cursor-pointer 
                     w-full
                     bg-blue-700 text-white rounded-lg 
                     p-3 md:p-4 
                     min-h-[60px] md:min-h-[90px]
                     text-center flex flex-col justify-center
                     col-span-2 md:col-span-1"
        >
          <h3 className="text-sm md:text-base">Books to read</h3>
          <p className="text-2xl md:text-4xl">{booksToReadCount}</p>
        </div>
      </div>

      {/* -----------------------------
          CONTINUE READING
      ----------------------------- */}
      {latestLog && (
        <div className="bg-gray-800 rounded-lg 
                        p-3 md:p-5 
                        mb-6 
                        border border-gray-700 
                        w-full">
          <h2 className="text-lg md:text-xl font-semibold mb-1">
            Continue reading
          </h2>

          <p className="text-base md:text-lg font-bold">
            {latestLog.book.title}
          </p>

          <p className="text-sm text-gray-400 mb-2">
            Page {latestLog.currentPage} / {latestLog.noOfPages}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded h-2 md:h-3 mb-3">
            <div
              className="bg-yellow-400 h-2 md:h-3 rounded"
              style={{
                width: `${Math.min(
                  (latestLog.currentPage / latestLog.noOfPages) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          <button
            onClick={() =>
              navigate(`/books/${latestLog.book.bookId}`)
            }
            className="w-full md:w-auto 
                       bg-yellow-500 hover:bg-yellow-600 
                       text-black px-4 py-2 rounded font-medium"
          >
            Continue
          </button>
        </div>
      )}

      {/* -----------------------------
          READING GRAPH
      ----------------------------- */}
      {readingLogs.length > 0 && (
        <div className="mb-6 md:mb-8 w-full">
          <ResponsiveContainer width="100%" height={200} className="md:h-[300px]">
            <LineChart
              data={readingLogs.map((l) => ({
                date: l.createdAt
                  ? new Date(l.createdAt).toLocaleDateString("da-DK")
                  : "",
                pages: l.currentPage,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pages" stroke="#e6d064" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* -----------------------------
          BOOK SUGGESTIONS (MAX 3 CARDS)
      ----------------------------- */}
      {suggestedBooks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">
            Suggested books to start
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {suggestedBooks.map((book) => (
              <div
                key={book.bookId}
                className="bg-gray-800 rounded-lg 
                           border border-gray-700 
                           p-3 
                           flex flex-col 
                           hover:border-yellow-500 transition"
              >
                {/* Book image */}
                <div className="flex justify-center mb-3">
                  <img
                    src={book.imageURL || ""}
                    alt={book.title}
                    className="h-40 w-28 object-cover rounded shadow"
                  />
                </div>

                {/* Title */}
                <p className="font-semibold text-sm md:text-base text-center mb-3">
                  {book.title}
                </p>

                {/* Start button */}
                <button
                  onClick={() => handleStartReading(book)}
                  className="mt-auto 
                             w-full 
                             bg-blue-600 hover:bg-blue-700 
                             text-white 
                             px-3 py-2 
                             rounded 
                             font-medium"
                >
                  Start reading
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -----------------------------
          CURRENTLY READING LIST
      ----------------------------- */}
      <div className="space-y-3 md:space-y-4 w-full">
        {readingLogs
          .filter((log) => log && log.book)
          .map((log) => (
            <CurrentlyReadingBook
              key={log.logId}
              log={log}
              onUpdateProgress={updatePageProgress}
              onStatusChange={() => markAsRead(log.logId)}
            />
          ))}
      </div>
    </div>
  );
}
