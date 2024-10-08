import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import HttpClient from "../services/HttpClient";
import { endpoints } from "../endpoints";
import Pagination from '../components/common/Pagination';
import SearchComponent from '../components/common/SearchBar';
import Modal from '../components/common/Modal';

const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

function BookTable() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [booksPerPage] = useState(10); // Number of books to display per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookImage, setSelectedBookImage] = useState(null);
  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    const url = `${endpoints.books}?search=${searchTerm}`;
    try {
      const response = await httpClient.get(url);
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

  const openModal = (imageURL) => {
    setSelectedBookImage(imageURL);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBookImage(null);
  };

  // Get current books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          <SearchComponent
            placeholder="Search title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          {currentBooks.length > 0 ? (
            currentBooks.map((book, index) => (
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
                  <img 
                    src={book.imageURL || ""} 
                    alt={book.title} 
                    className="h-10 w-10 cursor-pointer"
                    onClick={() => openModal(book.imageURL)}
                  />
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
      
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage} 
          totalPages={Math.ceil(books.length / booksPerPage)} 
          onPageChange={paginate} 
        />
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <img src={selectedBookImage} alt="Book" className="max-w-full max-h-full" />
      </Modal>
    </div>
  );
}

export default BookTable;
