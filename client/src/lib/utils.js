import { clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function getCurrentDate() {
  const now = moment();
  return now.format("DD-MM-YYYY")
}
