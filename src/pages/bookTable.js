import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import HttpClient from "../services/HttpClient";
import { endpoints } from "../endpoints";

const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

function BookTable() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    const url = `${endpoints.books}?search=${searchTerm}`;
    try {
      const response = await httpClient.get(url);
      console.log("Fetched response:", response); // Debugging
      if (response && Array.isArray(response)) {
        setBooks(response);
      } else {
        console.error("Expected array but got:", response);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDetailsClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="container mx-auto p-4 bg-ff_background_light dark:bg-ff_background_dark min-h-screen">
      <div className="pb-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-ff_background_light dark:bg-ff_background_dark rounded-t-lg">
        <div>
          <span className="text-3xl font-semibold text-gray-900 dark:text-white">
            Books Overview
          </span>
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            A detailed list of all books in BookBuddy along with their respective details.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-row">
          <input
            type="text"
            placeholder="Search title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 mr-2 bg-ff_background_light dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            className="ml-2 px-4 py-2 rounded-md bg-customYellow text-ff_background_dark font-semibold hover:bg-customYellowDark"
            onClick={() => navigate("/add-book")}
          >
            Add new book
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-s text-gray-700 uppercase bg-gray-50 dark:bg-ff_bg_sidebar_dark dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-4 w-[200px]">
              Title
            </th>
            <th scope="col" className="px-6 py-4 w-[200px]">
              Author
            </th>
            <th scope="col" className="px-6 py-4 w-[120px]">
              Genre
            </th>
            <th scope="col" className="px-6 py-4 w-[80px]">
              Pages
            </th>
            <th scope="col" className="px-6 py-4 w-[150px]">
              Book Type
            </th>
            <th scope="col" className="px-6 py-4 w-[150px]">
              ISBN
            </th>
            <th scope="col" className="px-6 py-4 w-[150px]">
              Location
            </th>
            <th scope="col" className="px-6 py-4 w-[120px]">
              Status
            </th>
            <th scope="col" className="px-6 py-4 w-[120px]">
              Image
            </th>
            <th scope="col" className="px-6 py-4 float-right">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book, index) => (
              <tr
                key={book.bookId}
                className={`${
                  index % 2 === 0 ? "ff-table-row-even" : "ff-table-row-odd"
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.title || "N/A"}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.author || "N/A"}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.genre ? book.genre.genreName : "N/A"}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.noOfPages || "N/A"}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.bookType || "N/A"}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.isbnNo || "N/A"}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.location ? book.location.locationName : "N/A"}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.status || "N/A"}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  <img src={book.imageURL || ""} alt={book.title} className="h-10 w-10"/>
                </td>
                <td className="py-4 mr-4 items-center justify-center float-right">
                  <button onClick={() => handleDetailsClick(book.bookId)}>
                    <FiMoreHorizontal className="h-5 w-5 text-black dark:text-white" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="py-4 px-6 text-center text-gray-500 dark:text-gray-400">
                No books found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookTable;
