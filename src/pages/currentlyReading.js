import React, { useState } from "react";
import { toast } from "react-toastify";
import HttpClient from "../services/HttpClient";
import { endpoints } from "../endpoints";

function CurrentlyReadingBook({ log }) {
  if (!log || !log.book) {
    return null; // 👈 VIGTIG
  }

  const [currentPage, setCurrentPage] = useState(log.currentPage ?? 0);
  const [status, setStatus] = useState(log.book?.status ?? "reading");
  const [updating, setUpdating] = useState(false);

  const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

  const handlePageUpdate = async () => {
    setUpdating(true);
    try {
      await httpClient.post(`${endpoints.logs}`, {
        bookId: log.book.bookId,
        userId: log.userId,          
        currentPage: Number(currentPage),
        noOfPages: log.noOfPages,
        listType: log.listType,
      });
      toast.success("Ny læselog oprettet!");
    } catch (error) {
      console.error("Fejl ved opdatering af sidetal:", error);
      toast.error("Noget gik galt med sidetallet.");
    }
    setUpdating(false);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await httpClient.put(`${endpoints.books}/${log.book.bookId}`, {
        ...log.book,
        status: newStatus,
      });
      setStatus(newStatus);
      toast.success("Status opdateret!");
    } catch (err) {
      console.error("Fejl ved status-opdatering:", err);
      toast.error("Fejl ved status-opdatering.");
    }
  };

  const progress = Math.min(
    ((currentPage || 0) / (log.noOfPages || 1)) * 100,
    100
  );

  return (
    <div className="bg-gray-800 text-white p-4 mb-4 rounded-md shadow">
      <h3 className="text-lg font-bold">{log.book.title}</h3>
      <p>Af {log.book.author}</p>
      <p>Sidetal: {currentPage} / {log.noOfPages}</p>

      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2 mb-1">
        <div
          className="bg-yellow-400 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mb-2">
        {Math.round(progress)}%
      </p>

      <input
        type="number"
        value={currentPage}
        onChange={(e) => setCurrentPage(e.target.value)}
        className="text-black px-2 py-1 mt-1"
      />
      <button
        onClick={handlePageUpdate}
        className="ml-2 px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600"
        disabled={updating}
      >
        {updating ? "Opdaterer..." : "Gem side"}
      </button>

      <div className="mt-2">
        <label htmlFor="status">Status: </label>
        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-black px-2 py-1"
        >
          <option value="reading">Reading</option>
          <option value="read">Read</option>
          <option value="unread">To Read</option>
        </select>
      </div>
    </div>
  );
}

export default CurrentlyReadingBook;
