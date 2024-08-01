import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HttpClient from "../../services/HttpClient";
import DropDown from "../Book/DropDown";  // Corrected import statement
import { showLoadingToast, updateToast } from "../common/Toast";
import { BsInfoSquareFill, BsPeopleFill } from "react-icons/bs";
import IconAndText from "../common/IconAndText";

const baseUrl = process.env.REACT_APP_API_URL;
const httpClient = new HttpClient(baseUrl);

const BookCreateForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleDropDownGenre = (selectedOption) => {
        setFormData((prevState) => ({
            ...prevState,
            genre: selectedOption.value,
        }));
    };

    const handleDropDownLocation = (selectedOption) => {
        setFormData((prevState) => ({
            ...prevState,
            location: selectedOption.value,
        }));
    };

    const handleDropDownStatus = (selectedOption) => {
        setFormData((prevState) => ({
            ...prevState,
            location: selectedOption.value,
        }));
    };

    const handleDropDownType = (selectedOption) => {
        setFormData((prevState) => ({
            ...prevState,
            location: selectedOption.value,
        }));
    };


    const validateForm = () => {
        const Errors = {};

        if (!formData.title.trim()) {
            Errors.title = "Title is required.";
        }

        if (!formData.author.trim()) {
            Errors.author = "Author is required.";
        }

        if (!formData.genre.trim()) {
            Errors.genre = "A genre must be selected.";
        }

        if (!formData.isbn.trim()) {
            Errors.isbn = "ISBN is required.";
        }

        if (!formData.location.trim()) {
            Errors.location = "A location must be selected.";
        }

        if (!formData.bookType.trim()) {
            Errors.bookType = "A book type must be selected.";
        }

        if (!formData.pages.trim()) {
            Errors.pages = "The number of pages must be entered.";
        }

        if (!formData.image.trim()) {
            Errors.image = "An image is required.";
        }

        return Errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        let toastId;
        try {
            toastId = showLoadingToast("Creating book...");
            const response = await httpClient.post("api/book/", formData);
            console.log("response -->" + response);
            console.log("response.ok -->" + response.ok);
            if (response.status === 201) {
                updateToast(toastId, "Book created successfully!", "success");
                console.log("Book created successfully!");
                navigate(
                    location?.state?.previousUrl ? location.state.previousUrl : "/books"
                );
            } else {
                updateToast(toastId, `Error creating book: ${response.statusText}`, "error");
                console.log("Error creating book:", response.statusText);
            }
        } catch (error) {
            updateToast(toastId, `Error creating book: ${error}`, "error");
            console.error("Error creating book:", error);
        }
    };

    useEffect(() => {}, [formData]);

    return (
        <div className="w-full bg-white rounded-md dark:bg-ff_bg_continer_dark dark:text-white p-4">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 px-3 md:mb-6 md:pr-10">
                        <div className="py-2">
                            <label
                                htmlFor="title"
                                className="flex justify-between items-center mb-2 text-sm font-medium ff-text"
                            >
                                Title
                                {errors.title && (
                                    <p className="text-red-500 text-xs ml-auto">{errors.title}</p>
                                )}
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
                            <label
                                htmlFor="author"
                                className="flex justify-between items-center mb-2 text-sm font-medium ff-text"
                            >
                                Author
                                {errors.author && (
                                    <p className="text-red-500 text-xs ml-auto">{errors.author}</p>
                                )}
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
                            <label
                                htmlFor="genre"
                                className="flex justify-between items-center mb-2 text-sm font-medium ff-text"
                            >
                                Genre
                                {errors.genre && (
                                    <p className="text-red-500 text-xs ml-auto">{errors.genre}</p>
                                )}
                            </label>
                            <DropDown
                                endpoint="api/genres"
                                labelKey="name"
                                valueKey="id"
                                initialSelected=""
                                onValueChange={handleDropDownGenre}
                            />
                        </div>
                        <div className="py-2">
                            <label
                                htmlFor="pages"
                                className="flex justify-between items-center mb-2 text-sm font-medium ff-text"
                            >
                                Number of pages
                                {errors.pages && (
                                    <p className="text-red-500 text-xs ml-auto">{errors.pages}</p>
                                )}
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
                            <label
                                htmlFor="genre"
                                className="flex justify-between items-center mb-2 text-sm font-medium ff-text"
                            >
                                Type
                                {errors.genre && (
                                    <p className="text-red-500 text-xs ml-auto">{errors.genre}</p>
                                )}
                            </label>
                            <DropDown
                                endpoint="api/genres"
                                labelKey="name"
                                valueKey="id"
                                initialSelected=""
                                onValueChange={handleDropDownType}
                            />
                        </div>

                    </div>
                    {/* Right Column */}
                    <div className="w-full md:w-1/2 px-3 mb-6 md:border-l border-gray-200 dark:border-ff_background_dark md:pl-10">
                        {/* <IconAndText icon={BsPeopleFill} text="Stakeholders" /> */}
                        
                        <div className="py-2">
                            <label
                                htmlFor="isbn"
                                className="flex justify-between items-center mb-2 text-sm font-medium ff-text"
                            >
                                ISBN
                                {errors.isbn && (
                                    <p className="text-red-500 text-xs ml-auto">{errors.isbn}</p>
                                )}
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
                            <label
                                htmlFor="genre"
                                className="flex justify-between items-center mb-2 text-sm font-medium ff-text"
                            >
                                Location
                                {errors.genre && (
                                    <p className="text-red-500 text-xs ml-auto">{errors.genre}</p>
                                )}
                            </label>
                            <DropDown
                                endpoint="api/genres"
                                labelKey="name"
                                valueKey="id"
                                initialSelected=""
                                onValueChange={handleDropDownLocation}
                            />
                        </div>

                        <div className="py-2">
                            <label
                                htmlFor="genre"
                                className="flex justify-between items-center mb-2 text-sm font-medium ff-text"
                            >
                                Status
                                {errors.genre && (
                                    <p className="text-red-500 text-xs ml-auto">{errors.genre}</p>
                                )}
                            </label>
                            <DropDown
                                endpoint="api/genres"
                                labelKey="name"
                                valueKey="id"
                                initialSelected=""
                                onValueChange={handleDropDownStatus}
                            />
                        </div>

                        <div className="py-2">
                            <label
                                htmlFor="image"
                                className="flex justify-between items-center mb-2 text-sm font-medium ff-text"
                            >
                                Image
                                {errors.image && (
                                    <p className="text-red-500 text-xs ml-auto">{errors.image}</p>
                                )}
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
                    className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4"
                >
                    Create new case
                </button>
            </form>
        </div>
    );
};

export default BookCreateForm;
