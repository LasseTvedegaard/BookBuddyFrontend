import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import HttpClient from "../services/HttpClient";
import { endpoints } from "../endpoints";

const httpClient = HttpClient(process.env.REACT_APP_API_URL); // Kald funktionen korrekt

function BookTable() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState({});
  const [locations, setLocations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    const url = `${endpoints.books}?search=${searchTerm}`;
    try {
      const response = await httpClient.get(url);
      setBooks(response);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, [searchTerm]);

  const fetchGenres = useCallback(async () => {
    try {
      const response = await httpClient.get(endpoints.genres);
      const genreMap = response.reduce((acc, genre) => {
        acc[genre.genreId] = genre.genreName;
        return acc;
      }, {});
      setGenres(genreMap);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await httpClient.get(endpoints.locations);
      const locationMap = response.reduce((acc, location) => {
        acc[location.locationId] = location.locationName;
        return acc;
      }, {});
      setLocations(locationMap);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
    fetchLocations();
  }, [fetchBooks, fetchGenres, fetchLocations]);

  const handleDetailsClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="pb-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-ff_background_light dark:bg-ff_background_dark rounded-t-lg">
        <div>
          <span className="text-3xl font-semibold text-gray-900 dark:text-white">
            Books Overview
          </span>
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            A detailed list of books and their respective details.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-row">
          <input
            type="text"
            placeholder="Search title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 mr-2"
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
          {books &&
            books.map((book) => (
              <tr
                key={book.bookId}
                className="text-left hover:bg-slate-300 hover:bg-opacity-50 dark:hover:bg-opacity-10"
              >
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.title}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.author}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {genres[book.genreId]}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.noOfPages}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.bookType}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.isbnNo}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {locations[book.locationId]}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  {book.status}
                </td>
                <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                  <img src={book.imageURL} alt={book.title} className="h-10 w-10"/>
                </td>
                <td className="py-4 mr-4 items-center justify-center float-right">
                  <button onClick={() => handleDetailsClick(book.bookId)}>
                    <FiMoreHorizontal className="h-5 w-5 text-black dark:text-white" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookTable;
