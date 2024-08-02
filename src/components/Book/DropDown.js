import React, { useState, useEffect, useContext, useMemo } from "react";
import Select from 'react-select';
import HttpClient from "../../services/HttpClient";
import { ThemeContext } from "../Theme/ThemeContext";

const baseUrl = process.env.REACT_APP_API_URL;

export default function DropDownForm({
  endpoint = "",
  options = [],
  labelKey = "label",
  valueKey = "value",
  initialSelected = "",
  onValueChange,
  id, // Accept the id prop here
}) {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(initialSelected);

  const httpClient = useMemo(() => new HttpClient(baseUrl), []);
  const { theme } = useContext(ThemeContext);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      outline: "none",
      backgroundColor: theme === "dark" ? "#1f2937" : "#FFFFFF",
      borderColor: state.isFocused ? "#e6d064" : "#e6d064",
      borderWidth: "0px",
      borderRadius: "0.375rem",
      padding: "0.4rem",
      color: theme === "dark" ? "#FFFFFF" : "#1f2937",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(66, 153, 225, 0.5)" : null,
      "&:hover": {
        borderColor: "#e6d064",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#FFFFFF" : "#1f2937",
    }),
    input: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#FFFFFF" : "#1f2937",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "rgba(230, 208, 100, 0.5)"
        : state.isFocused
        ? theme === "dark"
          ? "#4A5568"
          : "#EBEBEB"
        : theme === "dark"
        ? "#1f2937"
        : "#FFFFFF",
      color: theme === "dark" || state.isSelected ? "#FFFFFF" : "#1f2937",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#1f2937" : "#FFFFFF",
    }),
  };

  useEffect(() => {
    if (options.length > 0) {
      setData(options);
    } else if (endpoint) {
      console.log(`Fetching data from endpoint: ${endpoint}`);
      httpClient
        .get(endpoint)
        .then((response) => {
          console.log("Fetched data:", response); // Log the entire response
          if (response.data) {
            console.log("Fetched data:", response.data); // Log the data property of the response
            if (Array.isArray(response.data)) {
              const mappedData = response.data.map(item => ({
                value: item[valueKey],
                label: item[labelKey]
              }));
              setData(mappedData);
              console.log("Mapped data for Select component:", mappedData);
            } else {
              console.warn("Response data is not an array", response.data);
            }
          } else {
            console.warn("Response data is missing", response);
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the data", error);
        });
    }
  }, [endpoint, httpClient, options, valueKey, labelKey]);

  const handleChange = (selectedOption) => {
    setSelected(selectedOption);
    onValueChange && onValueChange(selectedOption);
  };

  return (
    <Select
      value={selected}
      onChange={handleChange}
      options={data}
      styles={customStyles}
      inputId={id} // Use inputId prop for react-select
    />
  );
}
