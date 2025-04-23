const formatToShortDate = (timestamp) => {
  // Create a new Date object
  const date = new Date(timestamp);

  // Get day, month, and year
  const day = date.getUTCDate();
  const month = date
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const year = date.getUTCFullYear();

  // Format the date as 'DD-MMM-YYYY'
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

export default formatToShortDate;
