import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import HttpClient from "../services/HttpClient";
import { endpoints } from "../endpoints";
import Pagination from "../components/common/Pagination";
import SearchComponent from "../components/common/SearchBar";
import Modal from "../components/common/Modal";
import { useUser } from "../components/common/Login/UserContext.js";
import { toast } from "react-toastify";
import { startReading } from "../utils/logHelpers";

const httpClient = new HttpClient(process.env.REACT_APP_API_URL);

function BookTable() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // 🔑 NY

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilterUI, setStatusFilterUI] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookImage, setSelectedBookImage] = useState(null);

  // -----------------------------
  // LÆS STATUS FRA URL (?status=read|reading|unread)
  // -----------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusFromUrl = params.get("status");

    if (
      statusFromUrl &&
      ["read", "reading", "unread"].includes(statusFromUrl)
    ) {
      setStatusFilterUI(statusFromUrl);
    } else {
      setStatusFilterUI("all");
    }
  }, [location.search]);

  // -----------------------------
  // FETCH ALL BOOKS
  // -----------------------------
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await httpClient.get(endpoints.books);
      if (response && Array.isArray(response)) {
        setBooks(response);
      } else {
        console.error("Expected array but got:", response);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // -----------------------------
  // UNIQUE AUTHORS & GENRES
  // -----------------------------
  const uniqueAuthors = useMemo(() => {
    const authors = books.map((b) => b.author).filter(Boolean);
    return Array.from(new Set(authors)).sort();
  }, [books]);

  const uniqueGenres = useMemo(() => {
    const genres = books.map((b) => b.genre?.genreName).filter(Boolean);
    return Array.from(new Set(genres)).sort();
  }, [books]);

  // -----------------------------
  // FRONTEND FILTERING
  // -----------------------------
  useEffect(() => {
    let result = books;

    if (statusFilterUI !== "all") {
      result = result.filter((b) => b.status === statusFilterUI);
    }

    if (genreFilter !== "all") {
      result = result.filter((b) => b.genre?.genreName === genreFilter);
    }

    if (authorFilter !== "all") {
      result = result.filter((b) => b.author === authorFilter);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term)
      );
    }

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [books, statusFilterUI, genreFilter, authorFilter, searchTerm]);

  // -----------------------------
  // PAGINATION
  // -----------------------------
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // -----------------------------
  // HANDLERS
  // -----------------------------
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

  const handleAddBookClick = () => {
    if (currentUser) {
      navigate("/add-book");
    } else {
      navigate("/login", { state: { from: "/add-book" } });
    }
  };

  const handleStatusChange = async (book, newStatus) => {
    try {
      await httpClient.put(`${endpoints.books}/${book.bookId}/status`, {
        status: newStatus,
      });

      setBooks((prev) =>
        prev.map((b) =>
          b.bookId === book.bookId ? { ...b, status: newStatus } : b
        )
      );

      toast.success("Status updated!");
    } catch (err) {
      toast.error("Failed to update status.");
      console.error(err);
      return;
    }

    if (newStatus === "reading" && currentUser) {
      try {
        await startReading(book, currentUser);
      } catch (err) {
        console.warn("Reading log failed", err);
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilterUI("all");
    setGenreFilter("all");
    setAuthorFilter("all");
    navigate("/books"); // 🔑 ryd også URL
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="container mx-auto p-4 bg-ff_background_light dark:bg-ff_background_dark min-h-screen">
      {/* HEADER */}
      <div className="pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Books Overview
          </span>
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            A detailed list of all books in BookBuddy along with their respective
            details.
          </p>
          {!loading && (
            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredBooks.length} of {books.length} books
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <SearchComponent
            placeholder="Search title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* STATUS */}
          <select
            value={statusFilterUI}
            onChange={(e) => setStatusFilterUI(e.target.value)}
            className="h-10 w-32 pl-3 pr-8 rounded-md 
                       bg-gray-100 dark:bg-gray-800 
                       text-gray-900 dark:text-white 
                       border border-gray-300 dark:border-gray-700
                       text-sm"
          >
            <option value="all">All status</option>
            <option value="unread">Unread</option>
            <option value="reading">Reading</option>
            <option value="read">Read</option>
          </select>

          {/* GENRE */}
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="h-10 w-36 pl-3 pr-8 rounded-md 
                       bg-gray-100 dark:bg-gray-800 
                       text-gray-900 dark:text-white 
                       border border-gray-300 dark:border-gray-700
                       text-sm"
          >
            <option value="all">All genres</option>
            {uniqueGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* AUTHOR */}
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="h-10 w-44 pl-3 pr-8 rounded-md 
                       bg-gray-100 dark:bg-gray-800 
                       text-gray-900 dark:text-white 
                       border border-gray-300 dark:border-gray-700
                       text-sm"
          >
            <option value="all">All authors</option>
            {uniqueAuthors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* CLEAR */}
          <button
            onClick={clearFilters}
            className="h-10 px-3 rounded-md 
                       bg-gray-100 dark:bg-gray-800 
                       text-gray-900 dark:text-white 
                       border border-gray-300 dark:border-gray-700
                       text-sm
                       hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Clear
          </button>

          <button
            onClick={handleAddBookClick}
            className="h-10 px-4 rounded-md 
                       bg-customYellow text-ff_background_dark 
                       font-semibold hover:bg-customYellowDark"
          >
            Add new book
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-customYellow"></div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && (
        <>
          {/* MOBILE */}
          <div className="block md:hidden space-y-4">
            {currentBooks.length > 0 ? (
              currentBooks.map((book) => (
                <div
                  key={book.bookId}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex gap-4">
                    <img
                      src={book.imageURL || ""}
                      alt={book.title}
                      className="h-20 w-14 object-cover rounded cursor-pointer"
                      onClick={() => openModal(book.imageURL)}
                    />

                    <div className="flex-1">
                      <p className="font-bold text-white">{book.title}</p>
                      <p className="text-sm text-gray-400">{book.author}</p>
                      <p className="text-sm text-gray-400">
                        {book.noOfPages} pages
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <select
                          value={book.status}
                          onChange={(e) =>
                            handleStatusChange(book, e.target.value)
                          }
                          className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
                        >
                          <option value="unread">Unread</option>
                          <option value="reading">Reading</option>
                          <option value="read">Read</option>
                        </select>

                        <button
                          onClick={() =>
                            handleDetailsClick(book.bookId)
                          }
                          className="ml-auto text-gray-300"
                        >
                          <FiMoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">
                No books found.
              </p>
            )}
          </div>

          {/* DESKTOP */}
          <div className="hidden md:block">
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
                        index % 2 === 0
                          ? "ff-table-row-even"
                          : "ff-table-row-odd"
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <td className="py-4 px-6">{book.title}</td>
                      <td className="py-4 px-6">{book.author}</td>
                      <td className="py-4 px-6">
                        {book.genre?.genreName}
                      </td>
                      <td className="py-4 px-6">{book.noOfPages}</td>
                      <td className="py-4 px-6">{book.bookType}</td>
                      <td className="py-4 px-6">{book.isbnNo}</td>
                      <td className="py-4 px-6">
                        {book.location?.locationName}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={book.status}
                          onChange={(e) =>
                            handleStatusChange(book, e.target.value)
                          }
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
                          className="h-10 w-10 cursor-pointer object-cover"
                          onClick={() => openModal(book.imageURL)}
                        />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() =>
                            handleDetailsClick(book.bookId)
                          }
                        >
                          <FiMoreHorizontal className="h-5 w-5 text-black dark:text-white" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="py-4 px-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(
                filteredBooks.length / booksPerPage
              )}
              onPageChange={paginate}
            />
          </div>
        </>
      )}

      {/* IMAGE MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <img
          src={selectedBookImage}
          alt="Book"
          className="max-w-full max-h-full"
        />
      </Modal>
    </div>
  );
}

export default BookTable;
