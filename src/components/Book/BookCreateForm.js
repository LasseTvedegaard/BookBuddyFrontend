import { useNavigate } from "react-router-dom";
import HttpClient from "../../services/HttpClient";
import { useState } from "react";
import DropDown from "../Book/DropDown";

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
        
    }
}