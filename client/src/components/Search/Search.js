import React from "react";
import classesCss from "./Search.module.scss";

export const Search = ({ value, updateSearch, className }) => {
  const onSearchValueChange = (e) => {
    updateSearch({ value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const buttonStyle = {
    visibility: "hidden",
    opacity: 0,
    transition: "visibility linear .3s, opacity .3s",
  };
  if (value) {
    buttonStyle.visibility = "visible";
    buttonStyle.opacity = 1;
    buttonStyle.transition = "visibility linear 0s, opacity .5s";
  }
  return (
    <form className={className} onSubmit={handleSubmit}>
      <input
        onChange={onSearchValueChange}
        value={value}
        placeholder="Search country"
        autoFocus={true}
      />
      <button type="submit">Search</button>
      <button style={buttonStyle} onClick={() => updateSearch({ value: "" })}>
        <svg
          className={classesCss.TimesSymbol}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
        >
          <path
            stroke="black"
            stroke-width="8.3"
            stroke-linecap="round"
            d="M14,14 L106,106 M106,14 L14,106"
          />
        </svg>
        {/*<FontAwesomeIcon icon={faTimes} />*/}
      </button>
    </form>
  );
};
class s {
  toString() {
    return 22;
  }
}
