export function formatDateWithMonthNames(timestamp :number) {
    const date = new Date(timestamp);
  
    // Define an array of month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // Extract date and time components
    const day = date.getDate();
    const month = monthNames[date.getMonth()]; // Get the month name
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Create a formatted date and time string
    const formattedDate = `${month} ${day}, ${hours}:${(0 <= minutes && minutes <= 9) ?`0${minutes }` : minutes}`;
  
    return formattedDate;
  }