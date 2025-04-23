function formatDateString(isoString) {
    const date = new Date(isoString);
  
    const dayShort = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(); // FRI
    const monthShort = date.toLocaleString('en-US', { month: 'short' }).toUpperCase(); // APR
    const day = String(date.getDate()).padStart(2, '0'); // 11
    const year = date.getFullYear(); // 2025
    const time = date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase(); // 10:59 PM
  
    return `${dayShort}-${monthShort}-${day}-${year} ${time}`;
  }

  export default formatDateString;