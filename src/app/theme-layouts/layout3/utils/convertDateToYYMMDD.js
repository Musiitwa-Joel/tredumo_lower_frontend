const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear(); // Gets the year (e.g., 2024)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Gets month (0-based), so add 1, and pad with '0' if needed
  const day = String(date.getDate()).padStart(2, "0"); // Gets day of the month and pad with '0'

  return `${year}-${month}-${day}`; // Returns in 'YYYY-MM-DD' format
};

export default formatDateToYYYYMMDD;
