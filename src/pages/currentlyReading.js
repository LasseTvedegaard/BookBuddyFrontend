// Eksempel-komponent til at vise og opdatere "Currently Reading"-bøger
import React, { useState } from "react";
import axios from "axios";

function CurrentlyReadingBook({ log }) {
  const [currentPage, setCurrentPage] = useState(log.currentPage);
  const [status, setStatus] = useState(log.book.status);
  const [updating, setUpdating] = useState(false);

  const handlePageUpdate = async () => {
    setUpdating(true);
    try {
      await axios.put(`/api/log/${log.logId}`, {
        logId: log.logId,
        bookId: log.book.bookId,
        userId: log.user.userId,
        currentPage: currentPage,
        noOfPages: log.noOfPages,
        listType: log.listType
      });
      alert("Page updated!");
    } catch (error) {
      console.error("Update error", error);
      alert("Something went wrong");
    }
    setUpdating(false);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`/api/books/${log.book.bookId}`, {
        ...log.book,
        status: newStatus
      });
      setStatus(newStatus);
      alert("Status updated!");
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error changing status");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 mb-4 rounded-md shadow">
      <h3 className="text-lg font-bold">{log.book.title}</h3>
      <p>By {log.book.author}</p>
      <p>Current Page: {log.currentPage} / {log.noOfPages}</p>

      <input
        type="number"
        value={currentPage}
        onChange={(e) => setCurrentPage(e.target.value)}
        className="text-black px-2 py-1 mt-2"
      />
      <button
        onClick={handlePageUpdate}
        className="ml-2 px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600"
        disabled={updating}
      >
        {updating ? "Updating..." : "Update Page"}
      </button>

      <div className="mt-2">
        <label htmlFor="status">Change status: </label>
        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-black px-2 py-1"
        >
          <option value="currently reading">Currently Reading</option>
          <option value="read">Read</option>
          <option value="to read">To Read</option>
        </select>
      </div>
    </div>
  );
}

export default CurrentlyReadingBook;
