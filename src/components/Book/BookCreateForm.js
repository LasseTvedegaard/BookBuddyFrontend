import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HttpClient from "../../services/HttpClient";
import DropDown from "../Book/DropDown";
import { showLoadingToast, updateToast } from "../common/Toast";
import { BsInfoSquareFill } from "react-icons/bs";
import IconAndText from "../common/IconAndText"; // Sørg for at importere denne komponent

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
                    {/* Venstre kolonne */}
                    <div className="w-full md:w-1/2 px-3 md:mb-6 md:pr-10">
                        <IconAndText icon={BsInfoSquareFill} text="General" />
                        {/* Titel */}
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
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BookCreateForm;
