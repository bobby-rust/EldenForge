import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Retrieves the value of the "include-dlc" key from the localStorage and returns a boolean indicating whether DLC should be included.
 *
 * @return {boolean} Returns false if the value of "include-dlc" in localStorage is "false", otherwise returns true.
 */
export const getIncludeDlcStorageValue = () => {
	return localStorage.getItem("include-dlc") === "false" ? false : true;
};
