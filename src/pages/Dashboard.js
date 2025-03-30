// Dashboard.js
import React, { useEffect, useState } from "react";
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

export default function Dashboard() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

  const [booksReadCount, setBooksReadCount] = useState(0);
  const [currentlyReadingCount, setCurrentlyReadingCount] = useState(0);
  const [booksToReadCount, setBooksToReadCount] = useState(0);
  const [readingLogs, setReadingLogs] = useState([]);

  const fetchCounts = async () => {
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
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!currentUser) return;
      try {
        const res = await httpClient.get(`${endpoints.logs}/user/${currentUser.userId}/latest?listType=reading`);
        setReadingLogs(res);
      } catch (error) {
        console.error("Failed to fetch reading logs", error);
      }
    };
    fetchLogs();
  }, [currentUser]);

  const goToFilteredBooks = (status) => {
    navigate(`/books?status=${status}`);
  };

  const markAsRead = async (logId) => {
    const logToUpdate = readingLogs.find(log => log.logId === logId);
    if (!logToUpdate) return;

    try {
      await httpClient.put(`${endpoints.logs}/${logId}`, {
        logId: logToUpdate.logId,
        bookId: logToUpdate.book.bookId,
        userId: logToUpdate.user.userId,
        currentPage: logToUpdate.currentPage,
        noOfPages: logToUpdate.noOfPages,
        listType: "read"
      });

      await httpClient.patch(
        `${endpoints.books}/status/${logToUpdate.book.bookId}`,
        `"read"`,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      setReadingLogs(prevLogs => prevLogs.filter(log => log.logId !== logId));
      await fetchCounts(); // 👈 Opdater tallene efter ændring
      toast.success("Book marked as read!");
    } catch (error) {
      console.error("Error updating log or book status:", error);
      toast.error("Fejl ved status-opdatering.");
    }
  };

  const updatePageProgress = (logId, newPage) => {
    setReadingLogs(prev =>
      prev.map(log =>
        log.logId === logId ? { ...log, currentPage: newPage } : log
      )
    );
  };

  return (
    <div className="p-6 text-ff_text_light">
      <h1 className="text-3xl font-semibold mb-6">
        Velkommen, {currentUser?.firstName || currentUser?.userId} 👋
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div
          onClick={() => goToFilteredBooks("read")}
          className="cursor-pointer bg-customYellowDark text-black rounded-lg p-4 text-center shadow hover:scale-[1.02] transition"
        >
          <h3 className="text-xl font-semibold">Books read</h3>
          <p className="text-4xl font-bold">{booksReadCount}</p>
        </div>
        <div
          onClick={() => goToFilteredBooks("reading")}
          className="cursor-pointer bg-ff_icon_square_bg_dark text-white rounded-lg p-4 text-center shadow hover:scale-[1.02] transition"
        >
          <h3 className="text-xl font-semibold">Currently reading</h3>
          <p className="text-4xl font-bold">{currentlyReadingCount}</p>
        </div>
        <div
          onClick={() => goToFilteredBooks("unread")}
          className="cursor-pointer bg-darkGrayishBlue text-white rounded-lg p-4 text-center shadow hover:scale-[1.02] transition"
        >
          <h3 className="text-xl font-semibold">Books to read</h3>
          <p className="text-4xl font-bold">{booksToReadCount}</p>
        </div>
      </div>

      {/* Reading Graph */}
      <div className="bg-ff_bg_continer_dark p-6 rounded-lg shadow text-ff_text_light mb-10">
        <h2 className="text-2xl font-semibold mb-4">📈 Reading Progress Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={[
              { date: "Jan", books: 2 },
              { date: "Feb", books: 3 },
              { date: "Mar", books: 1 },
              { date: "Apr", books: 2 },
              { date: "Maj", books: 4 },
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="date" stroke="#cbd5e1" />
            <YAxis allowDecimals={false} stroke="#cbd5e1" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#3E4C59",
                borderColor: "#cbd5e1",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="books"
              stroke="#e6d064"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reading Logs Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">📚 Your Reading Progress</h2>
        {readingLogs.length > 0 ? (
          readingLogs.map(log =>
            log.book ? (
              <CurrentlyReadingBook
                key={log.logId}
                log={log}
                onUpdateProgress={updatePageProgress}
                onStatusChange={() => markAsRead(log.logId)}
              />
            ) : null
          )
        ) : (
          <p className="text-sm text-gray-400">You have no books in progress yet.</p>
        )}
      </div>
    </div>
  );
}
