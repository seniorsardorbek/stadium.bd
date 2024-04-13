import { unlink } from "fs";
import { join } from "path";

export function formatDateWithMonthNames(timestamp: number) {
  const date = new Date(timestamp);

  const monthNames = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "August",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr",
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()]; // Get the month name
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate = `${month} ${day}, ${hours}:${
    0 <= minutes && minutes <= 9 ? `0${minutes}`:minutes
  }`;
  return formattedDate;
}

export function deleteFile(folder: string, name: string): void {
  unlink(join(__dirname, "../../../", folder, name), (err) => {
    if (err) {
      return;
    }
  });
}

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
