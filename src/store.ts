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

// ✅ SAFE localStorage usage
const storedToken = browser ? localStorage.getItem("auth_token") : "";

export const auth_token = writable<string>(storedToken || "");

// ✅ Sync with localStorage only in browser
if (browser) {
  auth_token.subscribe((value) => {
    if (value) {
      localStorage.setItem("auth_token", value);
    } else {
      localStorage.removeItem("auth_token");
    }
  });
}

export const user_logged_in = writable<boolean>(!!storedToken);

export const actionsStore = writable<Action[]>(defaultActions);
