import { unlink } from "fs";
import { join } from "path";

export function formatDateWithMonthNames(timestamp: number) {
  const date = new Date(timestamp);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()]; // Get the month name
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate = `${month} ${day}, ${hours}:${(0 <= minutes && minutes <= 9) ? `0${minutes}` : minutes}`;
  return formattedDate;
}

export function deleteFile(folder: string, name: string): void {
  unlink(join(__dirname, "../../../", folder, name), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
