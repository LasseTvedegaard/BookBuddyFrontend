import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/common/Login/UserContext";
import HttpClient from "../services/HttpClient";
import { endpoints } from "../endpoints";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const [booksReadCount, setBooksReadCount] = useState(8);
  const [currentlyReadingCount, setCurrentlyReadingCount] = useState(2);
  const [booksToReadCount, setBooksToReadCount] = useState(5);

  const [readingData, setReadingData] = useState([
    { date: "Jan", books: 2 },
    { date: "Feb", books: 3 },
    { date: "Mar", books: 1 },
    { date: "Apr", books: 2 },
    { date: "Maj", books: 4 },
  ]);
  const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

useEffect(() => {
  const fetchCounts = async () => {
    try {
      const readBooks = await httpClient.get(`${endpoints.books}?status=read`);
      setBooksReadCount(readBooks.length);

      const readingBooks = await httpClient.get(`${endpoints.books}?status=reading`);
      setCurrentlyReadingCount(readingBooks.length);

      const unreadBooks = await httpClient.get(`${endpoints.books}?status=unread`);
      setBooksToReadCount(unreadBooks.length);
    } catch (error) {
      console.error("Error fetching book counts:", error);
    }
  };

  fetchCounts();
}, []);


  const goToFilteredBooks = (status) => {
    navigate(`/books?status=${status}`);
  };

  return (
    <div className="p-6 text-ff_text_light">
      <h1 className="text-3xl font-semibold mb-6">
        Velkommen, {currentUser?.firstName || currentUser?.userId} 👋
      </h1>

      {/* Stats Cards */}
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
      <div className="bg-ff_bg_continer_dark p-6 rounded-lg shadow text-ff_text_light">
        <h2 className="text-2xl font-semibold mb-4">📈 Reading Progress Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={readingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
    </div>
  );
}
