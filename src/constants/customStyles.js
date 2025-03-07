export const customStyles = {
  control: (base, state) => ({
    ...base,
    width: "100%",
    maxWidth: "14rem",
    minWidth: "12rem",
    borderRadius: "5px",
    color: "#FFFFFF", // Brighter text color
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
    backgroundColor: "#444444", // Slightly lighter background for better contrast
    cursor: "pointer",
    border: `2px solid ${state.isFocused ? "#D1C4E9" : "#000000"}`, // Light purple border when focused
    boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)", // Brighter box shadow
    ":hover": {
      border: `2px solid ${state.isFocused ? "#D1C4E9" : "#000000"}`, // Light purple border on hover
      boxShadow: "none",
    },
    input: {
      color: "#FFFFFF", // Ensure text color is white when typing
    },
  }),
  option: (base, state) => ({
    ...base,
    color: "#FFFFFF", // Brighter text color
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
    width: "100%",
    background: state.isSelected ? "#D1C4E9" : "#000000", // Light purple background when selected
    ":hover": {
      backgroundColor: "#D1C4E9", // Light purple background on hover
      color: "#000000", // Text color on hover
      cursor: "pointer",
    },
    input: {
      color: "#FFFFFF", // Ensure text color is white when typing
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#444444",
    maxWidth: "14rem",
    border: "2px solid #D1C4E9", // Light purple border
    borderRadius: "5px",
    boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)",
  }),
  
  placeholder: (base) => ({
    ...base,
    color: "#FFFFFF", // Brighter placeholder text color
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF", // Brighter single value text color
  }),
};
