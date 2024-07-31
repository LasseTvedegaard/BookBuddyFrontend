import { useNavigate } from "react-router-dom";
import HttpClient from "../../services/HttpClient";
import { useEffect, useState } from "react";
import DropDown from "../Book/DropDown";
import { objectShallowCompare } from "@mui/x-data-grid/hooks/utils/useGridSelector";
import { showLoadingToast, updateToast } from "../common/Toast";

const httpClient = new HttpClient(baseUrl);

const BookCreateFrom = () => {
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
        const {name, value} = event.target;
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
            Errors.image = "An image is required"
        }

        return Errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const  validationErrors = validateForm();
        if (object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        let toastId;
        try {
            toastId = showLoadingToast("Creating book...");
            const respone = await httpClient.post("api/book/", formData);
            console.log("response -->" + respone);
            console.log("response.ok -->" + respone.ok);
            if (respone.status === 201) {
                updateToast(toastId, "Book created successfully!", "success");
                console.log("Book created successfully!");
                navigate(
                    location?.state?.previousUrl ? location.state.previousUrl : "/books"
                );
            } else {
                updateToast(toastId, `Error creating book: ${error}`, "error");
                console.log("Error creating case:", error);
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
                    {/* Left Column */}
                    <div className="w-full md:w-1/2 px-3 md:mb-6 md:pr-10">
                    <IconAndText icon={BsInfoSquareFill} text="General" />
                    { /* Title */}
                    <div className="py-2">
                        <label
                            htmlFor="Title"
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
                        value={handleInputChange}
                        className="ff-input w-full"
                        placeholder="Book Title"
                        />
                    </div>
                    
                    </div>
                </div>
            </form>
        </div>
    );
}