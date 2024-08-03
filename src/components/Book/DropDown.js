import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import Select from 'react-select';
import HttpClient from "../../services/HttpClient";
import { ThemeContext } from "../Theme/ThemeContext";

const baseUrl = process.env.REACT_APP_API_URL;

export default function DropDownForm({
  id,
  endpoint = "",
  options = [],
  labelKey = "label",
  valueKey = "value",
  initialSelected = "",
  onValueChange
}) {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(initialSelected);

  const httpClient = useMemo(() => new HttpClient(baseUrl), [baseUrl]);

  const { theme } = useContext(ThemeContext);

  const customStyles = useMemo(() => ({
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
  }), [theme]);

  const fetchData = useCallback(async () => {
    if (options.length > 0) {
      setData(options);
    } else if (endpoint) {
      console.log(`Fetching data from endpoint: ${endpoint}`);
      try {
        const response = await httpClient.get(endpoint);
        console.log("Fetched response:", response);
        if (response && Array.isArray(response)) {
          const mappedData = response.map(item => ({
            value: item[valueKey],
            label: item[labelKey]
          }));
          setData(mappedData);
          console.log("Mapped data for Select component:", mappedData);
        } else {
          console.warn("Response data is not an array or is missing", response);
        }
      } catch (error) {
        console.error("There was an error fetching the data", error);
      }
    }
  }, [endpoint, httpClient, valueKey, labelKey]);
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (selectedOption) => {
    setSelected(selectedOption);
    onValueChange(selectedOption);
  };

  return (
    <Select
      id={id}
      value={selected}
      onChange={handleChange}
      options={data}
      styles={customStyles}
    />
  );
}
