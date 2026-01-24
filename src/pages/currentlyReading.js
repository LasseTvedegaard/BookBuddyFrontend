import React, { useState } from "react";
import { toast } from "react-toastify";

function CurrentlyReadingBook({ log, onUpdateProgress }) {
  const [currentPage, setCurrentPage] = useState(log?.currentPage ?? 0);
  const [status, setStatus] = useState(log?.book?.status ?? "reading");
  const [updating, setUpdating] = useState(false);

  if (!log || !log.book) {
    return null;
  }

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
      await onUpdateProgress(
        log.logId,
        Number(currentPage),
        log.book.bookId,
        log.noOfPages,
        "reading"
      );

      toast.success("Side gemt!");
    } catch (error) {
      console.error("Fejl ved opdatering af sidetal:", error);
      toast.error("Noget gik galt med sidetallet.");
    } finally {
      setUpdating(false);
    }
  };

  // -----------------------------
  // UPDATE STATUS
  // -----------------------------
  const handleStatusChange = async (newStatus) => {
    try {
      const httpClient = new (require("../services/HttpClient").default)(
        process.env.REACT_APP_API_URL
      );

      await httpClient.put(
        `${require("../endpoints").endpoints.books}/${log.book.bookId}/status`,
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
          className="h-10 w-24 px-3 rounded-md 
                     text-gray-900 
                     border border-gray-300 dark:border-gray-700"
        />

        <button
          onClick={handlePageUpdate}
          className="h-10 px-4 bg-yellow-500 text-black rounded-md 
                     hover:bg-yellow-600 disabled:opacity-50"
          disabled={updating}
        >
          {updating ? "Opdaterer..." : "Gem side"}
        </button>
      </div>

      {/* Update status */}
      <div className="mt-3 flex items-center">
        <label htmlFor="status" className="mr-2">
          Status:
        </label>

        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="h-10 w-32 pl-3 pr-8 rounded-md
                     bg-gray-100 dark:bg-gray-800
                     text-gray-900 dark:text-white
                     border border-gray-300 dark:border-gray-700
                     text-sm"
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
