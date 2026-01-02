import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import HttpClient from "../services/HttpClient";
import { endpoints } from "../endpoints";
import Pagination from '../components/common/Pagination';
import SearchComponent from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import { useUser } from "../components/common/Login/UserContext.js";
import { toast } from "react-toastify";
import { startReading } from "../utils/logHelpers"; 

const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

function BookTable() {
  const { currentUser } = useUser();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookImage, setSelectedBookImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const statusFilter = searchParams.get("status");

  const fetchBooks = useCallback(async () => {
    let url = `${endpoints.books}`;
    const params = [];

    if (searchTerm) params.push(`search=${searchTerm}`);
    if (statusFilter) params.push(`status=${statusFilter}`);

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

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
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, statusFilter]);

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

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddBookClick = () => {
    if (currentUser) {
      navigate("/add-book");
    } else {
      navigate("/login", { state: { from: "/add-book" } });
    }
  };

  const handleStatusChange = async (book, newStatus) => {
  try {
    // ✅ Opdater KUN status i backend
    await httpClient.put(
      `${endpoints.books}/${book.bookId}/status`,
      { status: newStatus }
    );

    // ✅ Log reading-start
    if (newStatus === "reading" && currentUser) {
      await startReading(book, currentUser);
    }

    // ✅ Opdater lokal state
    setBooks(prev =>
      prev.map(b =>
        b.bookId === book.bookId
          ? { ...b, status: newStatus }
          : b
      )
    );

    toast.success("Status updated!");
  } catch (err) {
    toast.error("Failed to update status.");
    console.error(err);
  }
};

  return (
    <div className="container mx-auto p-4 bg-ff_background_light dark:bg-ff_background_dark min-h-screen">
      <div className="pb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <span className="text-3xl font-semibold text-gray-900 dark:text-white">
            Books Overview
          </span>
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            A detailed list of all books in BookBuddy along with their respective details.
          </p>
          {statusFilter && (
            <p className="text-sm italic text-gray-500 mt-1">
              Filtered by status: <strong>{statusFilter}</strong>
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex flex-row">
          <SearchComponent
            placeholder="Search title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleAddBookClick}
            className="ml-2 px-4 py-2 rounded-md bg-customYellow text-ff_background_dark font-semibold hover:bg-customYellowDark"
          >
            Add new book
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-s text-gray-700 uppercase bg-gray-50 dark:bg-ff_bg_sidebar_dark dark:text-gray-400">
          <tr>
            <th className="px-6 py-4 w-[200px]">Title</th>
            <th className="px-6 py-4 w-[200px]">Author</th>
            <th className="px-6 py-4 w-[120px]">Genre</th>
            <th className="px-6 py-4 w-[80px]">Pages</th>
            <th className="px-6 py-4 w-[150px]">Book Type</th>
            <th className="px-6 py-4 w-[150px]">ISBN</th>
            <th className="px-6 py-4 w-[150px]">Location</th>
            <th className="px-6 py-4 w-[150px]">Status</th>
            <th className="px-6 py-4 w-[100px]">Image</th>
            <th className="px-6 py-4">Details</th>
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
                <td className="py-4 px-6">{book.title}</td>
                <td className="py-4 px-6">{book.author}</td>
                <td className="py-4 px-6">{book.genre?.genreName}</td>
                <td className="py-4 px-6">{book.noOfPages}</td>
                <td className="py-4 px-6">{book.bookType}</td>
                <td className="py-4 px-6">{book.isbnNo}</td>
                <td className="py-4 px-6">{book.location?.locationName}</td>
                <td className="py-4 px-6">
                  <select
                    value={book.status}
                    onChange={(e) => handleStatusChange(book, e.target.value)}
                    className="bg-gray-800 text-white px-2 py-1 rounded"
                  >
                    <option value="unread">Unread</option>
                    <option value="reading">Reading</option>
                    <option value="read">Read</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <img
                    src={book.imageURL || ""}
                    alt={book.title}
                    className="h-10 w-10 cursor-pointer"
                    onClick={() => openModal(book.imageURL)}
                  />
                </td>
                <td className="py-4 px-6 text-center">
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

      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(books.length / booksPerPage)}
          onPageChange={paginate}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <img src={selectedBookImage} alt="Book" className="max-w-full max-h-full" />
      </Modal>
    </div>
  );
}

export default BookTable;
