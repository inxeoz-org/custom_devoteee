import { writable } from "svelte/store";
import { browser } from "$app/environment"; // ✅ critical for SSR

export interface Action {
  id: string;
  label: string;
}

const defaultActions: Action[] = [
  { id: "viewBookings", label: "View Bookings" },
  { id: "bookShigra", label: "Book - Shigra Darshan" },
  { id: "bookVip", label: "Book - VIP Darshan" },
  { id: "bookLocalide", label: "Book - Localide Darshan" },
  { id: "bookBhasm", label: "Book - Bhasm Arti" },
];

const AUTH_TOKEN_NAME = "devotee_auth_token";

// ✅ SAFE localStorage usage
const storedToken = browser ? localStorage.getItem(AUTH_TOKEN_NAME) : "";

export const auth_token = writable<string>(storedToken || "");

// ✅ Sync with localStorage only in browser
if (browser) {
  auth_token.subscribe((value) => {
    if (value) {
      localStorage.setItem(AUTH_TOKEN_NAME, value);
    } else {
      localStorage.removeItem(AUTH_TOKEN_NAME);
    }
  });
}

export const user_logged_in = writable<boolean>(!!storedToken);

export const actionsStore = writable<Action[]>(defaultActions);
