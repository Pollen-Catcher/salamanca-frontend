import React from "react";

// eslint-disable-next-line react/prop-types
const SearchBar = ({ keyword, setKeyword }) => {
  const BarStyling = {
    width: "20rem",
    background: "#F2F1F9",
    border: "none",
    padding: "0.5rem",
  };
  return (
    <input
      style={BarStyling}
      key="random1"
      value={keyword}
      placeholder="Search"
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
};

export default SearchBar;
