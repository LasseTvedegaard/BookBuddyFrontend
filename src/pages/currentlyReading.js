import React, { useState } from "react";
import { toast } from "react-toastify";
import HttpClient from "../services/HttpClient";
import { endpoints } from "../endpoints";

function CurrentlyReadingBook({ log }) {
  // 🔒 Hooks først – altid
  const [currentPage, setCurrentPage] = useState(log?.currentPage ?? 0);
  const [status, setStatus] = useState(log?.book?.status ?? "reading");
  const [updating, setUpdating] = useState(false);

  // 🔒 Early return efter hooks
  if (!log || !log.book) {
    return null;
  }

  const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

  // -----------------------------
  // UPDATE PAGE PROGRESS
  // -----------------------------
  const handlePageUpdate = async () => {
    if (!currentPage || currentPage < 0) {
      toast.error("Ugyldigt sidetal");
      return;
    }

    setUpdating(true);
    try {
      // 🔑 userId kommer fra JWT – ikke fra frontend
      await httpClient.post(`${endpoints.logs}`, {
        bookId: log.book.bookId,
        currentPage: Number(currentPage),
        noOfPages: log.noOfPages,
        listType: "reading",
      });

      toast.success("Side gemt!");
    } catch (error) {
      console.error("Fejl ved opdatering af sidetal:", error);
      toast.error("Noget gik galt med sidetallet.");
    } finally {
      setUpdating(false);
    }
  };

  // -----------------------------
  // UPDATE STATUS (KORREKT ENDPOINT)
  // -----------------------------
  const handleStatusChange = async (newStatus) => {
    try {
      await httpClient.put(
        `${endpoints.books}/${log.book.bookId}/status`,
        { status: newStatus }
      );

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
      <p>Side: {currentPage} / {log.noOfPages}</p>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2 mb-1">
        <div
          className="bg-yellow-400 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mb-2">
        {Math.round(progress)}%
      </p>

      {/* Update page */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={log.noOfPages}
          value={currentPage}
          onChange={(e) => setCurrentPage(e.target.value)}
          className="text-black px-2 py-1"
        />

        <button
          onClick={handlePageUpdate}
          className="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600 disabled:opacity-50"
          disabled={updating}
        >
          {updating ? "Opdaterer..." : "Gem side"}
        </button>
      </div>

      {/* Update status */}
      <div className="mt-3">
        <label htmlFor="status">Status: </label>
        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-black px-2 py-1 ml-2"
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
