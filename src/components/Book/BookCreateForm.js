import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HttpClient from "../../services/HttpClient";
import DropDownForm from "./DropDown";
import { showLoadingToast, showErrorToast, showSuccessToast, hideToast } from "../common/Toast";
import { endpoints } from "../../endpoints";
import { bookTypes, statuses } from "./BookEnums";

const baseUrl = process.env.REACT_APP_API_URL;
const httpClient = new HttpClient(baseUrl);

const BookCreateForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    pages: "",
    bookType: "",
    isbn: "",
    location: "",
    status: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropDownChange = useCallback((field) => (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: selectedOption,
    }));
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required.";
    }

    if (!formData.author.trim()) {
      errors.author = "Author is required.";
    }

    if (!formData.genre || !formData.genre.value) {
      errors.genre = "A genre must be selected.";
    }

    if (!formData.isbn.trim()) {
      errors.isbn = "ISBN is required.";
    }

    if (!formData.location || !formData.location.value) {
      errors.location = "A location must be selected.";
    }

    if (!formData.bookType || !formData.bookType.value) {
      errors.bookType = "A book type must be selected.";
    }

    if (!formData.pages.trim()) {
      errors.pages = "The number of pages must be entered.";
    }

    if (!formData.image.trim()) {
      errors.image = "An image is required.";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const toastId = showLoadingToast("Creating book...");

    try {
      const submissionData = {
        title: formData.title,
        author: formData.author,
        genre: {
          genreId: formData.genre.value,
          genreName: formData.genre.label,
        },
        noOfPages: parseInt(formData.pages, 10),
        bookType: formData.bookType.value,
        isbnNo: formData.isbn,
        location: {
          locationId: formData.location.value,
          locationName: formData.location.label,
        },
        status: formData.status.value,
        imageURL: formData.image,
      };

      const responseData = await httpClient.post(endpoints.books, submissionData);

      if (responseData) {
        setTimeout(() => {
          hideToast(toastId); // Hide the loading toast
          showSuccessToast("Book created successfully!"); // Show success toast
          navigate("/books");
        }, 1000); // Wait for 1 second before showing the success toast and navigating
      } else {
        throw new Error("No response data");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      hideToast(toastId); // Hide the loading toast
      showErrorToast(`Error creating book: ${errorMessage}`); // Show error toast
    }
  };

  return (
    <div className="w-full bg-white rounded-md dark:bg-ff_bg_continer_dark dark:text-white p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 px-3 md:mb-6 md:pr-10">
            <div className="py-2">
              <label htmlFor="title" className="flex justify-between items-center mb-2 text-sm font-medium ff-text">
                Title
                {errors.title && <p className="text-red-500 text-xs ml-auto">{errors.title}</p>}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="ff-input w-full"
                placeholder="Book Title"
              />
            </div>
            <div className="py-2">
              <label htmlFor="author" className="flex justify-between items-center mb-2 text-sm font-medium ff-text">
                Author
                {errors.author && <p className="text-red-500 text-xs ml-auto">{errors.author}</p>}
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="ff-input w-full"
                placeholder="Author"
              />
            </div>
            <div className="py-2">
              <label htmlFor="genre" className="flex justify-between items-center mb-2 text-sm font-medium ff-text">
                Genre
                {errors.genre && <p className="text-red-500 text-xs ml-auto">{errors.genre}</p>}
              </label>
              <DropDownForm
                id="genre"
                endpoint={endpoints.genres}
                labelKey="genreName"
                valueKey="genreId"
                initialSelected={formData.genre}
                onValueChange={handleDropDownChange("genre")}
              />
            </div>

            <div className="py-2">
              <label htmlFor="pages" className="flex justify-between items-center mb-2 text-sm font-medium ff-text">
                Number of pages
                {errors.pages && <p className="text-red-500 text-xs ml-auto">{errors.pages}</p>}
              </label>
              <input
                type="text"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleInputChange}
                className="ff-input w-full"
                placeholder="Number of pages"
              />
            </div>
            <div className="py-2">
              <label htmlFor="bookType" className="flex justify-between items-center mb-2 text-sm font-medium ff-text">
                Type
                {errors.bookType && <p className="text-red-500 text-xs ml-auto">{errors.bookType}</p>}
              </label>
              <DropDownForm
                id="bookType"
                options={bookTypes}
                labelKey="label"
                valueKey="value"
                initialSelected={formData.bookType}
                onValueChange={handleDropDownChange("bookType")}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:border-l border-gray-200 dark:border-ff_background_dark md:pl-10">
            <div className="py-2">
              <label htmlFor="isbn" className="flex justify-between items-center mb-2 text-sm font-medium ff-text">
                ISBN
                {errors.isbn && <p className="text-red-500 text-xs ml-auto">{errors.isbn}</p>}
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                className="ff-input w-full"
                placeholder="ISBN"
              />
            </div>
            <div className="py-2">
              <label htmlFor="location" className="flex justify-between items-center mb-2 text-sm font-medium ff-text">
                Location
                {errors.location && <p className="text-red-500 text-xs ml-auto">{errors.location}</p>}
              </label>
              <DropDownForm
                id="location"
                endpoint={endpoints.locations}
                labelKey="locationName"
                valueKey="locationId"
                initialSelected={formData.location}
                onValueChange={handleDropDownChange("location")}
              />
            </div>
            <div className="py-2">
              <label htmlFor="status" className="flex justify-between items-center mb-2 text-sm font-medium ff-text">
                Status
                {errors.status && <p className="text-red-500 text-xs ml-auto">{errors.status}</p>}
              </label>
              <DropDownForm
                id="status"
                options={statuses}
                labelKey="label"
                valueKey="value"
                initialSelected={formData.status}
                onValueChange={handleDropDownChange("status")}
              />
            </div>
            <div className="py-2">
              <label htmlFor="image" className="flex justify-between items-center mb-2 text-sm font-medium ff-text">
                Image
                {errors.image && <p className="text-red-500 text-xs ml-auto">{errors.image}</p>}
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="ff-input w-full"
                placeholder="Image URL"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-yellow-700 hover:bg-yellow-800 rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4"
        >
          Create new book
        </button>
      </form>
    </div>
  );
};

export default BookCreateForm;
