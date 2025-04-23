function checkSchemeStatus(start_date, end_date) {
  const currentDate = Date.now(); // Get the current timestamp

  if (currentDate < start_date) {
    return "not_started";
  } else if (currentDate >= start_date && currentDate <= end_date) {
    return "running";
  } else {
    return "stopped";
  }
}

export default checkSchemeStatus;
