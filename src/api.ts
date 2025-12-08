import { API_BASE } from "$lib/env.js";
import type { DevoteeeProfile, Protocol, Companion } from "@src/app.js";

const DEVOTEE = `${API_BASE}/api/method/custom_booking.custom_booking.doctype.devoteee.`;
const SLOT = `${API_BASE}/api/method/custom_booking.custom_booking.doctype.vip_darshan_slot.vip_darshan_slot.`;
const PROTOCOL = `${API_BASE}/api/method/custom_booking.custom_booking.doctype.vip_protocol.vip_protocol.`;

// Import store functions for logout
import { auth_token, user_logged_in } from "@src/store.js";
import { goto } from "$app/navigation";

// ========== API FUNCTIONS ========== //

// Authentication APIs
export async function loginCheck(phone: string) {
  try {
    const res = await fetch(DEVOTEE + "devoteee.devoteee_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("loginCheck:", err);
    return null;
  }
}

export async function verifyOtpLogin(phone: string, otp: string) {
  try {
    const res = await fetch(DEVOTEE + "devoteee.devoteee_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("verifyOtpLogin:", err);
    return null;
  }
}

// Profile APIs
export async function getDevoteeProfile(token: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return await res.json();
  } catch (err: any) {
    console.error("getDevoteeProfile:", err);
    return null;
  }
}

export async function updateProfile(token: string, profileData: any) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(profileData),
    });
    return await res.json();
  } catch (err: any) {
    console.error("updateProfile:", err);
    return null;
  }
}

// Phone Update APIs
export async function requestUpdatePhone(token: string, newPhone: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_cred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ new_phone: newPhone }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("requestUpdatePhone:", err);
    return null;
  }
}

export async function updatePhone(
  token: string,
  newPhone: string,
  otpPhone: string,
) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_cred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ new_phone: newPhone, otp_phone: otpPhone }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("updatePhone:", err);
    return null;
  }
}

// Email Update APIs
export async function requestUpdateEmail(token: string, newEmail: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_cred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ new_email: newEmail }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("requestUpdateEmail:", err);
    return null;
  }
}

export async function updateEmail(
  token: string,
  newEmail: string,
  otpEmail: string,
) {
  try {
    const res = await fetch(DEVOTEE + "profile.update_cred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ new_email: newEmail, otp_email: otpEmail }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("updateEmail:", err);
    return null;
  }
}

// Companion APIs
export async function getDefaultCompanion(token: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.companion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return await res.json();
  } catch (err: any) {
    console.error("getDefaultCompanion:", err);
    return null;
  }
}

export async function addCompanion(
  token: string,
  companionData: { companion_name: string; gender: string; age: number },
) {
  try {
    const res = await fetch(DEVOTEE + "profile.add_companion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(companionData),
    });
    return await res.json();
  } catch (err: any) {
    console.error("addCompanion:", err);
    return null;
  }
}

export async function removeCompanion(token: string, companionId: string) {
  try {
    const res = await fetch(DEVOTEE + "profile.remove_companion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ companion_id: companionId }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("removeCompanion:", err);
    return null;
  }
}

// Appointment APIs
export async function createAppointment(
  token: string,
  appointmentData: {
    slot: string;
    slot_date: string;
    protocol: string;
    state: string;
    companion: Companion[];
  },
) {
  try {
    const res = await fetch(DEVOTEE + "appointment.create_appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(appointmentData),
    });
    return await res.json();
  } catch (err: any) {
    console.error("createAppointment:", err);
    return null;
  }
}

export async function getAppointment(token: string, appointmentId: string) {
  try {
    const res = await fetch(DEVOTEE + "appointment.get_appointment_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ appointment_id: appointmentId }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getAppointment:", err);
    return null;
  }
}

export async function submitAppointment(token: string, appointmentId: string) {
  try {
    const res = await fetch(DEVOTEE + "appointment.submit_appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ appointment_id: appointmentId }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("submitAppointment:", err);
    return null;
  }
}

export async function getAppointmentList(
  token: string,
  params?: {
    limitStart?: number;
    pageLength?: number;
    darshan_type?: string;
    workflow_state?: string;
  },
) {
  try {
    const res = await fetch(DEVOTEE + "appointment.get_appointment_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(params || {}),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getAppointmentList:", err);
    return null;
  }
}

// Booking Slot APIs
export async function getBookingSlotInfo(token: string, slotDate: string) {
  try {
    const res = await fetch(SLOT + "get_slot_occupancy_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ slot_date: slotDate }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getBookingSlotInfo:", err);
    return null;
  }
}

export async function getVipDarshanSlots(slotDate: string) {
  try {
    const res = await fetch(SLOT + "get_vip_darshan_slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slot_date: slotDate }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getVipDarshanSlots:", err);
    return null;
  }
}

// VIP Protocol APIs
export async function getProtocolInfo(protocolName: string) {
  try {
    const res = await fetch(PROTOCOL + "protocol_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ protocol_name: protocolName }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getProtocolInfo:", err);
    return null;
  }
}

export async function getProtocolList(protocolName: string) {
  try {
    const res = await fetch(PROTOCOL + "protocol_list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ protocol_name: protocolName }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("getProtocolList:", err);
    return null;
  }
}

// Logout function
export async function logout() {
  try {
    // Clear the authentication token
    auth_token.set("");

    // Set user as logged out
    user_logged_in.set(false);

    // Navigate to home page
    await goto("/");

    return { success: true, message: "Logged out successfully" };
  } catch (err: any) {
    console.error("logout:", err);
    return { success: false, message: "Logout failed" };
  }
}
// Utility function to delete all cookies
export function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}
